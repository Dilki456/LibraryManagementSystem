package borrow_service.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import borrow_service.model.BorrowRecord;
import borrow_service.repository.BorrowRepository;

@Service
public class BorrowService {

    private final BorrowRepository repository;

    public BorrowService(BorrowRepository repository) {
        this.repository = repository;
    }

    public BorrowRecord createBorrow(BorrowRecord record) {
        return repository.save(record);
    }

    public List<BorrowRecord> getAllBorrows() {
        return repository.findAll();
    }

    public Optional<BorrowRecord> getBorrowById(String id) {
        return repository.findById(id);
    }

    public BorrowRecord updateBorrow(String id, BorrowRecord record) {
        record.setId(id);
        return repository.save(record);
    }

    public void deleteBorrow(String id) {
        repository.deleteById(id);
    }
}