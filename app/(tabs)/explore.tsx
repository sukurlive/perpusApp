import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Image, ActivityIndicator, RefreshControl, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import axios from 'axios';

interface Book {
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
}

export default function ExploreScreen() {
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const BOOKS_PER_PAGE = 10;
  const TOTAL_BOOKS_TO_FETCH = 100;

  const fetchBooks = async (query = '') => {
    if (!query.trim()) {
      setAllBooks([]);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${TOTAL_BOOKS_TO_FETCH}`);
      if (response.data && response.data.docs) {
        setAllBooks(response.data.docs);
        setCurrentPage(1);
      } else {
        setAllBooks([]);
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
    if (searchQuery.trim()) {
      setRefreshing(true);
      fetchBooks(searchQuery);
    }
  };

  const getCoverUrl = (coverId: number | undefined) => {
    if (coverId) {
      return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
    }
    return 'https://via.placeholder.com/80x100?text=No+Cover';
  };

  const getCurrentPageBooks = () => {
    const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
    const endIndex = startIndex + BOOKS_PER_PAGE;
    return allBooks.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(allBooks.length / BOOKS_PER_PAGE);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  const goToBookDetail = (book: Book, index: number) => {
    router.push({
      pathname: '/detail',
      params: {
        id: index,
        title: book.title,
        author: book.author_name?.join(', ') || 'Unknown',
        year: book.first_publish_year?.toString() || 'N/A',
        coverId: book.cover_i?.toString() || '',
      }
    });
  };

  const currentBooks = getCurrentPageBooks();

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#4a90e2" />
      <View style={styles.container}>
        <ScrollView 
          contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 80 }]}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View style={styles.header}>
            <MaterialIcons name="search" size={45} color="white" />
            <Text style={styles.headerTitle}>Cari Buku Online</Text>
            <Text style={styles.headerSubtitle}>OpenLibrary API - 8+ juta buku</Text>
          </View>

          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="Cari buku... (contoh: harry potter, programming)"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={searchBooks}
              returnKeyType="search"
            />
            <TouchableOpacity style={styles.searchButton} onPress={searchBooks}>
              <MaterialIcons name="search" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {!loading && allBooks.length > 0 && (
            <View style={styles.totalBooksContainer}>
              <MaterialIcons name="menu-book" size={20} color="#4a90e2" />
              <Text style={styles.totalBooksText}>Menampilkan {allBooks.length} Buku</Text>
            </View>
          )}

          {loading && !refreshing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4a90e2" />
              <Text style={styles.loadingText}>Memuat data...</Text>
            </View>
          ) : (
            <>
              {currentBooks.length === 0 && !loading && (
                <View style={styles.emptyContainer}>
                  <MaterialIcons name="search" size={60} color="#999" />
                  <Text style={styles.emptyText}>{searchQuery ? 'Tidak ada buku ditemukan' : 'Silahkan cari buku terlebih dahulu'}</Text>
                </View>
              )}
              {currentBooks.length > 0 && (
                <>
                  <Text style={styles.resultText}>Menampilkan {currentBooks.length} dari {allBooks.length} buku (Halaman {currentPage})</Text>
                  {currentBooks.map((book, index) => (
                    <TouchableOpacity key={index} onPress={() => goToBookDetail(book, index)} activeOpacity={0.7}>
                      <View style={styles.bookCard}>
                        <Image source={{ uri: getCoverUrl(book.cover_i) }} style={styles.bookCover} />
                        <View style={styles.bookInfo}>
                          <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
                          <View style={styles.bookDetailRow}>
                            <MaterialIcons name="person" size={14} color="#666" />
                            <Text style={styles.bookAuthor}>{book.author_name?.join(', ') || 'Unknown'}</Text>
                          </View>
                          <View style={styles.bookDetailRow}>
                            <MaterialIcons name="calendar-today" size={14} color="#666" />
                            <Text style={styles.bookYear}>{book.first_publish_year || 'N/A'}</Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                  <View style={styles.paginationContainer}>
                    <TouchableOpacity style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]} onPress={prevPage} disabled={currentPage === 1}>
                      <MaterialIcons name="chevron-left" size={24} color={currentPage === 1 ? "#ccc" : "#4a90e2"} />
                      <Text style={styles.paginationButtonText}>Sebelumnya</Text>
                    </TouchableOpacity>
                    <View style={styles.pageInfo}><Text style={styles.pageInfoText}>Halaman {currentPage} dari {totalPages}</Text></View>
                    <TouchableOpacity style={[styles.paginationButton, currentPage === totalPages && styles.paginationButtonDisabled]} onPress={nextPage} disabled={currentPage === totalPages}>
                      <Text style={styles.paginationButtonText}>Selanjutnya</Text>
                      <MaterialIcons name="chevron-right" size={24} color={currentPage === totalPages ? "#ccc" : "#4a90e2"} />
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  contentContainer: { padding: 16 },
  header: { backgroundColor: '#4a90e2', borderRadius: 15, paddingVertical: 16, paddingHorizontal: 20, marginBottom: 16, alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: 'white', marginTop: 8 },
  headerSubtitle: { fontSize: 13, color: '#e0e0e0', marginTop: 4 },
  searchBar: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 12, marginBottom: 16, padding: 4 },
  searchInput: { flex: 1, height: 45, borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, paddingHorizontal: 12, marginRight: 8, fontSize: 16, backgroundColor: '#fafafa' },
  searchButton: { backgroundColor: '#4a90e2', borderRadius: 8, paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center' },
  totalBooksContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16, paddingVertical: 8, backgroundColor: '#e8f0fe', borderRadius: 20, marginHorizontal: 20 },
  totalBooksText: { fontSize: 14, fontWeight: 'bold', color: '#4a90e2' },
  resultText: { fontSize: 14, color: '#666', marginBottom: 12, fontWeight: '500', textAlign: 'center' },
  loadingContainer: { alignItems: 'center', paddingTop: 60 },
  loadingText: { marginTop: 16, fontSize: 16, color: '#4a90e2' },
  bookCard: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 12, padding: 12, marginBottom: 12, elevation: 3 },
  bookCover: { width: 80, height: 100, borderRadius: 8, marginRight: 12, backgroundColor: '#f0f0f0' },
  bookInfo: { flex: 1, justifyContent: 'center' },
  bookTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  bookDetailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 6 },
  bookAuthor: { fontSize: 13, color: '#666', flex: 1 },
  bookYear: { fontSize: 12, color: '#999' },
  emptyContainer: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#666', marginTop: 16 },
  paginationContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 10, paddingHorizontal: 10 },
  paginationButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, elevation: 2 },
  paginationButtonDisabled: { backgroundColor: '#f5f5f5', opacity: 0.6 },
  paginationButtonText: { fontSize: 14, color: '#4a90e2', fontWeight: '500', marginHorizontal: 4 },
  pageInfo: { backgroundColor: '#e8f0fe', paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20 },
  pageInfoText: { fontSize: 14, color: '#4a90e2', fontWeight: 'bold' },
});