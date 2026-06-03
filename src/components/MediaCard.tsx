import React, { FC } from 'react';
import styles from './MediaCard.module.css';
import { getImageUrl } from '@/services/tmdbAPI';
import { storageService } from '@/services/storageService';
import { MediaItem } from '@/context/ModalContext';

interface MediaCardProps {
  item: any;
  type: 'movie' | 'tv';
  onClick: () => void;
  onListToggle?: (item: MediaItem) => void;
  showProgressBadge?: boolean;
  progressText?: string;
}

export const MediaCard: FC<MediaCardProps> = ({
  item,
  type,
  onClick,
  onListToggle,
  showProgressBadge,
  progressText,
}) => {
  const title = type === 'movie' ? item.title : item.name;
  const rating = item.vote_average?.toFixed(1) || 'N/A';
  const isInList = storageService.isInList(item.id, type);

  const handleListClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onListToggle) {
      const mediaItem: MediaItem = {
        id: item.id,
        type,
        title,
        poster_path: item.poster_path,
        overview: item.overview,
        release_date: item.release_date,
        first_air_date: item.first_air_date,
        vote_average: item.vote_average,
      };
      onListToggle(mediaItem);
    }
  };

  return (
    <div className={styles.card} onClick={onClick}>
      <img
        className={styles.cardImg}
        src={getImageUrl(item.poster_path)}
        alt={title}
        loading="lazy"
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          img.src = getImageUrl(null);
        }}
      />
      <div className={styles.cardInfo}>
        <div className={styles.cardTitle}>{title}</div>
        <div className={styles.cardRating}>⭐ {rating}</div>
      </div>
      {onListToggle && (
        <div className={styles.cardButtons}>
          <button
            className={`${styles.myListBtn} ${isInList ? styles.added : ''}`}
            onClick={handleListClick}
            title={isInList ? 'Remove from My List' : 'Add to My List'}
          >
            {isInList ? '✓' : '+'}
          </button>
        </div>
      )}
      {showProgressBadge && progressText && (
        <div className={styles.progressBadge}>{progressText}</div>
      )}
    </div>
  );
};
