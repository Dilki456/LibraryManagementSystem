package com.library.bookservice.service;

import com.library.bookservice.model.Book;
import com.library.bookservice.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    // Add Book
    public Book addBook(Book book) {
        return bookRepository.save(book);
    }

    // Get All Books
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    // Get Book by ID
    public Optional<Book> getBookById(String id) {
        return bookRepository.findById(id);
    }

    // Update Book
    public Book updateBook(String id, Book book) {
        book.setId(id);
        return bookRepository.save(book);
    }

    // Delete Book
    public void deleteBook(String id) {
        bookRepository.deleteById(id);
    }

    // Search Books
    public List<Book> searchBooks(String title) {
    return bookRepository.findByTitleContainingIgnoreCase(title);
   }
}