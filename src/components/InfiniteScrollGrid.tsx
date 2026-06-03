import React, { useEffect, useRef, FC } from 'react';
import styles from './InfiniteScrollGrid.module.css';
import { MediaItem } from '@/context/ModalContext';
import { getImageUrl } from '@/services/tmdbAPI';
import { storageService } from '@/services/storageService';

interface InfiniteScrollGridProps {
  items: any[];
  type: 'movie' | 'tv';
  isLoading: boolean;
  hasMore: boolean;
  title: string;
  onLoadMore: () => void;
  onMediaSelect: (item: any, type: 'movie' | 'tv') => void;
  onListToggle?: (item: MediaItem) => void;
}

export const InfiniteScrollGrid: FC<InfiniteScrollGridProps> = ({
  items,
  type,
  isLoading,
  hasMore,
  title,
  onLoadMore,
  onMediaSelect,
  onListToggle,
}) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
          onLoadMore();
        }
      },
      { threshold: 0.5 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [isLoading, hasMore, onLoadMore]);

  const handleListToggle = (item: any) => {
    if (onListToggle) {
      const mediaItem: MediaItem = {
        id: item.id,
        type,
        title: item.title || item.name,
        poster_path: item.poster_path,
        overview: item.overview,
        release_date: item.release_date,
        first_air_date: item.first_air_date,
        vote_average: item.vote_average,
      };
      onListToggle(mediaItem);
    }
  };

  const handleCardClick = (item: any, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onMediaSelect(item, type);
  };

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h2>{title}</h2>
      </div>
      <div className={styles.grid}>
        {items.map((item) => {
          const title = item.title || item.name;
          const isInList = storageService.isInList(item.id, type);
          return (
            <div
              key={`${type}_${item.id}`}
              className={styles.card}
              onClick={(e) => handleCardClick(item, e)}
            >
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
              </div>
              {onListToggle && (
                <button
                  className={`${styles.listBtn} ${isInList ? styles.added : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleListToggle(item);
                  }}
                  title={isInList ? 'Remove from My List' : 'Add to My List'}
                >
                  {isInList ? '✓' : '+'}
                </button>
              )}
            </div>
          );
        })}
      </div>
      <div ref={sentinelRef} className={styles.sentinel}>
        {isLoading ? 'Loading...' : hasMore ? 'Scroll for more' : 'End of catalog'}
      </div>
    </div>
  );
};
