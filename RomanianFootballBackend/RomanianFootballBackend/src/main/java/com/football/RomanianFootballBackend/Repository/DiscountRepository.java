package com.football.RomanianFootballBackend.Repository;

import com.football.RomanianFootballBackend.Entity.Discount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DiscountRepository extends JpaRepository<Discount, Integer> {
    Optional<Discount> findByCode(String code);
}
