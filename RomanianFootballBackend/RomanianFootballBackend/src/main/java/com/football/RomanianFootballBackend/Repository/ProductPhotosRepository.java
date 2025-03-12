package com.football.RomanianFootballBackend.Repository;

import com.football.RomanianFootballBackend.Entity.ProductPhotos;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductPhotosRepository extends JpaRepository<ProductPhotos, Integer> {
    List<ProductPhotos> findByProductId(Integer productId);
    List<ProductPhotos> findByProductIdAndIsPrimaryTrue(Integer productId);
}
