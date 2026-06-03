import React, { useState, useEffect, FC } from 'react';
import styles from './MediaModal.module.css';
import { tmdbAPI, getImageUrl, getBackdropUrl } from '@/services/tmdbAPI';
import { storageService } from '@/services/storageService';
import { MediaItem } from '@/context/ModalContext';
import { usePlayer } from '@/hooks/usePlayer';
import { useNavigation } from '@/hooks/useNavigation';

interface MediaModalProps {
  isOpen: boolean;
  media: MediaItem | null;
  season?: number;
  episode?: number;
  onClose: () => void;
}

interface MediaDetails {
  id: number;
  title?: string;
  name?: string;
  backdrop_path: string | null;
  poster_path: string | null;
  overview: string;
  genres: Array<{ id: number; name: string }>;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  runtime?: number;
  number_of_seasons?: number;
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
  };
  similar?: { results: any[] };
  recommendations?: { results: any[] };
  videos?: { results: any[] };
  seasons?: Array<{
    season_number: number;
    name: string;
    episode_count: number;
  }>;
}

export const MediaModal: FC<MediaModalProps> = ({ isOpen, media, season = 1, episode = 1, onClose }) => {
  const [details, setDetails] = useState<MediaDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(season);
  const [selectedEpisode, setSelectedEpisode] = useState(episode);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [currentReaction, setCurrentReaction] = useState<string | null>(null);
  const [inMyList, setInMyList] = useState(false);
  const { openPlayer } = usePlayer();
  const { goBack } = useNavigation();

  useEffect(() => {
    if (!isOpen || !media) return;

    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const res =
          media.type === 'movie'
            ? await tmdbAPI.getMovieDetails(media.id)
            : await tmdbAPI.getTVDetails(media.id);
        setDetails(res.data);
        setCurrentReaction(storageService.getReaction(media.type, media.id));
        setInMyList(storageService.isInList(media.id, media.type));
        setSelectedSeason(season);
        setSelectedEpisode(episode);

        if (media.type === 'tv') {
          await loadEpisodes(media.id, season);
        }
      } catch (error) {
        console.error('Failed to fetch details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [isOpen, media, season, episode]);

  const loadEpisodes = async (tvId: number, seasonNum: number) => {
    try {
      const res = await tmdbAPI.getSeasonDetails(tvId, seasonNum);
      setEpisodes(res.data.episodes || []);
    } catch (error) {
      console.error('Failed to load episodes:', error);
    }
  };

  const handleSeasonChange = async (newSeason: number) => {
    setSelectedSeason(newSeason);
    setSelectedEpisode(1);
    if (media?.type === 'tv') {
      await loadEpisodes(media.id, newSeason);
    }
  };

  const handlePlayClick = () => {
    if (!media) return;
    openPlayer(media, selectedSeason, selectedEpisode);
  };

  const handleListToggle = () => {
    if (!media) return;
    if (inMyList) {
      storageService.removeFromList(media.id, media.type);
    } else {
      storageService.addToList(media);
    }
    setInMyList(!inMyList);
  };

  const handleReactionClick = (reaction: string) => {
    if (!media) return;
    const newReaction = storageService.toggleReaction(media.type, media.id, reaction);
    setCurrentReaction(newReaction);
  };

  if (!isOpen || !media) return null;

  const title = details?.title || details?.name || media.title || 'N/A';
  const rating = details?.vote_average?.toFixed(1) || 'N/A';
  const genres = details?.genres?.map(g => g.name).join(', ') || '';
  const year = (details?.release_date || details?.first_air_date || '').split('-')[0] || 'TBA';
  const runtime = details?.runtime ? `${details.runtime} min` : (details?.number_of_seasons ? `${details.number_of_seasons} Seasons` : 'N/A');
  const cast = details?.credits?.cast?.slice(0, 8) || [];
  const similar = details?.similar?.results?.slice(0, 8) || [];
  const trailers = details?.videos?.results?.filter(v => v.type === 'Trailer' || v.type === 'Teaser').slice(0, 4) || [];

  return (
    <div className={`${styles.modalOverlay} ${isOpen ? styles.active : ''}`} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>✕</button>
        <button className={styles.modalBack} onClick={() => { onClose(); goBack(); }} title="Go back">
          ← Back
        </button>

        {isLoading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <>
            <div
              className={styles.modalHero}
              style={{ backgroundImage: `url(${getBackdropUrl(details?.backdrop_path || media.poster_path)})` }}
            >
              <div className={styles.heroGradient} />
              <div className={styles.heroContent}>
                <div className={styles.modalTitle}>{title}</div>
                <div className={styles.modalMetaRow}>
                  <span className={styles.modalRating}>⭐ {rating}</span>
                  <span>{year}</span>
                  <span>{runtime}</span>
                </div>
                <div className={styles.modalGenres}>
                  {genres.split(',').map((g, i) => (
                    <span key={i} className={styles.genreTag}>{g.trim()}</span>
                  ))}
                </div>
                <div className={styles.modalActions}>
                  <button className={styles.modalPlayBtn} onClick={handlePlayClick}>▶ Play</button>
                  <button className={styles.modalMyListBtn} onClick={handleListToggle}>
                    {inMyList ? '✓ In My List' : '+ My List'}
                  </button>
                  <div className={styles.reactionGroup}>
                    <button
                      className={`${styles.reactionBtn} ${currentReaction === 'like' ? styles.active : ''}`}
                      onClick={() => handleReactionClick('like')}
                    >
                      👍 Like
                    </button>
                    <button
                      className={`${styles.reactionBtn} ${currentReaction === 'awesome' ? styles.active : ''}`}
                      onClick={() => handleReactionClick('awesome')}
                    >
                      😍 Awesome
                    </button>
                    <button
                      className={`${styles.reactionBtn} ${currentReaction === 'trash' ? styles.active : ''}`}
                      onClick={() => handleReactionClick('trash')}
                    >
                      🗑️ Trash
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.modalDetails}>
              <div className={styles.overview}>
                <p>{details?.overview || 'No overview available.'}</p>
              </div>

              {cast.length > 0 && (
                <div className={styles.detailSection}>
                  <h3>🎭 Cast</h3>
                  <div className={styles.castGrid}>
                    {cast.map((member) => (
                      <div key={member.id} className={styles.castCard}>
                        <img
                          className={styles.castImg}
                          src={getImageUrl(member.profile_path)}
                          alt={member.name}
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.src = getImageUrl(null);
                          }}
                        />
                        <div className={styles.castName}>{member.name}</div>
                        <div className={styles.castCharacter}>{member.character}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {details?.type === 'tv' && (
                <div className={styles.detailSection}>
                  <h3>📺 Episodes</h3>
                  {details.seasons && (
                    <select
                      className={styles.seasonDropdown}
                      value={selectedSeason}
                      onChange={(e) => handleSeasonChange(parseInt(e.target.value))}
                    >
                      {details.seasons
                        .filter(s => s.season_number > 0)
                        .map(s => (
                          <option key={s.season_number} value={s.season_number}>
                            Season {s.season_number}
                          </option>
                        ))}
                    </select>
                  )}
                  {episodes.length > 0 && (
                    <div className={styles.episodesList}>
                      {episodes.map((ep) => (
                        <div
                          key={ep.episode_number}
                          className={styles.episodeItem}
                          onClick={() => setSelectedEpisode(ep.episode_number)}
                        >
                          <img
                            className={styles.episodeImg}
                            src={getImageUrl(ep.still_path)}
                            alt={`Episode ${ep.episode_number}`}
                            onError={(e) => {
                              const img = e.target as HTMLImageElement;
                              img.src = getImageUrl(null);
                            }}
                          />
                          <div className={styles.episodeInfo}>
                            <strong>E{ep.episode_number}</strong> {ep.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {similar.length > 0 && (
                <div className={styles.detailSection}>
                  <h3>🎬 Similar {media.type === 'movie' ? 'Movies' : 'Shows'}</h3>
                  <div className={styles.similarGrid}>
                    {similar.map((item) => (
                      <div key={item.id} className={styles.similarCard}>
                        <img
                          src={getImageUrl(item.poster_path)}
                          alt={item.title || item.name}
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.src = getImageUrl(null);
                          }}
                        />
                        <div>{item.title || item.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {trailers.length > 0 && (
                <div className={styles.detailSection}>
                  <h3>🎥 Trailers</h3>
                  <div className={styles.trailersList}>
                    {trailers.map((trailer) => (
                      <button
                        key={trailer.id}
                        className={styles.trailerBtn}
                        onClick={() => window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank')}
                      >
                        ▶ {trailer.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
