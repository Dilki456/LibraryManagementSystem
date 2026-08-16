package com.library.bookservice.service;

import com.library.bookservice.exception.BookNotFoundException;
import com.library.bookservice.model.Book;
import com.library.bookservice.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    // Add Book
    public Book addBook(Book book) {
        validateBookCopies(book);
        return bookRepository.save(book);
    }

    // Get All Books
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    // Get Book by ID
    public Book getBookById(String id) {
        return bookRepository.findById(id)
                .orElseThrow(() ->
                        new BookNotFoundException(
                                "Book not found with id: " + id
                        ));
    }

    // Update Book
    public Book updateBook(String id, Book book) {

        Book existingBook = bookRepository.findById(id)
                .orElseThrow(() ->
                        new BookNotFoundException(
                                "Book not found with id: " + id
                        ));

        validateBookCopies(book);

        existingBook.setTitle(book.getTitle());
        existingBook.setAuthor(book.getAuthor());
        existingBook.setCategory(book.getCategory());
        existingBook.setIsbn(book.getIsbn());
        existingBook.setQuantity(book.getQuantity());
        existingBook.setAvailableCopies(book.getAvailableCopies());

        return bookRepository.save(existingBook);
    }

    // Delete Book
    public void deleteBook(String id) {

        if (!bookRepository.existsById(id)) {
            throw new BookNotFoundException(
                    "Book not found with id: " + id
            );
        }

        bookRepository.deleteById(id);
    }

    // Search Books by Title
    public List<Book> searchBooks(String title) {
        return bookRepository.findByTitleContainingIgnoreCase(title);
    }

    // Business validation
    private void validateBookCopies(Book book) {

        if (book.getAvailableCopies() > book.getQuantity()) {
            throw new IllegalArgumentException(
                    "Available copies cannot be greater than total quantity"
            );
        }
    }
}