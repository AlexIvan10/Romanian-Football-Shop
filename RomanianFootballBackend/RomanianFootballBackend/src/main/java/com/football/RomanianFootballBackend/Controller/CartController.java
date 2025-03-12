package com.football.RomanianFootballBackend.Controller;

import com.football.RomanianFootballBackend.DTO.AddToCartDTO;
import com.football.RomanianFootballBackend.DTO.CartItemDTO;
import com.football.RomanianFootballBackend.Entity.Cart;
import com.football.RomanianFootballBackend.Entity.CartItems;
import com.football.RomanianFootballBackend.Entity.ProductPhotos;
import com.football.RomanianFootballBackend.Service.CartItemsService;
import com.football.RomanianFootballBackend.Service.CartService;
import com.football.RomanianFootballBackend.Service.ProductPhotosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private CartItemsService cartItemsService;

    @GetMapping
    public ResponseEntity<?> getAllCarts() {
        return ResponseEntity.ok(cartService.getAllCarts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCartById(@PathVariable int id) {
        return ResponseEntity.ok(cartService.getCartById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getCartByUserId(@PathVariable Integer userId) {
        try {
            Cart cart = cartService.getCartByUserId(userId);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/user/{userId}/items")
public ResponseEntity<?> getCartItemsByUserId(@PathVariable Integer userId) {
    try {
        Cart cart = cartService.getCartByUserId(userId);
        if (cart == null) {
            return ResponseEntity.notFound().build();
        }

        List<CartItemDTO> cartItems = cartItemsService.getCartItemsByCartId(cart.getId());
        return ResponseEntity.ok(cartItems);
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

    @PostMapping
    public ResponseEntity<?> addCart(@RequestBody Cart cart) {
        return ResponseEntity.ok(cartService.addCart(cart));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody AddToCartDTO addToCartDTO) {
        try {
            return ResponseEntity.ok(cartService.addItemToCart(addToCartDTO));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCart(@PathVariable int id, @RequestBody Cart cart) {
        try {
            Cart updatedCart = cartService.updateCart(id, cart);
            if (updatedCart != null) {
                return ResponseEntity.ok(updatedCart);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating cart: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCart(@PathVariable int id) {
        try {
            cartService.deleteCart(id);
            return ResponseEntity.ok("Cart deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting cart: " + e.getMessage());
        }
    }
}
