package com.football.RomanianFootballBackend.Repository;

import com.football.RomanianFootballBackend.Entity.WishlistItems;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WishlistItemsRepository extends JpaRepository<WishlistItems, Integer> {
}
