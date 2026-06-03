import React, { useState, useEffect, useRef, FC } from 'react';
import styles from './Header.module.css';
import { useSearch } from '@/hooks/useMedia';
import { useProfile } from '@/hooks/useProfile';
import { storageService } from '@/services/storageService';
import { MediaItem } from '@/context/ModalContext';

interface HeaderProps {
  currentNav: 'home' | 'tv' | 'movies' | 'profile';
  onNavChange: (nav: 'home' | 'tv' | 'movies' | 'profile') => void;
  onMediaSelect: (item: any, type: 'movie' | 'tv') => void;
  onSearchStart?: () => void;
}

export const Header: FC<HeaderProps> = ({
  currentNav,
  onNavChange,
  onMediaSelect,
  onSearchStart,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { results, suggestions, search, clearSearch } = useSearch();
  const { profile } = useProfile();
  const searchDebounceRef = useRef<NodeJS.Timeout>();
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    if (searchQuery.length > 1) {
      searchDebounceRef.current = setTimeout(() => {
        search(searchQuery, true);
        setShowSuggestions(true);
      }, 300);
    } else {
      setShowSuggestions(false);
    }

    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [searchQuery, search]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSuggestionClick = (item: any, type: 'movie' | 'tv') => {
    onMediaSelect(item, type);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const handleSearchSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearchStart?.();
      setShowSuggestions(false);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    clearSearch();
    setShowSuggestions(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoSection}>
        <div className={styles.logo}>NOGATE</div>
        <nav className={styles.navLinks}>
          <button
            className={`${styles.navLink} ${currentNav === 'home' ? styles.active : ''}`}
            onClick={() => onNavChange('home')}
          >
            Home
          </button>
          <button
            className={`${styles.navLink} ${currentNav === 'tv' ? styles.active : ''}`}
            onClick={() => onNavChange('tv')}
          >
            TV Shows
          </button>
          <button
            className={`${styles.navLink} ${currentNav === 'movies' ? styles.active : ''}`}
            onClick={() => onNavChange('movies')}
          >
            Movies
          </button>
        </nav>
      </div>

      <div className={styles.searchContainer} ref={suggestionsRef}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Titles, people, genres"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleSearchSubmit}
          autoComplete="off"
        />

        {showSuggestions && suggestions.length > 0 && (
          <div className={styles.searchSuggestions}>
            {suggestions.map((item) => {
              const title = item.title || item.name;
              const type = item.media_type as 'movie' | 'tv';
              return (
                <div
                  key={`${type}_${item.id}`}
                  className={styles.suggestionItem}
                  onClick={() => handleSuggestionClick(item, type)}
                >
                  {item.poster_path && (
                    <img
                      className={styles.suggestionImg}
                      src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                      alt={title}
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.style.display = 'none';
                      }}
                    />
                  )}
                  <div className={styles.suggestionInfo}>
                    <div className={styles.suggestionTitle}>{title}</div>
                    <div className={styles.suggestionType}>
                      {type === 'movie' ? 'Movie' : 'Series'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {searchQuery && (
          <button className={styles.clearSearchBtn} onClick={handleClear}>
            Clear
          </button>
        )}
      </div>

      <div className={styles.profileSection}>
        {profile ? (
          <button
            className={styles.profileBtn}
            onClick={() => onNavChange('profile')}
            title={`Go to ${profile.profileName}'s profile`}
          >
            {(profile.avatar.includes('.') && (profile.avatar.endsWith('.png') || profile.avatar.endsWith('.jpg') || profile.avatar.endsWith('.jpeg'))) || profile.avatar.includes('image.tmdb') ? (
              <img 
                src={profile.avatar} 
                alt={profile.profileName}
                className={styles.profileAvatarImg}
              />
            ) : (
              <span className={styles.profileAvatar}>{profile.avatar}</span>
            )}
            <span className={styles.profileName}>{profile.profileName}</span>
          </button>
        ) : (
          <button
            className={styles.profileBtnEmpty}
            onClick={() => onNavChange('profile')}
            title="Go to profile"
          >
            👤 Profile
          </button>
        )}
      </div>
    </header>
  );
};
