package borrow_service.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import borrow_service.model.BorrowRecord;

public interface BorrowRepository extends MongoRepository<BorrowRecord, String> {

}