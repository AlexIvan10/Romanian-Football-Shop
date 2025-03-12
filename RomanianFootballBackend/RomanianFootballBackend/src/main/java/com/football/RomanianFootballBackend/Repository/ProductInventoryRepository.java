package com.football.RomanianFootballBackend.Repository;

import com.football.RomanianFootballBackend.Entity.ProductInventory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductInventoryRepository extends JpaRepository<ProductInventory, Integer> {
    List<ProductInventory> findByProductId(Integer productId);
    Optional<ProductInventory> findByProductIdAndSize(Integer productId, ProductInventory.Size size);
}
