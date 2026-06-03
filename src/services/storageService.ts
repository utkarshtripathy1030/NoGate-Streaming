import { MediaItem } from '@/context/ModalContext';

const MYLIST_KEY = 'nogate_mylist';
const WATCH_HISTORY_KEY = 'nogate_watch';
const REACTIONS_KEY = 'nogate_reactions';

export const storageService = {
  // My List
  getMyList: (): MediaItem[] => {
    try {
      return JSON.parse(localStorage.getItem(MYLIST_KEY) || '[]');
    } catch {
      return [];
    }
  },

  setMyList: (items: MediaItem[]): void => {
    localStorage.setItem(MYLIST_KEY, JSON.stringify(items));
  },

  addToList: (item: MediaItem): void => {
    const list = storageService.getMyList();
    if (!list.some(i => i.id === item.id && i.type === item.type)) {
      list.push(item);
      storageService.setMyList(list);
    }
  },

  removeFromList: (id: number, type: 'movie' | 'tv'): void => {
    const list = storageService.getMyList();
    const filtered = list.filter(i => !(i.id === id && i.type === type));
    storageService.setMyList(filtered);
  },

  isInList: (id: number, type: 'movie' | 'tv'): boolean => {
    const list = storageService.getMyList();
    return list.some(i => i.id === id && i.type === type);
  },

  // Watch History
  getWatchHistory: (): MediaItem[] => {
    try {
      const history = JSON.parse(localStorage.getItem(WATCH_HISTORY_KEY) || '[]');
      return history.slice(0, 3); // Keep only last 3
    } catch {
      return [];
    }
  },

  updateWatchHistory: (item: MediaItem): void => {
    const history = JSON.parse(localStorage.getItem(WATCH_HISTORY_KEY) || '[]');
    const filtered = history.filter(
      (h: MediaItem) => !(h.id === item.id && h.type === item.type)
    );
    filtered.unshift({ ...item, timestamp: Date.now() });
    localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(filtered.slice(0, 3)));
  },

  // Reactions
  getReactions: (): Record<string, string> => {
    try {
      return JSON.parse(localStorage.getItem(REACTIONS_KEY) || '{}');
    } catch {
      return {};
    }
  },

  setReactions: (reactions: Record<string, string>): void => {
    localStorage.setItem(REACTIONS_KEY, JSON.stringify(reactions));
  },

  toggleReaction: (type: 'movie' | 'tv', id: number, reaction: string): string | null => {
    const reactions = storageService.getReactions();
    const key = `${type}_${id}`;
    if (reactions[key] === reaction) {
      delete reactions[key];
      storageService.setReactions(reactions);
      return null;
    }
    reactions[key] = reaction;
    storageService.setReactions(reactions);
    return reaction;
  },

  getReaction: (type: 'movie' | 'tv', id: number): string | null => {
    const reactions = storageService.getReactions();
    return reactions[`${type}_${id}`] || null;
  },
};
