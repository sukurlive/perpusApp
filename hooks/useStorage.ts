import { useState, useEffect, useCallback } from 'react';
import { 
  getUserPreferences, 
  saveUserPreferences, 
  updateUserPreferences,
  getRecentlyViewed,
  addRecentlyViewed,
  removeFromRecentlyViewed,
  clearRecentlyViewed,
  UserPreferences,
  RecentlyViewedBook 
} from '../utils/storage';

// Hook untuk user preferences
export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const prefs = await getUserPreferences();
      setPreferences(prefs);
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    try {
      await updateUserPreferences(updates);
      if (preferences) {
        setPreferences({ ...preferences, ...updates });
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  const resetPreferences = async () => {
    try {
      await saveUserPreferences({
        theme: 'light',
        fontSize: 'medium',
        showCoverImages: true,
        defaultTab: 'perpustakaan',
      });
      await loadPreferences();
    } catch (error) {
      console.error('Error resetting preferences:', error);
    }
  };

  return {
    preferences,
    loading,
    updatePreferences,
    resetPreferences,
  };
};

// Hook untuk recently viewed
export const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentlyViewed();
  }, []);

  const loadRecentlyViewed = async () => {
    try {
      const recent = await getRecentlyViewed();
      setRecentlyViewed(recent);
    } catch (error) {
      console.error('Error loading recently viewed:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBook = async (book: RecentlyViewedBook) => {
    try {
      await addRecentlyViewed(book);
      await loadRecentlyViewed(); // Reload data
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const removeBook = async (bookId: string | number) => {
    try {
      await removeFromRecentlyViewed(bookId);
      await loadRecentlyViewed();
    } catch (error) {
      console.error('Error removing book:', error);
    }
  };

  const clearAll = async () => {
    try {
      await clearRecentlyViewed();
      setRecentlyViewed([]);
    } catch (error) {
      console.error('Error clearing recently viewed:', error);
    }
  };

  return {
    recentlyViewed,
    loading,
    addBook,
    removeBook,
    clearAll,
    refresh: loadRecentlyViewed,
  };
};