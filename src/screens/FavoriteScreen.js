import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';

const favorites = [
  { id: 1, title: 'Atomic Habits', author: 'James Clear', reason: 'Membangun kebiasaan baik' },
  { id: 2, title: 'Deep Work', author: 'Cal Newport', reason: 'Meningkatkan fokus' },
  { id: 3, title: 'The Design of Everyday Things', author: 'Don Norman', reason: 'Design thinking' },
  { id: 4, title: 'Zero to One', author: 'Peter Thiel', reason: 'Inovasi startup' },
  { id: 5, title: 'Sapiens', author: 'Yuval Noah Harari', reason: 'Sejarah manusia' },
  { id: 6, title: 'Think and Grow Rich', author: 'Napoleon Hill', reason: 'Mindset sukses' },
];

const FavoriteScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={true}>
        <View style={styles.header}>
          <Text style={styles.headerIcon}>⭐</Text>
          <Text style={styles.headerTitle}>Buku Favorit Saya</Text>
          <Text style={styles.headerSubtitle}>{favorites.length} Buku yang paling saya suka</Text>
        </View>

        {favorites.map(book => (
          <View key={book.id} style={styles.card}>
            <View style={styles.starIcon}>
              <Text style={styles.star}>⭐</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.title}>{book.title}</Text>
              <Text style={styles.author}>✍️ {book.author}</Text>
              <View style={styles.reasonContainer}>
                <Text style={styles.reasonLabel}>💡 Alasan:</Text>
                <Text style={styles.reason}>{book.reason}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff9f0',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    backgroundColor: '#ff9800',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 45,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff0d0',
    marginTop: 5,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  starIcon: {
    marginRight: 15,
    justifyContent: 'center',
  },
  star: {
    fontSize: 30,
  },
  cardContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  reasonContainer: {
    backgroundColor: '#fff3e0',
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  reasonLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ff9800',
    marginBottom: 2,
  },
  reason: {
    fontSize: 12,
    color: '#666',
  },
});

export default FavoriteScreen;