import React, { FC, useEffect, useState } from 'react';
import styles from './WatchPage.module.css';
import { useNavigate } from 'react-router-dom';
import { storageService } from '@/services/storageService';
import { playerService } from '@/services/playerService';
import { tmdbAPI } from '@/services/tmdbAPI';

interface WatchPageProps {
  type: 'movie' | 'tv';
  id: number;
  season?: number;
  episode?: number;
  title?: string;
}

interface Episode {
  episode_number: number;
  name: string;
  still_path: string | null;
  air_date: string;
  overview?: string;
}

const IMG_BASE = 'https://image.tmdb.org/t/p/w342';

export const WatchPage: FC<WatchPageProps> = ({ type, id, season = 1, episode = 1, title = 'Player' }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSeason, setCurrentSeason] = useState(season);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [seasons, setSeasons] = useState<number[]>([]);
  const [showEpisodeSelector, setShowEpisodeSelector] = useState(false);

  // Fetch seasons for TV shows
  useEffect(() => {
    if (type === 'tv') {
      const fetchSeasons = async () => {
        try {
          const res = await tmdbAPI.getTVDetails(id);
          const seasonNumbers = res.data.seasons
            ?.filter((s: any) => s.season_number > 0)
            .map((s: any) => s.season_number) || [];
          setSeasons(seasonNumbers);
        } catch (err) {
          console.error('Error fetching seasons:', err);
        }
      };
      fetchSeasons();
    }
  }, [type, id]);

  // Fetch episodes when season changes
  useEffect(() => {
    if (type === 'tv') {
      const fetchEpisodes = async () => {
        try {
          const res = await tmdbAPI.getSeasonDetails(id, currentSeason);
          setEpisodes(res.data.episodes || []);
        } catch (err) {
          console.error('Error fetching episodes:', err);
        }
      };
      fetchEpisodes();
    }
  }, [type, id, currentSeason]);

  // Play current episode
  const playEpisode = async (s: number, e: number) => {
    try {
      setIsLoading(true);
      setError(null);

      let url: string;
      if (type === 'movie') {
        url = await playerService.getMoviePlayerUrl(id);
      } else {
        url = await playerService.getTVPlayerUrl(id, s, e);
      }

      console.log(`📺 Opening VidSrc: ${url}`);

      // Update watch history
      storageService.updateWatchHistory({
        id,
        type,
        title,
        poster_path: '',
        ...(type === 'tv' && { season: s, episode: e }),
      });

      // Navigate to VidSrc in same tab (like qw.html)
      window.location.href = url;
    } catch (err) {
      console.error('Error fetching player URL:', err);
      setError(`Failed to load player. (ID: ${id})`);
      setIsLoading(false);
    }
  };

  // Play on mount (for movies only - TV shows wait for episode selection)
  useEffect(() => {
    if (type === 'movie') {
      playEpisode(1, 1);
    }
  }, []);

  // For TV shows, show selector once episodes are loaded
  useEffect(() => {
    if (type === 'tv' && episodes.length > 0) {
      setShowEpisodeSelector(true);
      setIsLoading(false);
    }
  }, [episodes]);

  return (
    <div className={styles.watchContainer}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>
        <h1>{title}</h1>
      </div>

      {type === 'tv' && showEpisodeSelector && (
        <div className={styles.episodeSelector}>
          <div className={styles.selectorContent}>
            <div className={styles.episodesHeader}>
              <h2>📺 Episodes</h2>
              
              {/* Season Selector */}
              <select 
                className={styles.seasonSelect}
                value={currentSeason} 
                onChange={(e) => setCurrentSeason(Number(e.target.value))}
              >
                {seasons.map(s => (
                  <option key={s} value={s}>Season {s}</option>
                ))}
              </select>
            </div>

            {/* Episodes Grid */}
            {episodes.length > 0 && (
              <div className={styles.episodesGrid}>
                {episodes.map((ep: Episode) => (
                  <div 
                    key={ep.episode_number}
                    className={styles.episodeCard}
                    onClick={() => playEpisode(currentSeason, ep.episode_number)}
                  >
                    {ep.still_path ? (
                      <img 
                        src={`${IMG_BASE}${ep.still_path}`} 
                        alt={`Episode ${ep.episode_number}`}
                        className={styles.episodeImage}
                      />
                    ) : (
                      <div className={styles.episodePlaceholder}>No Image</div>
                    )}
                    <div className={styles.episodeInfo}>
                      <div className={styles.episodeNumber}>E{ep.episode_number}</div>
                      <div className={styles.episodeName}>{ep.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && <p className={styles.errorMessage}>{error}</p>}
          </div>
        </div>
      )}

      {isLoading && (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading player...</p>
          {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
      )}
    </div>
  );
};
