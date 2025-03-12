package com.football.RomanianFootballBackend.Controller;

import com.football.RomanianFootballBackend.Entity.WishlistItems;
import com.football.RomanianFootballBackend.Service.WishlistItemsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlistItems")
public class WishlistItemsController {
    @Autowired
    private WishlistItemsService wishlistItemsService;

    @GetMapping
    public ResponseEntity<?> getAllWishlistItems() {
        return ResponseEntity.ok(wishlistItemsService.getAllWishlistItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getWishlistItemsById(@PathVariable int id) {
        return ResponseEntity.ok(wishlistItemsService.getWishlistItemsById(id));
    }

    @PostMapping
    public ResponseEntity<?> addWishlistItems(@RequestBody WishlistItems wishlistItems) {
        return ResponseEntity.ok(wishlistItemsService.addWishlistItems(wishlistItems));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateWishlistItems(@PathVariable int id, @RequestBody WishlistItems wishlistItems) {
        try {
            WishlistItems updatedWishlistItems = wishlistItemsService.updateWishlistItems(id, wishlistItems);
            if (updatedWishlistItems != null) {
                return ResponseEntity.ok(updatedWishlistItems);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating wishlistItems: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWishlistItems(@PathVariable int id) {
        try {
            wishlistItemsService.deleteWishlistItems(id);
            return ResponseEntity.ok("WishlistItems deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting wishlistItems: " + e.getMessage());
        }
    }
}
