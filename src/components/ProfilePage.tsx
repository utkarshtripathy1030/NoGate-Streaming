import React, { useState, FC } from 'react';
import styles from './ProfilePage.module.css';
import { useProfile } from '@/hooks/useProfile';
import { useNavigation } from '@/hooks/useNavigation';
import { storageService } from '@/services/storageService';

export const ProfilePage: FC = () => {
  const { profile, resetProfile, updateProfile } = useProfile();
  const { goBack } = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile?.profileName || '');
  const [editGenre, setEditGenre] = useState(profile?.favoriteGenre || '');

  if (!profile) {
    return (
      <div className={styles.profilePage}>
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>👤</div>
          <p className={styles.emptyStateText}>No profile found</p>
        </div>
      </div>
    );
  }

  const myList = storageService.getMyList();
  const watchHistory = storageService.getWatchHistory();
  const reactions = storageService.getReactions();
  const myListCount = myList.length;
  const likesCount = Object.values(reactions).filter(r => r === 'like').length;
  const awesomeCount = Object.values(reactions).filter(r => r === 'awesome').length;
  const trashCount = Object.values(reactions).filter(r => r === 'trash').length;

  const handleEditProfile = () => {
    if (isEditing && (editName !== profile.profileName || editGenre !== profile.favoriteGenre)) {
      updateProfile({
        profileName: editName || profile.profileName,
        favoriteGenre: editGenre || null,
      });
    }
    setIsEditing(!isEditing);
  };

  const handleResetProfile = () => {
    if (window.confirm('Are you sure you want to reset your profile? This cannot be undone.')) {
      resetProfile();
      goBack();
    }
  };

  return (
    <div className={styles.profilePage}>
      <button className={styles.backButton} onClick={goBack}>
        ← Back
      </button>

      <div className={styles.profileContainer}>
        <div className={styles.profileHeader}>
          <div className={styles.profileAvatar}>
            {(profile.avatar.includes('.') && (profile.avatar.endsWith('.png') || profile.avatar.endsWith('.jpg') || profile.avatar.endsWith('.jpeg'))) || profile.avatar.includes('image.tmdb') ? (
              <img 
                src={profile.avatar} 
                alt={profile.profileName}
                className={styles.avatarImage}
              />
            ) : (
              profile.avatar
            )}
          </div>

          <div className={styles.profileInfo}>
            {isEditing ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className={styles.profileName}
                maxLength={50}
              />
            ) : (
              <h1 className={styles.profileName}>{profile.profileName}</h1>
            )}

            <div className={styles.profileMeta}>
              <div className={styles.profileMetaItem}>
                <span>📅</span>
                <span>
                  Joined {new Date(profile.createdAt).toLocaleDateString()}
                </span>
              </div>
              {profile.favoriteGenre && (
                <div className={styles.profileMetaItem}>
                  <span>🎬</span>
                  <span>
                    Favorite: <strong>{profile.favoriteGenre}</strong>
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.profileHeaderActions}>
            <button className={styles.actionBtn} onClick={handleEditProfile}>
              {isEditing ? '✓ Save' : '✏️ Edit'}
            </button>
            <button
              className={`${styles.actionBtn} ${styles.danger}`}
              onClick={handleResetProfile}
            >
              🔄 Reset
            </button>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🎬</div>
            <div className={styles.statLabel}>Movies Watched</div>
            <div className={styles.statValue}>
              {myList.filter(i => i.type === 'movie').length}
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>📺</div>
            <div className={styles.statLabel}>Shows Watched</div>
            <div className={styles.statValue}>
              {myList.filter(i => i.type === 'tv').length}
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>➕</div>
            <div className={styles.statLabel}>My List Count</div>
            <div className={styles.statValue}>{myListCount}</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>👍</div>
            <div className={styles.statLabel}>Likes</div>
            <div className={styles.statValue}>{likesCount}</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>😍</div>
            <div className={styles.statLabel}>Awesome</div>
            <div className={styles.statValue}>{awesomeCount}</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>🗑️</div>
            <div className={styles.statLabel}>Trash</div>
            <div className={styles.statValue}>{trashCount}</div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span>📺</span> Continue Watching
          </h2>
          {watchHistory.length > 0 ? (
            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
              {watchHistory.length} {watchHistory.length === 1 ? 'title' : 'titles'} in your history
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>📭</div>
              <p className={styles.emptyStateText}>
                Your watch history is empty. Start watching to see it here!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
