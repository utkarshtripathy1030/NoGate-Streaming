import React, { FC } from 'react';
import styles from './MediaRow.module.css';
import { MediaCard } from './MediaCard';
import { storageService } from '@/services/storageService';
import { MediaItem } from '@/context/ModalContext';

interface MediaRowProps {
  title: string;
  items: any[];
  type: 'movie' | 'tv';
  isLoading?: boolean;
  onMediaSelect: (item: any, type: 'movie' | 'tv') => void;
  onListToggle?: (item: MediaItem) => void;
}

export const MediaRow: FC<MediaRowProps> = ({
  title,
  items,
  type,
  isLoading,
  onMediaSelect,
  onListToggle,
}) => {
  if (isLoading) {
    return (
      <div className={styles.row}>
        <div className={styles.rowHeader}>
          <h2>{title}</h2>
        </div>
        <div className={styles.rowCards}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className={styles.skeletonCard} />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={styles.row}>
      <div className={styles.rowHeader}>
        <h2>{title}</h2>
        <span className={styles.hint}>→ scroll →</span>
      </div>
      <div className={styles.rowCards}>
        {items.map((item) => (
          <MediaCard
            key={`${type}_${item.id}`}
            item={item}
            type={type}
            onClick={() => onMediaSelect(item, type)}
            onListToggle={onListToggle}
          />
        ))}
      </div>
    </div>
  );
};
