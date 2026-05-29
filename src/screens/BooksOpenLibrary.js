import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import axios from 'axios';

const BooksOpenLibrary = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('programming');
  const [refreshing, setRefreshing] = useState(false);

  // Fungsi untuk mengambil data dari OpenLibrary API
  const fetchBooks = async (query = 'programming') => {
    try {
      setLoading(true);
      // OpenLibrary API endpoint
      const response = await axios.get(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=20&fields=key,title,author_name,first_publish_year,cover_i,edition_count,language`
      );
      
      if (response.data && response.data.docs) {
        setBooks(response.data.docs);
      } else {
        setBooks([]);
      }
    } catch (error) {
      console.error('Error fetching books from OpenLibrary:', error);
      alert('Gagal mengambil data buku dari OpenLibrary. Periksa koneksi internet Anda.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fungsi untuk search buku
  const searchBooks = () => {
    if (searchQuery.trim()) {
      fetchBooks(searchQuery);
    }
  };

  // Fungsi untuk pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchBooks(searchQuery);
  };

  // useEffect untuk load data pertama kali
  useEffect(() => {
    fetchBooks('programming');
  }, []);

  // Fungsi untuk mendapatkan URL cover buku
  const getCoverUrl = (coverId) => {
    if (coverId) {
      return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
    }
    return 'https://via.placeholder.com/80x100?text=No+Cover';
  };

  // Render item buku
  const renderBookItem = (book, index) => {
    const title = book.title || 'No Title';
    const authors = book.author_name?.join(', ') || 'Unknown Author';
    const publishYear = book.first_publish_year || 'N/A';
    const editionCount = book.edition_count || 'N/A';
    const language = book.language?.join(', ') || 'Unknown';
    const coverUrl = getCoverUrl(book.cover_i);
    const key = book.key || `book-${index}`;

    return (
      <View key={key} style={styles.bookCard}>
        <Image source={{ uri: coverUrl }} style={styles.bookCover} />
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.bookAuthor}>✍️ {authors}</Text>
          <Text style={styles.bookDetails}>
            Tahun: {publishYear} | Edisi: {editionCount}
          </Text>
          <Text style={styles.bookLanguage}>Bahasa: {language}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerIcon}></Text>
        <Text style={styles.headerTitle}>OpenLibrary API</Text>
        <Text style={styles.headerSubtitle}>
          Database buku gratis dari Internet Archive (8+ juta buku)
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari buku... (contoh: harry potter, tolkien, programming)"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={searchBooks}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchButton} onPress={searchBooks}>
          <Text style={styles.searchButtonText}>Cari</Text>
        </TouchableOpacity>
      </View>

      {/* Hasil Pencarian */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2ecc71" />
          <Text style={styles.loadingText}>Mengambil data dari OpenLibrary...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={true}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.resultInfo}>
            <Text style={styles.resultText}>
              Menampilkan {books.length} buku dari "{searchQuery}"
            </Text>
          </View>

          {books.length === 0 && !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}></Text>
              <Text style={styles.emptyText}>Tidak ada buku ditemukan</Text>
              <Text style={styles.emptySubText}>Coba dengan kata kunci lain</Text>
              <Text style={styles.exampleText}>
                Contoh: "harry potter", "lord of the rings", "react"
              </Text>
            </View>
          ) : (
            books.map((book, index) => renderBookItem(book, index))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  header: {
    backgroundColor: '#2ecc71',
    padding: 16,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#e8f8f0',
    marginTop: 4,
    textAlign: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  searchButton: {
    backgroundColor: '#2ecc71',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  resultInfo: {
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  resultText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#2ecc71',
  },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#2ecc71',
  },
  bookCover: {
    width: 80,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  bookDetails: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  bookLanguage: {
    fontSize: 11,
    color: '#2ecc71',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  exampleText: {
    fontSize: 12,
    color: '#2ecc71',
    marginTop: 16,
    fontStyle: 'italic',
  },
});

export default BooksOpenLibrary;