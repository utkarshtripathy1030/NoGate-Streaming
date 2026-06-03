import React, { FC, useState } from 'react';
import styles from './WhoIsWatching.module.css';
import { useProfile } from '@/hooks/useProfile';
import { CreateProfileModal } from './CreateProfileModal';

export const WhoIsWatching: FC = () => {
  const { profiles, selectProfile } = useProfile();
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className={styles.whoIsWatchingContainer}>
      <div className={styles.content}>
        <h1 className={styles.title}>Who's Watching?</h1>
        
        <div className={styles.profilesGrid}>
          {profiles.map((profile) => (
            <button
              key={profile.profileId}
              className={styles.profileCard}
              onClick={() => selectProfile(profile.profileId)}
              title={profile.profileName}
            >
              <div className={styles.avatarContainer}>
                {profile.avatar.includes('.') && 
                (profile.avatar.endsWith('.png') || profile.avatar.endsWith('.jpg') || profile.avatar.endsWith('.jpeg')) ? (
                  <img 
                    src={profile.avatar} 
                    alt={profile.profileName}
                    className={styles.avatar}
                  />
                ) : (
                  <div className={styles.avatarEmoji}>{profile.avatar}</div>
                )}
                {profile.isKids && (
                  <div className={styles.kidsBadge}>👶</div>
                )}
              </div>
              <p className={styles.profileName}>{profile.profileName}</p>
            </button>
          ))}

          <button
            className={styles.addProfileCard}
            onClick={() => setShowCreateModal(true)}
            title="Add Profile"
          >
            <div className={styles.addProfileIcon}>+</div>
            <p className={styles.addProfileText}>Add Profile</p>
          </button>
        </div>

        <button 
          className={styles.manageButton}
          onClick={() => {/* TODO: Show manage profiles modal */}}
        >
          ⚙️ Manage Profiles
        </button>
      </div>

      <CreateProfileModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </div>
  );
};

export default WhoIsWatching;
