import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_KEY = 'AIzaSyDJt6wXG7AEL8V2KGaWbOlBQp0PYuhJCwE';

function BookFinderApp() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}`
      );

      if (response.data.items) {
        setBooks(response.data.items);
      } else {
        setBooks([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Book Finder Application</h1>
      <div className="form-group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="form-control"
          placeholder="Enter book title or author"
        />
        <button onClick={handleSearch} className="btn btn-primary mt-2">
          Search
        </button>
      </div>
      <div className="book-list">
        {books.map((book) => (
          <div key={book.id} className="book-item">
            <h3>{book.volumeInfo.title}</h3>
            <p>
              <strong>Author:</strong> {book.volumeInfo.authors?.join(', ')}
            </p>
            <p>
              <strong>Published Date:</strong> {book.volumeInfo.publishedDate}
            </p>
            <p>{book.volumeInfo.description}</p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookFinderApp;