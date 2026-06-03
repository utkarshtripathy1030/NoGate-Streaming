import React, { useState, useEffect, FC } from 'react';
import styles from './HeroCarousel.module.css';
import { getBackdropUrl } from '@/services/tmdbAPI';
import { useHeroCarousel } from '@/hooks/useMedia';

interface HeroCarouselProps {
  onMediaSelect: (item: any, type: 'movie' | 'tv') => void;
}

export const HeroCarousel: FC<HeroCarouselProps> = ({ onMediaSelect }) => {
  const { items, isLoading } = useHeroCarousel();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplayInterval, setAutoplayInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (items.length === 0) return;

    const startAutoplay = () => {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }, 6000);
      setAutoplayInterval(interval);
    };

    startAutoplay();

    return () => {
      if (autoplayInterval) clearInterval(autoplayInterval);
    };
  }, [items.length, autoplayInterval]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    if (autoplayInterval) clearInterval(autoplayInterval);
  };

  const handleMediaClick = (item: any) => {
    const type = item.media_type === 'tv' ? 'tv' : 'movie';
    onMediaSelect(item, type);
  };

  if (isLoading || items.length === 0) {
    return <div className={styles.heroCarousel}><div className={styles.loading}>Loading...</div></div>;
  }

  const currentItem = items[currentIndex];
  const title = currentItem.title || currentItem.name;
  const rating = currentItem.vote_average?.toFixed(1) || 'N/A';
  const year = (currentItem.release_date || currentItem.first_air_date || '').split('-')[0] || '2024';
  const overview = currentItem.overview || '';

  return (
    <div className={styles.heroCarousel}>
      <div
        className={styles.heroSlide}
        style={{ backgroundImage: `url(${getBackdropUrl(currentItem.backdrop_path)})` }}
      >
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <div className={styles.heroTitle}>{title}</div>
          <div className={styles.heroMeta}>
            <span className={styles.heroRating}>⭐ {rating}/10</span>
            <span>{year}</span>
          </div>
          <div className={styles.heroOverview}>
            {overview.substring(0, 180)}
            {overview.length > 180 ? '...' : ''}
          </div>
          <div className={styles.heroButtons}>
            <button
              className={styles.heroPlayBtn}
              onClick={() => handleMediaClick(currentItem)}
            >
              ▶ Play
            </button>
            <button
              className={styles.heroMoreBtn}
              onClick={() => handleMediaClick(currentItem)}
            >
              More Info
            </button>
          </div>
        </div>
      </div>

      <div className={styles.carouselDots}>
        {items.map((_, idx) => (
          <button
            key={idx}
            className={`${styles.dot} ${idx === currentIndex ? styles.active : ''}`}
            onClick={() => goToSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
