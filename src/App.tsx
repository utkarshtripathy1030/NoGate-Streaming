import React, { useState, useCallback, useEffect } from 'react';
import './App.css';
import { Routes, Route, useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { HeroCarousel } from '@/components/HeroCarousel';
import { MediaRow } from '@/components/MediaRow';
import { MediaModal } from '@/components/MediaModal';
import { InfiniteScrollGrid } from '@/components/InfiniteScrollGrid';
import { PlayerOverlay } from '@/components/PlayerOverlay';
import { CreateProfileModal } from '@/components/CreateProfileModal';
import { ProfilePage } from '@/components/ProfilePage';
import { WatchPage } from '@/components/WatchPage';
import { WhoIsWatching } from '@/components/WhoIsWatching';
import { useMyList, useTrendingMedia, useGenreMovies, useInfiniteScroll, useSearch } from '@/hooks/useMedia';
import { useProfile } from '@/hooks/useProfile';
import { storageService } from '@/services/storageService';
import { GENRES } from '@/services/tmdbAPI';
import { MediaItem } from '@/context/ModalContext';

type NavigationType = 'home' | 'tv' | 'movies' | 'profile';

// Movie Watch Page Route
const MovieWatchRoute = () => {
  const { id } = useParams<{ id: string }>();
  return id ? <WatchPage type="movie" id={parseInt(id)} /> : null;
};

// TV Watch Page Route
const TVWatchRoute = () => {
  const { id, season, episode } = useParams<{ id: string; season?: string; episode?: string }>();
  return id ? (
    <WatchPage
      type="tv"
      id={parseInt(id)}
      season={season ? parseInt(season) : 1}
      episode={episode ? parseInt(episode) : 1}
    />
  ) : null;
};

function AppContent() {
  const [currentNav, setCurrentNav] = useState<NavigationType>('home');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateProfile, setShowCreateProfile] = useState(false);

  const { profiles, selectedProfile, isLoading } = useProfile();

  // Show WhoIsWatching screen if no profile selected but profiles exist
  // Show CreateProfileModal if no profiles exist
  // Wait for profiles to finish loading before showing anything
  useEffect(() => {
    if (isLoading) {
      // Don't show anything while loading
      return;
    }
    
    if (profiles.length === 0) {
      setShowCreateProfile(true);
    } else if (!selectedProfile && profiles.length > 0) {
      // Profiles exist but none selected - show WhoIsWatching instead
      setShowCreateProfile(false);
    } else if (selectedProfile) {
      // Profile is selected - dismiss the modal
      setShowCreateProfile(false);
    }
  }, [profiles.length, selectedProfile, isLoading]);

  const handleDismissProfile = () => {
    setShowCreateProfile(false);
  };

  const { myList, addItem, removeItem } = useMyList();
  const { movies: trendingMovies, series: trendingSeries, isLoading: trendingLoading } = useTrendingMedia();
  const {
    items: infiniteItems,
    isLoading: infiniteLoading,
    hasMore,
    loadMore: loadMoreInfinite,
    reset: resetInfinite,
  } = useInfiniteScroll(currentNav === 'tv' ? 'tv' : 'movie');

  const { search, suggestions } = useSearch();

  const watchHistory = React.useMemo(() => {
    return storageService.getWatchHistory();
  }, []);

  const handleMediaSelect = useCallback(
    (item: any, type: 'movie' | 'tv', season = 1, episode = 1) => {
      setSelectedMedia({
        id: item.id,
        type,
        title: item.title || item.name,
        poster_path: item.poster_path,
        overview: item.overview,
        release_date: item.release_date,
        first_air_date: item.first_air_date,
        vote_average: item.vote_average,
      });
      setSelectedSeason(season);
      setSelectedEpisode(episode);
      setIsModalOpen(true);
      setSearchMode(false);
    },
    []
  );

  const handleListToggle = useCallback((item: MediaItem) => {
    if (storageService.isInList(item.id, item.type)) {
      removeItem(item.id, item.type);
      storageService.removeFromList(item.id, item.type);
    } else {
      addItem(item);
      storageService.addToList(item);
    }
  }, [addItem, removeItem]);

  const handleNavChange = (nav: NavigationType) => {
    setCurrentNav(nav);
    setSearchMode(false);
    resetInfinite();
    if (nav !== 'profile') {
      window.scrollTo(0, 0);
    }
  };

  const handleSearchStart = () => {
    if (searchQuery.trim()) {
      setSearchMode(true);
      search(searchQuery);
      window.scrollTo(0, 400);
    }
  };

  return (
    <div className="app">
      {/* Wait for profiles to load before rendering anything */}
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div>Loading...</div>
        </div>
      ) : (
        <>
          {/* Show WhoIsWatching if profiles exist but none selected */}
          {profiles.length > 0 && !selectedProfile ? (
            <WhoIsWatching />
          ) : (
            <>
              <Header
                currentNav={currentNav}
                onNavChange={handleNavChange}
                onMediaSelect={handleMediaSelect}
                onSearchStart={handleSearchStart}
              />

              {currentNav === 'profile' ? (
                <ProfilePage />
              ) : !searchMode ? (
                <>
                  {currentNav === 'home' && <HeroCarousel onMediaSelect={handleMediaSelect} />}

                  {currentNav === 'home' && (
                    <>
                      {myList.length > 0 && (
                        <MediaRow
                          title="My List"
                          items={myList}
                          type={myList[0]?.type || 'movie'}
                          onMediaSelect={handleMediaSelect}
                          onListToggle={handleListToggle}
                        />
                      )}

                      {watchHistory.length > 0 && (
                        <MediaRow
                          title="Continue Watching"
                          items={watchHistory}
                          type={watchHistory[0]?.type || 'movie'}
                          onMediaSelect={(item) =>
                            handleMediaSelect(item, item.type, item.season, item.episode)
                          }
                          onListToggle={handleListToggle}
                        />
                      )}

                      <MediaRow
                        title="Trending Movies"
                        items={trendingMovies}
                        type="movie"
                        isLoading={trendingLoading}
                        onMediaSelect={handleMediaSelect}
                        onListToggle={handleListToggle}
                      />

                      <MediaRow
                        title="Popular Series"
                        items={trendingSeries}
                        type="tv"
                        isLoading={trendingLoading}
                        onMediaSelect={handleMediaSelect}
                        onListToggle={handleListToggle}
                      />

                      {GENRES.map((genre) => (
                        <GenreRow
                          key={genre.id}
                          genre={genre}
                          onMediaSelect={handleMediaSelect}
                          onListToggle={handleListToggle}
                        />
                      ))}
                    </>
                  )}

                  <InfiniteScrollGrid
                    title={
                      currentNav === 'tv'
                        ? 'More TV Series'
                        : currentNav === 'movies'
                          ? 'More Movies'
                          : 'More to Explore'
                    }
                    items={infiniteItems}
                    type={currentNav === 'tv' ? 'tv' : 'movie'}
                    isLoading={infiniteLoading}
                    hasMore={hasMore}
                    onLoadMore={loadMoreInfinite}
                    onMediaSelect={handleMediaSelect}
                    onListToggle={handleListToggle}
                  />
                </>
              ) : (
                <InfiniteScrollGrid
                  title={`Search Results for "${searchQuery}"`}
                  items={suggestions}
                  type="movie"
                  isLoading={false}
                  hasMore={false}
                  onLoadMore={() => {}}
                  onMediaSelect={handleMediaSelect}
                  onListToggle={handleListToggle}
                />
              )}

              <MediaModal
                isOpen={isModalOpen}
                media={selectedMedia}
                season={selectedSeason}
                episode={selectedEpisode}
                onClose={() => setIsModalOpen(false)}
              />

              <PlayerOverlay />
              <CreateProfileModal isOpen={showCreateProfile} onClose={handleDismissProfile} />
            </>
          )}
        </>
      )}
    </div>
  );
}

// Genre Row Component
const GenreRow: React.FC<{
  genre: { id: number; name: string };
  onMediaSelect: (item: any, type: 'movie' | 'tv') => void;
  onListToggle: (item: MediaItem) => void;
}> = ({ genre, onMediaSelect, onListToggle }) => {
  const { movies, isLoading } = useGenreMovies(genre.id);

  if (movies.length === 0 && !isLoading) return null;

  return (
    <MediaRow
      title={`${genre.name} Movies`}
      items={movies}
      type="movie"
      isLoading={isLoading}
      onMediaSelect={onMediaSelect}
      onListToggle={onListToggle}
    />
  );
};

import { NavigationProvider } from '@/context/NavigationContext';
import { PlayerProvider } from '@/context/PlayerContext';

function App() {
  return (
    <NavigationProvider>
      <PlayerProvider>
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="/watch/movie/:id" element={<MovieWatchRoute />} />
          <Route path="/watch/tv/:id/:season?/:episode?" element={<TVWatchRoute />} />
        </Routes>
      </PlayerProvider>
    </NavigationProvider>
  );
}

export default App;
