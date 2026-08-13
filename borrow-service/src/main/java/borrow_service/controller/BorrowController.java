package borrow_service.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import borrow_service.model.BorrowRecord;
import borrow_service.service.BorrowService;

@RestController
@RequestMapping("/api/borrow")
@CrossOrigin(origins = "*")
public class BorrowController {

    private final BorrowService service;

    public BorrowController(BorrowService service) {
        this.service = service;
    }

    @PostMapping
    public BorrowRecord createBorrow(@RequestBody BorrowRecord record) {
        return service.createBorrow(record);
    }

    @GetMapping
    public List<BorrowRecord> getAllBorrows() {
        return service.getAllBorrows();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BorrowRecord> getBorrowById(
            @PathVariable String id) {

        return service.getBorrowById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<BorrowRecord> updateBorrow(
            @PathVariable String id,
            @RequestBody BorrowRecord record) {

        if (service.getBorrowById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(
                service.updateBorrow(id, record)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBorrow(
            @PathVariable String id) {

        if (service.getBorrowById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        service.deleteBorrow(id);

        return ResponseEntity.noContent().build();
    }
}