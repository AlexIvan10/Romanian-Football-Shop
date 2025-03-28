package com.football.RomanianFootballBackend.Repository;

import com.football.RomanianFootballBackend.Entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findByNameContaining(String name);
}