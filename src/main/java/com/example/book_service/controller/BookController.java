package com.example.book_service.controller;

import com.example.book_service.model.Book;
import com.example.book_service.service.BookService;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/books")
@CrossOrigin("*")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @PostMapping
    public @NonNull Book addBook(@RequestBody @NonNull Book book) {
        return bookService.addBook(book);
    }

    @GetMapping
    public @NonNull List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }

    @GetMapping("/{id}")
    public @NonNull Optional<Book> getBookById(@PathVariable @NonNull String id) {
        return bookService.getBookById(id);
    }

    @PutMapping("/{id}")
    public @NonNull Book updateBook(
            @PathVariable @NonNull String id,
            @RequestBody @NonNull Book book) {
        return bookService.updateBook(id, book);
    }

    @DeleteMapping("/{id}")
    public @NonNull String deleteBook(@PathVariable @NonNull String id) {
        bookService.deleteBook(id);
        return "Book Deleted Successfully";
    }

    @GetMapping("/search")
    public @NonNull List<Book> searchBooks(@RequestParam @NonNull String title) {
        return bookService.searchBooks(title);
    }
}