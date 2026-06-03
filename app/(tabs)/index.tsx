import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Book {
  id: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
}

const categories = [
  'programming', 'fiction', 'science', 'history', 'fantasy', 'adventure', 
  'mystery', 'romance', 'technology', 'art',
  'philosophy', 'psychology', 'business', 'self-help', 'biography'
];

export default function HomeScreen() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const fetchRandomBooks = async () => {
    try {
      setLoading(true);
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const response = await axios.get(
        `https://openlibrary.org/search.json?q=${randomCategory}&limit=12&sort=random`
      );
      if (response.data && response.data.docs) {
        const booksWithId = response.data.docs.map((book: any, index: number) => ({
          id: `${randomCategory}-${index}-${Date.now()}`,
          title: book.title,
          author_name: book.author_name,
          first_publish_year: book.first_publish_year,
          cover_i: book.cover_i,
        }));
        setBooks(booksWithId);
      } else {
        setBooks([]);
      }
    } catch (error) {
      console.error('Error fetching random books:', error);
      setBooks([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRandomBooks();
  };

  useEffect(() => {
    fetchRandomBooks();
  }, []);

  const goToBookDetail = (book: Book) => {
    router.push({
      pathname: '/detail',
      params: {
        id: book.id,
        title: book.title,
        author: book.author_name?.join(', ') || 'Unknown',
        year: book.first_publish_year?.toString() || 'N/A',
        coverId: book.cover_i?.toString() || '',
      }
    });
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={styles.loadingText}>Memuat rekomendasi buku...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#4a90e2" />
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: insets.bottom + 80 }
        ]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <MaterialIcons name="menu-book" size={45} color="white" />
          <Text style={styles.headerTitle}>Perpustakaan Digital</Text>
          <Text style={styles.headerSubtitle}>Rekomendasi Buku untuk Anda</Text>
        </View>

        <TouchableOpacity style={styles.refreshButton} onPress={fetchRandomBooks}>
          <MaterialIcons name="refresh" size={20} color="#4a90e2" />
          <Text style={styles.refreshButtonText}>Ganti Rekomendasi</Text>
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <MaterialIcons name="info" size={16} color="#4a90e2" />
          <Text style={styles.infoText}>Menampilkan {books.length} buku rekomendasi</Text>
        </View>

        {books.map((book) => (
          <TouchableOpacity 
            key={book.id} 
            onPress={() => goToBookDetail(book)}
            activeOpacity={0.7}
          >
            <View style={styles.card}>
              <View style={styles.cardIcon}>
                <MaterialIcons name="book" size={40} color="#4a90e2" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
                <View style={styles.authorRow}>
                  <MaterialIcons name="person" size={14} color="#666" />
                  <Text style={styles.author} numberOfLines={1}>
                    {book.author_name?.join(', ') || 'Unknown'}
                  </Text>
                </View>
                <View style={styles.yearRow}>
                  <MaterialIcons name="calendar-today" size={14} color="#666" />
                  <Text style={styles.year}>{book.first_publish_year || 'N/A'}</Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#ccc" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  contentContainer: { padding: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f4f8' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#4a90e2' },
  header: { backgroundColor: '#4a90e2', borderRadius: 15, paddingVertical: 16, paddingHorizontal: 20, marginBottom: 16, alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: 'white', marginTop: 8 },
  headerSubtitle: { fontSize: 13, color: '#e0e0e0', marginTop: 4 },
  refreshButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, marginBottom: 12, gap: 8, alignSelf: 'center', elevation: 2 },
  refreshButtonText: { fontSize: 14, color: '#4a90e2', fontWeight: '500' },
  infoContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 16, paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#e8f0fe', borderRadius: 20, alignSelf: 'center' },
  infoText: { fontSize: 12, color: '#4a90e2' },
  card: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 12, padding: 15, marginBottom: 12, alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  cardIcon: { marginRight: 15, justifyContent: 'center' },
  cardContent: { flex: 1 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  authorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 6 },
  author: { fontSize: 14, color: '#666', flex: 1 },
  yearRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  year: { fontSize: 12, color: '#999' },
});