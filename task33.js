// Import the express library
const express = require('express');
// Import the body-parser middleware for parsing JSON in request bodies
const bodyParser = require('body-parser');

// Create an instance of the Express application
const app = express();
// Define the port the server will listen on
const PORT = 3000;

// Middleware to parse JSON bodies from incoming requests
app.use(bodyParser.json());

// --- In-memory Data Store ---
// In a real application, this would be a database (e.g., MongoDB, PostgreSQL)
// We'll use a simple array to store book objects
let books = [
    { id: '1', title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', publishedYear: 1954 },
    { id: '2', title: 'Pride and Prejudice', author: 'Jane Austen', publishedYear: 1813 },
    { id: '3', title: '1984', author: 'George Orwell', publishedYear: 1949 }
];

// --- Helper function to generate a unique ID ---
// This is a simple way to generate IDs for demonstration.
// In a production environment, you might use a UUID library or database auto-increment.
const generateId = () => {
    return (books.length > 0) ? (Math.max(...books.map(book => parseInt(book.id))) + 1).toString() : '1';
};

// --- API Endpoints ---

// 1. GET all books
// Route: GET /books
// Description: Retrieves a list of all books
app.get('/books', (req, res) => {
    console.log('GET /books request received');
    res.status(200).json(books); // Send the entire books array as a JSON response with a 200 OK status
});

// 2. GET a single book by ID
// Route: GET /books/:id
// Description: Retrieves a single book by its ID
app.get('/books/:id', (req, res) => {
    const { id } = req.params; // Extract the 'id' from the request parameters
    console.log(`GET /books/${id} request received`);

    // Find the book in the 'books' array that matches the provided ID
    const book = books.find(b => b.id === id);

    if (book) {
        // If the book is found, send it as a JSON response with a 200 OK status
        res.status(200).json(book);
    } else {
        // If no book is found with the given ID, send a 404 Not Found status with a message
        res.status(404).json({ message: 'Book not found' });
    }
});

// 3. POST a new book
// Route: POST /books
// Description: Adds a new book to the list
app.post('/books', (req, res) => {
    const newBook = req.body; // The new book data is in the request body
    console.log('POST /books request received with body:', newBook);

    // Basic validation: Check if required fields are present
    if (!newBook.title || !newBook.author || !newBook.publishedYear) {
        // If any required field is missing, send a 400 Bad Request status
        return res.status(400).json({ message: 'Title, author, and publishedYear are required' });
    }

    // Generate a unique ID for the new book
    newBook.id = generateId();
    // Add the new book to our in-memory array
    books.push(newBook);

    // Send the newly created book as a JSON response with a 201 Created status
    res.status(201).json(newBook);
});

// 4. PUT (update) an existing book
// Route: PUT /books/:id
// Description: Updates an existing book identified by its ID
app.put('/books/:id', (req, res) => {
    const { id } = req.params; // Extract the 'id' from the request parameters
    const updatedBookData = req.body; // The updated book data is in the request body
    console.log(`PUT /books/${id} request received with body:`, updatedBookData);

    // Find the index of the book to update
    const bookIndex = books.findIndex(b => b.id === id);

    if (bookIndex !== -1) {
        // If the book is found, update its properties
        // We're merging existing data with new data, ensuring the ID remains the same
        books[bookIndex] = { ...books[bookIndex], ...updatedBookData, id: id };
        // Send the updated book as a JSON response with a 200 OK status
        res.status(200).json(books[bookIndex]);
    } else {
        // If no book is found with the given ID, send a 404 Not Found status
        res.status(404).json({ message: 'Book not found' });
    }
});

// 5. DELETE a book
// Route: DELETE /books/:id
// Description: Deletes a book identified by its ID
app.delete('/books/:id', (req, res) => {
    const { id } = req.params; // Extract the 'id' from the request parameters
    console.log(`DELETE /books/${id} request received`);

    // Filter out the book with the matching ID from the array
    const initialLength = books.length;
    books = books.filter(b => b.id !== id);

    if (books.length < initialLength) {
        // If a book was removed (length changed), send a 204 No Content status
        // A 204 response typically has no body.
        res.status(204).send();
    } else {
        // If no book was found to delete, send a 404 Not Found status
        res.status(404).json({ message: 'Book not found' });
    }
});

// --- Start the server ---
app.listen(PORT, () => {
    console.log(`Book API listening at http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log('GET /books - Get all books');
    console.log('GET /books/:id - Get a book by ID');
    console.log('POST /books - Add a new book (requires {title, author, publishedYear} in body)');
    console.log('PUT /books/:id - Update a book by ID (requires {title, author, publishedYear} in body)');
    console.log('DELETE /books/:id - Delete a book by ID');
});
