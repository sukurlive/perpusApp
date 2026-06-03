import AsyncStorage from '@react-native-async-storage/async-storage';

// Interface untuk preferensi pengguna
export interface UserPreferences {
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
  showCoverImages: boolean;
  defaultTab: 'perpustakaan' | 'favorit' | 'cari';
}

// Interface untuk riwayat buku yang dilihat
export interface RecentlyViewedBook {
  id: string | number;
  title: string;
  author: string;
  timestamp: number;
  coverUrl?: string;
}

// Default preferences
const defaultPreferences: UserPreferences = {
  theme: 'light',
  fontSize: 'medium',
  showCoverImages: true,
  defaultTab: 'perpustakaan',
};

// Keys untuk AsyncStorage
const STORAGE_KEYS = {
  USER_PREFERENCES: '@user_preferences',
  RECENTLY_VIEWED: '@recently_viewed',
  BOOKMARKS: '@bookmarks',
  READING_HISTORY: '@reading_history',
};

// ========== USER PREFERENCES ==========

// Menyimpan preferensi pengguna
export const saveUserPreferences = async (preferences: UserPreferences): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving user preferences:', error);
  }
};

// Mendapatkan preferensi pengguna
export const getUserPreferences = async (): Promise<UserPreferences> => {
  try {
    const preferences = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    return preferences ? JSON.parse(preferences) : defaultPreferences;
  } catch (error) {
    console.error('Error getting user preferences:', error);
    return defaultPreferences;
  }
};

// Update sebagian preferensi
export const updateUserPreferences = async (updates: Partial<UserPreferences>): Promise<void> => {
  try {
    const current = await getUserPreferences();
    const updated = { ...current, ...updates };
    await saveUserPreferences(updated);
  } catch (error) {
    console.error('Error updating user preferences:', error);
  }
};

// ========== RECENTLY VIEWED ==========

// Menyimpan buku yang baru dilihat
export const addRecentlyViewed = async (book: RecentlyViewedBook): Promise<void> => {
  try {
    const recent = await getRecentlyViewed();
    
    // Hapus jika sudah ada (untuk menghindari duplikat)
    const filtered = recent.filter(item => item.id !== book.id);
    
    // Tambahkan di awal array
    const updated = [book, ...filtered];
    
    // Batasi hanya 10 item terakhir
    const limited = updated.slice(0, 10);
    
    await AsyncStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(limited));
  } catch (error) {
    console.error('Error adding recently viewed:', error);
  }
};

// Mendapatkan semua riwayat buku yang dilihat
export const getRecentlyViewed = async (): Promise<RecentlyViewedBook[]> => {
  try {
    const recent = await AsyncStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED);
    return recent ? JSON.parse(recent) : [];
  } catch (error) {
    console.error('Error getting recently viewed:', error);
    return [];
  }
};

// Menghapus satu buku dari riwayat
export const removeFromRecentlyViewed = async (bookId: string | number): Promise<void> => {
  try {
    const recent = await getRecentlyViewed();
    const filtered = recent.filter(item => item.id !== bookId);
    await AsyncStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing from recently viewed:', error);
  }
};

// Menghapus semua riwayat
export const clearRecentlyViewed = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify([]));
  } catch (error) {
    console.error('Error clearing recently viewed:', error);
  }
};

// ========== GENERAL ==========

// Menghapus semua data (untuk logout atau reset)
export const clearAllStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_PREFERENCES,
      STORAGE_KEYS.RECENTLY_VIEWED,
      STORAGE_KEYS.BOOKMARKS,
      STORAGE_KEYS.READING_HISTORY,
    ]);
  } catch (error) {
    console.error('Error clearing all storage:', error);
  }
};