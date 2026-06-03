import React, { createContext, useState, ReactNode, useCallback } from 'react';
import { MediaItem } from '@/context/ModalContext';

interface PlayerState {
  isOpen: boolean;
  media: MediaItem | null;
  season?: number;
  episode?: number;
}

interface PlayerContextType {
  playerState: PlayerState;
  openPlayer: (media: MediaItem, season?: number, episode?: number) => void;
  closePlayer: () => void;
}

export const PlayerContext = createContext<PlayerContextType>({
  playerState: {
    isOpen: false,
    media: null,
  },
  openPlayer: () => {},
  closePlayer: () => {},
});

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [playerState, setPlayerState] = useState<PlayerState>({
    isOpen: false,
    media: null,
  });

  const openPlayer = useCallback((media: MediaItem, season = 1, episode = 1) => {
    setPlayerState({
      isOpen: true,
      media,
      season,
      episode,
    });
  }, []);

  const closePlayer = useCallback(() => {
    setPlayerState({
      isOpen: false,
      media: null,
      season: 1,
      episode: 1,
    });
  }, []);

  return (
    <PlayerContext.Provider value={{ playerState, openPlayer, closePlayer }}>
      {children}
    </PlayerContext.Provider>
  );
};
