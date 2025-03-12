package com.football.RomanianFootballBackend.Controller;

import com.football.RomanianFootballBackend.Entity.CartItems;
import com.football.RomanianFootballBackend.Service.CartItemsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cartItems")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CartItemsController {
    @Autowired
    private CartItemsService cartItemsService;

    @GetMapping
    public ResponseEntity<?> getAllCartItems() {
        return ResponseEntity.ok(cartItemsService.getAllCartItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCartItemsById(@PathVariable int id) {
        return ResponseEntity.ok(cartItemsService.getCartItemsById(id));
    }

    @PostMapping
    public ResponseEntity<?> addCartItems(@RequestBody CartItems cartItems) {
        return ResponseEntity.ok(cartItemsService.addCartItems(cartItems));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCartItems(@PathVariable int id, @RequestBody UpdateQuantityRequest request) {
        try {
            CartItems existingItem = cartItemsService.getCartItemsById(id);
            if (existingItem == null) {
                return ResponseEntity.notFound().build();
            }

            existingItem.setQuantity(request.getQuantity());
            CartItems updatedItem = cartItemsService.updateCartItems(id, existingItem);

            return ResponseEntity.ok(updatedItem);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating cartItems: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCartItems(@PathVariable int id) {
        try {
            CartItems item = cartItemsService.getCartItemsById(id);
            if (item == null) {
                return ResponseEntity.notFound().build();
            }

            cartItemsService.deleteCartItems(id);
            return ResponseEntity.ok().body(Map.of(
                    "message", "CartItems deleted successfully",
                    "deletedId", id
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Error deleting cartItems",
                    "message", e.getMessage()
            ));
        }
    }

    // Inner class to handle quantity updates
    public static class UpdateQuantityRequest {
        private Integer quantity;

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }
}