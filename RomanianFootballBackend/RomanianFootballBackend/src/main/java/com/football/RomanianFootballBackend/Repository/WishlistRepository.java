package com.football.RomanianFootballBackend.Repository;

import com.football.RomanianFootballBackend.Entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Integer> {
    Optional<Wishlist> findByUserId(Integer userId);
}
