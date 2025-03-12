package com.football.RomanianFootballBackend.Controller;

import com.football.RomanianFootballBackend.DTO.WishlistItemDTO;
import com.football.RomanianFootballBackend.Entity.Product;
import com.football.RomanianFootballBackend.Entity.User;
import com.football.RomanianFootballBackend.Entity.Wishlist;
import com.football.RomanianFootballBackend.Entity.WishlistItems;
import com.football.RomanianFootballBackend.Repository.UserRepository;
import com.football.RomanianFootballBackend.Repository.WishlistItemsRepository;
import com.football.RomanianFootballBackend.Repository.WishlistRepository;
import com.football.RomanianFootballBackend.Repository.ProductRepository;
import com.football.RomanianFootballBackend.Service.WishlistService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private WishlistItemsRepository wishlistItemsRepository;

    public ResponseEntity<?> getAllWishlists() {
        return ResponseEntity.ok(wishlistService.getAllWishlists());
    }

    public ResponseEntity<?> getWishlistById(@PathVariable int id) {
        return ResponseEntity.ok(wishlistService.getWishlistById(id));
    }

    @GetMapping("/user/{userId}/items")
    public ResponseEntity<?> getWishlistItemsByUserId(@PathVariable Integer userId) {
        try {
            List<WishlistItemDTO> items = wishlistService.getWishlistItemsByUserId(userId);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/user/{userId}/check/{productId}")
    public ResponseEntity<?> checkProductInWishlist(@PathVariable int userId, @PathVariable int productId) {
        boolean inWishlist = wishlistService.isProductInWishlist(userId, productId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("inWishlist", inWishlist);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/add")  // Add this endpoint
    public ResponseEntity<?> addToWishlist(@RequestBody Map<String, Integer> request) {
        try {
            Integer userId = request.get("userId");
            Integer productId = request.get("productId");

            // First check if user has a wishlist, if not create one
            Optional<Wishlist> wishlist = wishlistRepository.findByUserId(userId);
            Wishlist userWishlist = wishlist.orElseGet(() -> {
                Wishlist newWishlist = new Wishlist();
                User user = userRepository.findById(userId)
                        .orElseThrow(() -> new EntityNotFoundException("User not found"));
                newWishlist.setUser(user);
                return wishlistRepository.save(newWishlist);
            });

            // Create and save wishlist item
            WishlistItems wishlistItem = new WishlistItems();
            wishlistItem.setWishlist(userWishlist);

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new EntityNotFoundException("Product not found"));
            wishlistItem.setProduct(product);

            wishlistItemsRepository.save(wishlistItem);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public ResponseEntity<?> addWishlist(@RequestBody Wishlist wishlist) {
        return ResponseEntity.ok(wishlistService.addWishlist(wishlist));
    }

    public ResponseEntity<?> updateWishlist(@PathVariable int id, @RequestBody Wishlist wishlist) {
        try {
            Wishlist updatedWishlist = wishlistService.updateWishlist(id, wishlist);
            if (updatedWishlist != null) {
                return ResponseEntity.ok(updatedWishlist);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating wishlist: " + e.getMessage());
        }
    }

    public ResponseEntity<?> deleteWishlist(@PathVariable int id) {
        try {
            wishlistService.deleteWishlist(id);
            return ResponseEntity.ok("Wishlist deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting wishlist: " + e.getMessage());
        }
    }
}
