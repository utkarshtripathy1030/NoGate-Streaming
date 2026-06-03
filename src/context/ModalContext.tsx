import React, { createContext, useState, ReactNode } from 'react';

export interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  type: 'movie' | 'tv';
  poster_path?: string;
  backdrop_path?: string;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  rating?: number;
  season?: number;
  episode?: number;
}

interface ModalContextType {
  isOpen: boolean;
  mediaItem: MediaItem | null;
  season?: number;
  episode?: number;
  openModal: (item: MediaItem, season?: number, episode?: number) => void;
  closeModal: () => void;
}

export const ModalContext = createContext<ModalContextType>({
  isOpen: false,
  mediaItem: null,
  openModal: () => {},
  closeModal: () => {},
});

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mediaItem, setMediaItem] = useState<MediaItem | null>(null);
  const [season, setSeason] = useState<number>(1);
  const [episode, setEpisode] = useState<number>(1);

  const openModal = (item: MediaItem, s?: number, ep?: number) => {
    setMediaItem(item);
    setSeason(s || 1);
    setEpisode(ep || 1);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      setMediaItem(null);
      setSeason(1);
      setEpisode(1);
    }, 300);
  };

  return (
    <ModalContext.Provider value={{ isOpen, mediaItem, season, episode, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};
