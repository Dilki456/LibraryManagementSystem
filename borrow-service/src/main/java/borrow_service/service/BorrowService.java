package borrow_service.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import borrow_service.model.BorrowRecord;
import borrow_service.repository.BorrowRepository;

@Service
public class BorrowService {

    private final BorrowRepository repository;
    private final RestTemplate restTemplate;

    private static final String BOOK_SERVICE_URL =
            "http://book-service:8080/books/";

    private static final String NOTIFICATION_SERVICE_URL =
            "http://notification-service:8084/api/notifications";

    public BorrowService(
            BorrowRepository repository,
            RestTemplate restTemplate) {

        this.repository = repository;
        this.restTemplate = restTemplate;
    }

    public BorrowRecord createBorrow(BorrowRecord record) {

        String url = BOOK_SERVICE_URL + record.getBookId();

        ResponseEntity<BookResponse> response =
                restTemplate.getForEntity(
                        url,
                        BookResponse.class
                );

        BookResponse book = response.getBody();

        if (book == null) {
            throw new RuntimeException("Book not found");
        }

        if (book.getAvailableCopies() <= 0) {
            throw new RuntimeException(
                    "No available copies for this book"
            );
        }

        book.setAvailableCopies(
                book.getAvailableCopies() - 1
        );

        restTemplate.put(url, book);

        BorrowRecord saved = repository.save(record);

        createNotification(
                record.getUserId(),
                "Book borrowed successfully",
                "BORROW"
        );

        return saved;
    }

    public List<BorrowRecord> getAllBorrows() {
        return repository.findAll();
    }

    public Optional<BorrowRecord> getBorrowById(String id) {
        return repository.findById(id);
    }

    public BorrowRecord updateBorrow(
            String id,
            BorrowRecord record) {

        BorrowRecord existing =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Borrow record not found"
                                ));

        // Return book only when changing from BORROWED to RETURNED
        if ("RETURNED".equalsIgnoreCase(record.getStatus())
                && !"RETURNED".equalsIgnoreCase(existing.getStatus())) {

            String url =
                    BOOK_SERVICE_URL + existing.getBookId();

            ResponseEntity<BookResponse> response =
                    restTemplate.getForEntity(
                            url,
                            BookResponse.class
                    );

            BookResponse book = response.getBody();

            if (book == null) {
                throw new RuntimeException("Book not found");
            }

            if (book.getAvailableCopies()
                    < book.getQuantity()) {

                book.setAvailableCopies(
                        book.getAvailableCopies() + 1
                );

                restTemplate.put(url, book);
            }

            existing.setReturnDate(
                    record.getReturnDate()
            );

            existing.setStatus("RETURNED");

            existing.setUserId(record.getUserId());
            existing.setBookId(record.getBookId());
            existing.setBorrowDate(record.getBorrowDate());
            existing.setDueDate(record.getDueDate());

            BorrowRecord saved =
                    repository.save(existing);

            createNotification(
                    existing.getUserId(),
                    "Book returned successfully",
                    "RETURN"
            );

            return saved;
        }

        existing.setUserId(record.getUserId());
        existing.setBookId(record.getBookId());
        existing.setBorrowDate(record.getBorrowDate());
        existing.setDueDate(record.getDueDate());
        existing.setStatus(record.getStatus());

        return repository.save(existing);
    }

    public void deleteBorrow(String id) {
        repository.deleteById(id);
    }

    private void createNotification(
            String userId,
            String message,
            String type) {

        try {

            String url =
                    NOTIFICATION_SERVICE_URL
                            + "?userId="
                            + userId
                            + "&message="
                            + message
                            + "&type="
                            + type;

            restTemplate.postForObject(
                    url,
                    null,
                    String.class
            );

        } catch (Exception e) {

            System.out.println(
                    "Notification failed: "
                            + e.getMessage()
            );
        }
    }

    public static class BookResponse {

        private String id;
        private String title;
        private String author;
        private String category;
        private String isbn;
        private int quantity;
        private int availableCopies;

        public BookResponse() {
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getAuthor() {
            return author;
        }

        public void setAuthor(String author) {
            this.author = author;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public String getIsbn() {
            return isbn;
        }

        public void setIsbn(String isbn) {
            this.isbn = isbn;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }

        public int getAvailableCopies() {
            return availableCopies;
        }

        public void setAvailableCopies(int availableCopies) {
            this.availableCopies = availableCopies;
        }
    }
}
