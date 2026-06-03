import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface BookDetail {
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  publisher?: string[];
  number_of_pages_median?: number;
  language?: string[];
  isbn?: string[];
  subject?: string[];
}

interface FavoriteBook {
  id: string;
  title: string;
  author: string;
  year: number;
  reason: string;
  coverId?: string;
  addedAt: number;
}

export default function BookDetailScreen() {
  const { id, title, author, year, coverId } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [bookDetail, setBookDetail] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteReason, setFavoriteReason] = useState('');

  useEffect(() => {
    if (title) {
      fetchBookDetail();
      checkIsFavorite();
    }
  }, [title]);

  const fetchBookDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(title as string)}&limit=1`);
      if (response.data && response.data.docs && response.data.docs.length > 0) {
        setBookDetail(response.data.docs[0]);
      }
    } catch (error) {
      console.error('Error fetching book detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIsFavorite = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        const favorites: FavoriteBook[] = JSON.parse(storedFavorites);
        const found = favorites.find(book => book.id === id || book.title === title);
        setIsFavorite(!!found);
        if (found) setFavoriteReason(found.reason);
      }
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const addToFavorites = async () => {
    if (isFavorite) {
      Alert.alert('Hapus dari Favorit', `Hapus "${title}" dari favorit?`, [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            const storedFavorites = await AsyncStorage.getItem('favorites');
            if (storedFavorites) {
              const favorites: FavoriteBook[] = JSON.parse(storedFavorites);
              const updatedFavorites = favorites.filter(book => book.id !== id && book.title !== title);
              await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
              setIsFavorite(false);
              setFavoriteReason('');
              Alert.alert('Berhasil', 'Buku telah dihapus dari favorit');
            }
          }
        }
      ]);
    } else {
      Alert.prompt('Tambah ke Favorit', 'Masukkan alasan mengapa buku ini menjadi favorit:', [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Tambah',
          onPress: async (reason) => {
            const finalReason = reason || 'Buku yang sangat menarik';
            const storedFavorites = await AsyncStorage.getItem('favorites');
            const favorites: FavoriteBook[] = storedFavorites ? JSON.parse(storedFavorites) : [];
            const newFavorite: FavoriteBook = {
              id: id as string || Date.now().toString(),
              title: title as string,
              author: author as string || bookDetail?.author_name?.join(', ') || 'Unknown',
              year: parseInt(year as string) || bookDetail?.first_publish_year || 0,
              reason: finalReason,
              coverId: coverId as string || bookDetail?.cover_i?.toString() || '',
              addedAt: Date.now(),
            };
            await AsyncStorage.setItem('favorites', JSON.stringify([newFavorite, ...favorites]));
            setIsFavorite(true);
            setFavoriteReason(finalReason);
            Alert.alert('Berhasil', 'Buku telah ditambahkan ke favorit');
          }
        }
      ], 'plain-text');
    }
  };

  const shareBook = () => Alert.alert('Bagikan', `Membagikan buku "${title}"`);
  const getCoverUrl = () => {
    const coverIdNum = coverId ? parseInt(coverId as string) : bookDetail?.cover_i;
    return coverIdNum ? `https://covers.openlibrary.org/b/id/${coverIdNum}-L.jpg` : 'https://via.placeholder.com/200x280?text=No+Cover';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={styles.loadingText}>Memuat detail buku...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#4a90e2" />
      <ScrollView style={styles.container} contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 80 }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <MaterialIcons name="menu-book" size={24} color="white" />
            <Text style={styles.headerTitle}>Detail Buku</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.coverContainer}>
          <Image source={{ uri: getCoverUrl() }} style={styles.coverImage} />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.bookTitle}>{title || 'Unknown Title'}</Text>
          <View style={styles.infoRow}>
            <MaterialIcons name="person" size={20} color="#4a90e2" />
            <Text style={styles.infoLabel}>Penulis:</Text>
            <Text style={styles.infoValue}>{author || bookDetail?.author_name?.join(', ') || 'Unknown'}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="calendar-today" size={20} color="#4a90e2" />
            <Text style={styles.infoLabel}>Tahun Terbit:</Text>
            <Text style={styles.infoValue}>{year || bookDetail?.first_publish_year || 'N/A'}</Text>
          </View>
          {bookDetail?.publisher && bookDetail.publisher.length > 0 && (
            <View style={styles.infoRow}>
              <MaterialIcons name="business" size={20} color="#4a90e2" />
              <Text style={styles.infoLabel}>Penerbit:</Text>
              <Text style={styles.infoValue} numberOfLines={2}>{bookDetail.publisher.slice(0, 2).join(', ')}</Text>
            </View>
          )}
          {bookDetail?.number_of_pages_median && (
            <View style={styles.infoRow}>
              <MaterialIcons name="menu-book" size={20} color="#4a90e2" />
              <Text style={styles.infoLabel}>Jumlah Halaman:</Text>
              <Text style={styles.infoValue}>{bookDetail.number_of_pages_median} halaman</Text>
            </View>
          )}
          {bookDetail?.language && bookDetail.language.length > 0 && (
            <View style={styles.infoRow}>
              <MaterialIcons name="language" size={20} color="#4a90e2" />
              <Text style={styles.infoLabel}>Bahasa:</Text>
              <Text style={styles.infoValue}>{bookDetail.language.join(', ').toUpperCase()}</Text>
            </View>
          )}
          {bookDetail?.isbn && bookDetail.isbn.length > 0 && (
            <View style={styles.infoRow}>
              <MaterialIcons name="qr-code" size={20} color="#4a90e2" />
              <Text style={styles.infoLabel}>ISBN:</Text>
              <Text style={styles.infoValue}>{bookDetail.isbn[0]}</Text>
            </View>
          )}
          {bookDetail?.subject && bookDetail.subject.length > 0 && (
            <View style={styles.subjectContainer}>
              <MaterialIcons name="local-offer" size={20} color="#4a90e2" />
              <Text style={styles.subjectLabel}>Topik:</Text>
              <View style={styles.subjectList}>
                {bookDetail.subject.slice(0, 5).map((subject, index) => (
                  <View key={index} style={styles.subjectTag}><Text style={styles.subjectTagText}>{subject}</Text></View>
                ))}
              </View>
            </View>
          )}
          {isFavorite && favoriteReason && (
            <View style={styles.favoriteReasonContainer}>
              <View style={styles.favoriteReasonHeader}>
                <MaterialIcons name="star" size={16} color="#ff9800" />
                <Text style={styles.favoriteReasonLabel}>Alasan Favorit:</Text>
              </View>
              <Text style={styles.favoriteReasonText}>{favoriteReason}</Text>
            </View>
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]} onPress={addToFavorites}>
            <MaterialIcons name={isFavorite ? "favorite" : "favorite-border"} size={22} color="white" />
            <Text style={styles.favoriteButtonText}>{isFavorite ? "Hapus dari Favorit" : "Tambah ke Favorit"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.borrowButton} onPress={shareBook}>
            <MaterialIcons name="share" size={22} color="white" />
            <Text style={styles.borrowButtonText}>Bagikan</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.loanButton}>
          <MaterialIcons name="local-library" size={22} color="white" />
          <Text style={styles.loanButtonText}>Pinjam Buku</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  contentContainer: { paddingBottom: 30 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f4f8' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#4a90e2' },
  header: { backgroundColor: '#4a90e2', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16 },
  backButton: { padding: 8 },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  coverContainer: { alignItems: 'center', marginTop: 24, marginBottom: 20, paddingHorizontal: 16 },
  coverImage: { width: 200, height: 280, borderRadius: 16, elevation: 5, backgroundColor: '#fff' },
  infoContainer: { backgroundColor: 'white', borderRadius: 16, marginHorizontal: 16, padding: 20, elevation: 2 },
  bookTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 20, textAlign: 'center' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' },
  infoLabel: { fontSize: 14, fontWeight: 'bold', color: '#666', marginLeft: 8, marginRight: 8, width: 100 },
  infoValue: { fontSize: 14, color: '#333', flex: 1 },
  subjectContainer: { marginTop: 8, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start' },
  subjectLabel: { fontSize: 14, fontWeight: 'bold', color: '#666', marginLeft: 8, marginRight: 8, width: 100 },
  subjectList: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  subjectTag: { backgroundColor: '#e8f0fe', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 4 },
  subjectTagText: { fontSize: 11, color: '#4a90e2' },
  favoriteReasonContainer: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#e0e0e0' },
  favoriteReasonHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  favoriteReasonLabel: { fontSize: 13, fontWeight: 'bold', color: '#ff9800' },
  favoriteReasonText: { fontSize: 13, color: '#666' },
  actionButtons: { flexDirection: 'row', marginHorizontal: 16, marginTop: 20, gap: 12 },
  favoriteButton: { flex: 1, backgroundColor: '#4a90e2', borderRadius: 12, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  favoriteButtonActive: { backgroundColor: '#ff4444' },
  favoriteButtonText: { fontSize: 14, fontWeight: 'bold', color: 'white' },
  borrowButton: { flex: 1, backgroundColor: '#2ecc71', borderRadius: 12, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  borrowButtonText: { fontSize: 14, fontWeight: 'bold', color: 'white' },
  loanButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#4a90e2', borderRadius: 12, marginHorizontal: 16, marginTop: 12, paddingVertical: 14, gap: 8 },
  loanButtonText: { fontSize: 14, fontWeight: 'bold', color: 'white' },
});