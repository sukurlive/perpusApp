import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavoriteBook {
  id: string;
  title: string;
  author: string;
  year: number;
  reason: string;
  coverId?: string;
  addedAt: number;
}

const defaultFavorites: FavoriteBook[] = [
  { id: '1', title: 'Atomic Habits', author: 'James Clear', year: 2018, reason: 'Membangun kebiasaan baik', addedAt: Date.now() },
  { id: '2', title: 'Deep Work', author: 'Cal Newport', year: 2016, reason: 'Meningkatkan fokus', addedAt: Date.now() },
  { id: '3', title: 'The Design of Everyday Things', author: 'Don Norman', year: 2013, reason: 'Design thinking', addedAt: Date.now() },
  { id: '4', title: 'Zero to One', author: 'Peter Thiel', year: 2014, reason: 'Inovasi startup', addedAt: Date.now() },
  { id: '5', title: 'Sapiens', author: 'Yuval Noah Harari', year: 2011, reason: 'Sejarah manusia', addedAt: Date.now() },
  { id: '6', title: 'Think and Grow Rich', author: 'Napoleon Hill', year: 1937, reason: 'Mindset sukses', addedAt: Date.now() },
];

export default function FavoriteScreen() {
  const [favorites, setFavorites] = useState<FavoriteBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      } else {
        await AsyncStorage.setItem('favorites', JSON.stringify(defaultFavorites));
        setFavorites(defaultFavorites);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites(defaultFavorites);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadFavorites();
  };

  const removeFromFavorites = async (bookId: string, bookTitle: string) => {
    Alert.alert('Hapus dari Favorit', `Hapus "${bookTitle}" dari favorit?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          const updatedFavorites = favorites.filter(book => book.id !== bookId);
          await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
          setFavorites(updatedFavorites);
          Alert.alert('Berhasil', 'Buku telah dihapus dari favorit');
        }
      }
    ]);
  };

  const clearAllFavorites = () => {
    if (favorites.length === 0) return;
    Alert.alert('Hapus Semua', 'Hapus semua buku dari favorit?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus Semua',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.setItem('favorites', JSON.stringify([]));
          setFavorites([]);
          Alert.alert('Berhasil', 'Semua buku telah dihapus dari favorit');
        }
      }
    ]);
  };

  const goToBookDetail = (book: FavoriteBook) => {
    router.push({
      pathname: '/detail',
      params: {
        id: book.id,
        title: book.title,
        author: book.author,
        year: book.year.toString(),
        coverId: book.coverId || '',
      }
    });
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={styles.loadingText}>Memuat daftar favorit...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#4a90e2" />
      <ScrollView 
        style={styles.container}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 80 }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <MaterialIcons name="favorite" size={45} color="white" />
          <Text style={styles.headerTitle}>Buku Favorit Saya</Text>
          <Text style={styles.headerSubtitle}>{favorites.length} Buku yang paling saya suka</Text>
        </View>

        {favorites.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearAllFavorites}>
            <MaterialIcons name="delete-sweep" size={20} color="#ff4444" />
            <Text style={styles.clearButtonText}>Hapus Semua</Text>
          </TouchableOpacity>
        )}

        {favorites.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="favorite-border" size={80} color="#ccc" />
            <Text style={styles.emptyTitle}>Belum ada buku favorit</Text>
            <Text style={styles.emptyText}>Tambahkan buku favorit dari halaman pencarian</Text>
            <TouchableOpacity style={styles.searchButton} onPress={() => router.push('/explore')}>
              <MaterialIcons name="search" size={20} color="white" />
              <Text style={styles.searchButtonText}>Cari Buku</Text>
            </TouchableOpacity>
          </View>
        ) : (
          favorites.map(book => (
            <TouchableOpacity key={book.id} onPress={() => goToBookDetail(book)} activeOpacity={0.7}>
              <View style={styles.card}>
                <View style={styles.starIcon}>
                  <MaterialIcons name="star" size={30} color="#ff9800" />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.title}>{book.title}</Text>
                  <View style={styles.authorRow}>
                    <MaterialIcons name="person" size={14} color="#666" />
                    <Text style={styles.author}>{book.author}</Text>
                  </View>
                  <View style={styles.yearRow}>
                    <MaterialIcons name="calendar-today" size={14} color="#666" />
                    <Text style={styles.year}>{book.year}</Text>
                  </View>
                  <View style={styles.reasonContainer}>
                    <View style={styles.reasonHeader}>
                      <MaterialIcons name="info" size={14} color="#4a90e2" />
                      <Text style={styles.reasonLabel}>Alasan:</Text>
                    </View>
                    <Text style={styles.reason}>{book.reason}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => removeFromFavorites(book.id, book.title)} style={styles.deleteButton}>
                  <MaterialIcons name="delete-outline" size={24} color="#ff4444" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  contentContainer: { padding: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f4f8' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#4a90e2' },
  header: { backgroundColor: '#4a90e2', borderRadius: 15, paddingVertical: 16, paddingHorizontal: 20, marginBottom: 16, alignItems: 'center', elevation: 3 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: 'white', marginTop: 8 },
  headerSubtitle: { fontSize: 13, color: '#e0e0e0', marginTop: 4 },
  clearButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, marginBottom: 16, gap: 8, alignSelf: 'flex-end', borderWidth: 1, borderColor: '#ff4444' },
  clearButtonText: { fontSize: 14, color: '#ff4444', fontWeight: '500' },
  card: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 12, padding: 15, marginBottom: 12, alignItems: 'center', elevation: 3, borderLeftWidth: 4, borderLeftColor: '#4a90e2' },
  starIcon: { marginRight: 15, justifyContent: 'center' },
  cardContent: { flex: 1 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  authorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 6 },
  author: { fontSize: 14, color: '#666' },
  yearRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 6 },
  year: { fontSize: 12, color: '#999' },
  reasonContainer: { backgroundColor: '#e8f0fe', padding: 8, borderRadius: 8, marginTop: 4 },
  reasonHeader: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  reasonLabel: { fontSize: 12, fontWeight: 'bold', color: '#4a90e2' },
  reason: { fontSize: 12, color: '#666' },
  deleteButton: { padding: 8, marginLeft: 8 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 60, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#666', marginTop: 20, marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#999', textAlign: 'center', marginBottom: 24 },
  searchButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#4a90e2', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 25, gap: 8 },
  searchButtonText: { fontSize: 16, fontWeight: 'bold', color: 'white' },
});