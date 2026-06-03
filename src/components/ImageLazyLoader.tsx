import React, { FC, useState, useEffect, useRef } from 'react';
import styles from './ImageLazyLoader.module.css';

interface ImageLazyLoaderProps {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  width?: string;
  height?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down';
  onLoad?: () => void;
  onError?: () => void;
}

export const ImageLazyLoader: FC<ImageLazyLoaderProps> = ({
  src,
  alt,
  placeholder,
  className = '',
  width = '100%',
  height = '100%',
  objectFit = 'cover',
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    // Use Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            img.src = src;
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
      }
    );

    observer.observe(img);

    return () => {
      observer.unobserve(img);
    };
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
    onError?.();
  };

  return (
    <div
      className={`${styles.container} ${!isLoaded && !error ? styles.loading : ''}`}
      style={{ width, height }}
    >
      {placeholder && !isLoaded && !error && (
        <img
          src={placeholder}
          alt={alt}
          className={`${styles.image} ${styles.placeholder}`}
          style={{ objectFit }}
        />
      )}

      <img
        ref={imgRef}
        alt={alt}
        className={`${styles.image} ${isLoaded ? styles.loaded : ''}`}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          objectFit,
          opacity: isLoaded ? 1 : 0,
        }}
      />

      {!isLoaded && !error && (
        <div className={styles.skeleton}>
          <div className={styles.shimmer} />
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <span>⚠️ Failed to load</span>
        </div>
      )}
    </div>
  );
};

export default ImageLazyLoader;
