import { View, Text, ScrollView, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ExploreScreen() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('programming');
  const [refreshing, setRefreshing] = useState(false);

  const fetchBooks = async (query = 'programming') => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=20`
      );
      if (response.data && response.data.docs) {
        setBooks(response.data.docs);
      } else {
        setBooks([]);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal mengambil data buku');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const searchBooks = () => {
    if (searchQuery.trim()) {
      fetchBooks(searchQuery);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBooks(searchQuery);
  };

  useEffect(() => {
    fetchBooks('programming');
  }, []);

  const getCoverUrl = (coverId) => {
    if (coverId) {
      return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
    }
    return 'https://via.placeholder.com/80x100?text=No+Cover';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <MaterialIcons name="search" size={45} color="white" />
        <Text style={styles.headerTitle}>Cari Buku Online</Text>
        <Text style={styles.headerSubtitle}>OpenLibrary API - 8+ juta buku</Text>
      </View>

      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari buku..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={searchBooks}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchButton} onPress={searchBooks}>
          <MaterialIcons name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2ecc71" />
          <Text style={styles.loadingText}>Memuat data...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={true}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <Text style={styles.resultText}>Menampilkan {books.length} buku</Text>
          
          {books.length === 0 && !loading ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="error" size={60} color="#999" />
              <Text style={styles.emptyText}>Tidak ada buku ditemukan</Text>
            </View>
          ) : (
            books.map((book, index) => (
              <View key={index} style={styles.bookCard}>
                <Image source={{ uri: getCoverUrl(book.cover_i) }} style={styles.bookCover} />
                <View style={styles.bookInfo}>
                  <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
                  <Text style={styles.bookAuthor}>✍{book.author_name?.join(', ') || 'Unknown'}</Text>
                  <Text style={styles.bookYear}>{book.first_publish_year || 'N/A'}</Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f0fdf4' },
  header: { backgroundColor: '#2ecc71', padding: 20, alignItems: 'center', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: 'white', marginTop: 8 },
  headerSubtitle: { fontSize: 12, color: '#e8f8f0', marginTop: 4 },
  searchBar: { flexDirection: 'row', padding: 16, backgroundColor: 'white', elevation: 2 },
  searchInput: { flex: 1, height: 45, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, marginRight: 8, fontSize: 16 },
  searchButton: { backgroundColor: '#2ecc71', borderRadius: 8, paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center' },
  scrollView: { flex: 1, padding: 16 },
  resultText: { fontSize: 14, color: '#555', marginBottom: 12 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
  loadingText: { marginTop: 16, fontSize: 16, color: '#2ecc71' },
  bookCard: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 12, padding: 12, marginBottom: 12, elevation: 3 },
  bookCover: { width: 80, height: 100, borderRadius: 8, marginRight: 12, backgroundColor: '#f0f0f0' },
  bookInfo: { flex: 1 },
  bookTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  bookAuthor: { fontSize: 13, color: '#666', marginBottom: 2 },
  bookYear: { fontSize: 12, color: '#999' },
  emptyContainer: { alignItems: 'center', paddingTop: 100 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#666', marginTop: 16 },
});