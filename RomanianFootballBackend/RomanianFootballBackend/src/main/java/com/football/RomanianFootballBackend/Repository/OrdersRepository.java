package com.football.RomanianFootballBackend.Repository;

import com.football.RomanianFootballBackend.Entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrdersRepository extends JpaRepository<Orders, Integer> {
}
