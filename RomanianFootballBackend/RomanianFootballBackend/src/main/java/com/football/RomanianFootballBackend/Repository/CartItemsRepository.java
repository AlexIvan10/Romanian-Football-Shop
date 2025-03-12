package com.football.RomanianFootballBackend.Repository;

import com.football.RomanianFootballBackend.Entity.CartItems;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartItemsRepository extends JpaRepository<CartItems, Integer> {
    List<CartItems> findByCartId(Integer cartId);
}
