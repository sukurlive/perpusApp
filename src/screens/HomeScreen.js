import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';

const books = [
  { id: 1, title: 'React Native in Action', author: 'Nader Dabit', year: 2019 },
  { id: 2, title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', year: 2008 },
  { id: 3, title: 'Clean Code', author: 'Robert C. Martin', year: 2008 },
  { id: 4, title: 'The Pragmatic Programmer', author: 'David Thomas', year: 2019 },
  { id: 5, title: "You Don't Know JS", author: 'Kyle Simpson', year: 2015 },
  { id: 6, title: 'Eloquent JavaScript', author: 'Marijn Haverbeke', year: 2018 },
  { id: 7, title: 'Learning React', author: 'Alex Banks', year: 2020 },
  { id: 8, title: 'Node.js Design Patterns', author: 'Mario Casciaro', year: 2020 },
];

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={true}>
        <View style={styles.header}>
          <Text style={styles.headerIcon}>📚</Text>
          <Text style={styles.headerTitle}>Perpustakaan Digital</Text>
          <Text style={styles.headerSubtitle}>Total {books.length} Buku Tersedia</Text>
        </View>

        {books.map(book => (
          <View key={book.id} style={styles.card}>
            <View style={styles.cardIcon}>
              <Text style={styles.bookIcon}>📖</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.title}>{book.title}</Text>
              <Text style={styles.author}>✍️ {book.author}</Text>
              <Text style={styles.year}>📅 {book.year}</Text>
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
    backgroundColor: '#f0f4f8',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    backgroundColor: '#4a90e2',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e0e0e0',
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
  },
  cardIcon: {
    marginRight: 15,
    justifyContent: 'center',
  },
  bookIcon: {
    fontSize: 40,
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
    marginBottom: 2,
  },
  year: {
    fontSize: 12,
    color: '#999',
  },
});

export default HomeScreen;