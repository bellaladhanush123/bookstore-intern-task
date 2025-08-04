const express = require('express');
const axios = require('axios');
const router = express.Router();

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';
const API_KEY = 'AIzaSyD3LJhH5Xf7vG34t87ZJvJp89aZRtIa3no';

// Search books
router.get('/search', async (req, res) => {
  try {
    const { q, maxResults = 20 } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const response = await axios.get(GOOGLE_BOOKS_API, {
      params: {
        q,
        maxResults,
        key: API_KEY
      }
    });

    const books = response.data.items || [];
    
    const formattedBooks = books.map(book => ({
      id: book.id,
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors || ['Unknown'],
      publisher: book.volumeInfo.publisher || 'Unknown',
      publishedDate: book.volumeInfo.publishedDate || 'Unknown',
      description: book.volumeInfo.description || 'No description available',
      thumbnail: book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/120x180?text=No+Cover',
      previewLink: book.volumeInfo.previewLink || null,
      infoLink: book.volumeInfo.infoLink || null,
      pageCount: book.volumeInfo.pageCount || 0,
      categories: book.volumeInfo.categories || [],
      averageRating: book.volumeInfo.averageRating || 0,
      ratingsCount: book.volumeInfo.ratingsCount || 0
