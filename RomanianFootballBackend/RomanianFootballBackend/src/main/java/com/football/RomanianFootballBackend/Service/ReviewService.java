package com.football.RomanianFootballBackend.Service;

import com.football.RomanianFootballBackend.Entity.Review;
import com.football.RomanianFootballBackend.Repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public Review getReviewById(int id) {
        return reviewRepository.findById(id).orElse(null);
    }

    public Review addReview(Review review) {
        return reviewRepository.save(review);
    }

    public Review updateReview(int id, Review updatedReview) {
        return reviewRepository.findById(id)
                .map(existingReview -> {
                    if (updatedReview.getUser() != null) {
                        existingReview.setUser(updatedReview.getUser());
                    }
                    if (updatedReview.getProduct() != null) {
                        existingReview.setProduct(updatedReview.getProduct());
                    }
                    if (updatedReview.getRating() != null) {
                        existingReview.setRating(updatedReview.getRating());
                    }
                    if (updatedReview.getComment() != null) {
                        existingReview.setComment(updatedReview.getComment());
                    }
                    if (updatedReview.getCreatedAt() != null) {
                        existingReview.setCreatedAt(updatedReview.getCreatedAt());
                    }
                    return reviewRepository.save(existingReview);
                })
                .orElse(null);
    }

    public void deleteReview(int id) {
        reviewRepository.deleteById(id);
    }
}
