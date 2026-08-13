package com.example.book_service.service;

import com.example.book_service.model.Book;
import com.example.book_service.repository.BookRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    // Add Book
    public @NonNull Book addBook(@NonNull Book book) {
        return Objects.requireNonNull(bookRepository.save(book));
    }

    // Get All Books
    public @NonNull List<Book> getAllBooks() {
        return Objects.requireNonNull(bookRepository.findAll());
    }

    // Get Book by ID
    public @NonNull Optional<Book> getBookById(@NonNull String id) {
        return Objects.requireNonNull(bookRepository.findById(id));
    }

    // Update Book
    public @NonNull Book updateBook(@NonNull String id, @NonNull Book book) {
        book.setId(id);
        return Objects.requireNonNull(bookRepository.save(book));
    }

    // Delete Book
    public void deleteBook(@NonNull String id) {
        bookRepository.deleteById(id);
    }

    // Search Books
    public @NonNull List<Book> searchBooks(@NonNull String title) {
        return Objects.requireNonNull(bookRepository.findByTitleContainingIgnoreCase(title));
    }
}