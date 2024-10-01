let startIndex = 0;

// Get the search input and pagination elements
const searchInput = document.getElementById('searchInput');
const pagination = document.getElementById('pagination'); // Add this line

// Add an event listener to clear displayed books and hide pagination when input is empty
searchInput.addEventListener('input', function () {
    const booksContainer = document.getElementById('booksContainer');
    booksContainer.innerHTML = ''; // Clear displayed books
    
    // Hide pagination when the input is empty
    if (this.value.trim() === '') {
        pagination.style.display = 'none'; // Hide pagination
    }
});


function findBooks() {
    const searchInput = document.getElementById('searchInput').value;
    const loadingSpinner = document.getElementById('loadingSpinner');
    const booksContainer = document.getElementById('booksContainer');

    if (searchInput.trim() === '') {
        alert('Please enter a book name');
        return;
    }

    loadingSpinner.style.display = 'block';
    booksContainer.innerHTML = ''; // Clear previous results

    const apiURL = `https://www.googleapis.com/books/v1/volumes?q=${searchInput}&startIndex=${startIndex}&maxResults=10`;

    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            loadingSpinner.style.display = 'none';

            // Check if data is valid and has items
            if (data.items && data.items.length > 0) {
                displayBooks(data.items);
                pagination.style.display = 'flex'; // Show pagination when books are found
            } else {
                booksContainer.innerHTML = '<p>No books found. Please try a different search term.</p>';
                pagination.style.display = 'none'; // Hide pagination if no books found
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            loadingSpinner.style.display = 'none';
            booksContainer.innerHTML = '<p>Something went wrong. Please try again later.</p>';
            pagination.style.display = 'none'; // Hide pagination on error
        });
}




function nextPage() {
    startIndex += 10;
    findBooks();
}

function prevPage() {
    if (startIndex > 0) {
        startIndex -= 10;
        findBooks();
    }
}

function displayBooks(books) {
    const booksContainer = document.getElementById('booksContainer');
    booksContainer.innerHTML = ''; // Clear previous results

    books.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.classList.add('book');

        const thumbnail = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/150';
        const title = book.volumeInfo.title || 'No Title Available';
        const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author';

        bookElement.innerHTML = `
            <img src="${thumbnail}" alt="${title}">
            <h3>${title}</h3>
            <p>${authors}</p>
            <button onclick='saveToFavorites(${JSON.stringify(book)})'>Add to Favorites</button>
        `;

        booksContainer.appendChild(bookElement);
    });
}


function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}


// Show favorites or "No Favorite Books Found" on page load
document.addEventListener('DOMContentLoaded', function() {
    showFavorites();
});

function showFavorites() {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const booksContainer = document.getElementById('booksContainer');
    booksContainer.innerHTML = '';  // Clear previous results

    const placeholder = document.createElement('div'); // Change to div for styling

    if (favorites.length === 0) {
        placeholder.textContent = 'No favorite books found';  // Show this initially
        placeholder.classList.add('no-favorites'); // Add the new class
    } else {
        placeholder.textContent = 'Your favorite books';  // Show this when there are favorites
    }

    booksContainer.appendChild(placeholder);

    favorites.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.classList.add('book');

        const thumbnail = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/150';
        const title = book.volumeInfo.title || 'No Title Available';
        const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author';

        bookElement.innerHTML = `
            <img src="${thumbnail}" alt="${title}">
            <h3>${title}</h3>
            <p>${authors}</p>
            <button onclick='removeFromFavorites("${book.id}")'>Remove from Favorites</button>
        `;

        booksContainer.appendChild(bookElement);
    });
}


function saveToFavorites(book) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Check if book is already in favorites to prevent duplicates
    const isAlreadyFavorite = favorites.some(fav => fav.id === book.id);
    
    if (!isAlreadyFavorite) {
        favorites.push(book);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert('Book saved to favorites!');
    } else {
        alert('This book is already in your favorites.');
    }

    // Refresh the favorites section to update the message
    showFavorites();
}


function removeFromFavorites(bookId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Filter out the book to be removed
    favorites = favorites.filter(book => book.id !== bookId);
    
    // Update localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('Book removed from favorites!');

    // Refresh the favorites section to update the message
    showFavorites();
}



// Function to fetch a random book-related background image from Unsplash
async function fetchRandomBackground() {
    try {
        const response = await fetch('https://api.unsplash.com/photos/random?query=books&client_id=4y0EM0IZPy6nzmHbxdnXrk3UqKdKbPjn-FUbIThe1-M');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Set the fetched image as background
        document.body.style.backgroundImage = `url(${data.urls.full})`;
        document.body.style.backgroundSize = 'cover'; // Cover the entire screen
        document.body.style.backgroundPosition = 'center'; // Center the image
    } catch (error) {
        console.error('Error fetching the image:', error);
    }
}

// Call this function on page load or theme change
fetchRandomBackground();
