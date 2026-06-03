import React, { FC, useEffect } from 'react';
import styles from './PlayerOverlay.module.css';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '@/hooks/usePlayer';
import { useNavigation } from '@/hooks/useNavigation';
import { storageService } from '@/services/storageService';

interface PlayerOverlayProps {
  onClose?: () => void;
}

export const PlayerOverlay: FC<PlayerOverlayProps> = ({ onClose }) => {
  const { playerState, closePlayer } = usePlayer();
  const { goBack } = useNavigation();
  const navigateRouter = useNavigate();
  const { isOpen, media, season = 1, episode = 1 } = playerState;

  useEffect(() => {
    if (!isOpen || !media) return;

    // Update watch history
    if (media.type === 'movie') {
      storageService.updateWatchHistory({
        ...media,
        type: 'movie',
      });
    } else {
      storageService.updateWatchHistory({
        ...media,
        type: 'tv',
        season,
        episode,
      });
    }

    // Navigate to watch page (stays on NoGate domain)
    const watchPath =
      media.type === 'movie'
        ? `/watch/movie/${media.id}`
        : `/watch/tv/${media.id}/${season}/${episode}`;

    closePlayer();
    navigateRouter(watchPath);
    onClose?.();
  }, [isOpen, media, season, episode, closePlayer, navigateRouter, onClose]);

  return null;
};
