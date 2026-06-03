import React, { FC } from 'react';
import styles from './SkeletonLoader.module.css';

interface SkeletonLoaderProps {
  type?: 'card' | 'row' | 'text' | 'avatar' | 'grid';
  count?: number;
  width?: string;
  height?: string;
  className?: string;
}

export const SkeletonLoader: FC<SkeletonLoaderProps> = ({
  type = 'card',
  count = 1,
  width = '100%',
  height = '100%',
  className = '',
}) => {
  const renderSkeleton = (key: number) => {
    switch (type) {
      case 'avatar':
        return (
          <div
            key={key}
            className={`${styles.skeleton} ${styles.avatar}`}
            style={{ width: '80px', height: '80px' }}
          />
        );
      case 'text':
        return (
          <div
            key={key}
            className={`${styles.skeleton} ${styles.text}`}
            style={{ width, height: '1rem', marginBottom: '0.5rem' }}
          />
        );
      case 'card':
        return (
          <div key={key} className={`${styles.skeleton} ${styles.card}`} />
        );
      case 'row':
        return (
          <div key={key} className={`${styles.skeleton} ${styles.row}`} />
        );
      case 'grid':
        return (
          <div key={key} className={`${styles.skeleton} ${styles.gridItem}`} />
        );
      default:
        return (
          <div
            key={key}
            className={`${styles.skeleton}`}
            style={{ width, height }}
          />
        );
    }
  };

  return (
    <div className={`${styles.container} ${className}`}>
      {Array.from({ length: count }).map((_, i) => renderSkeleton(i))}
    </div>
  );
};

export default SkeletonLoader;
