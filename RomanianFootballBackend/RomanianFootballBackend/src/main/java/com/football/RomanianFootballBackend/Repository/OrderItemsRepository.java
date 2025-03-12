package com.football.RomanianFootballBackend.Repository;

import com.football.RomanianFootballBackend.Entity.OrderItems;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemsRepository extends JpaRepository<OrderItems, Integer> {
}
