package com.football.RomanianFootballBackend.Repository;

import com.football.RomanianFootballBackend.Entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
}
