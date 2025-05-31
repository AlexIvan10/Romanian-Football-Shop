package com.football.RomanianFootballBackend.Service;

import com.football.RomanianFootballBackend.DTO.AddToCartDTO;
import com.football.RomanianFootballBackend.Entity.*;
import com.football.RomanianFootballBackend.Repository.CartRepository;
import com.football.RomanianFootballBackend.Repository.CartItemsRepository;
import com.football.RomanianFootballBackend.Repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemsRepository cartItemsRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Cart> getAllCarts() {
        return cartRepository.findAll();
    }

    public Cart getCartById(int id) {
        return cartRepository.findById(id).orElse(null);
    }

    public Cart getCartByUserId(Integer userId) {
        return cartRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Cart not found for user"));
    }

    public Cart addCart(Cart cart) {
        return cartRepository.save(cart);
    }

    @Transactional
    public CartItems addItemToCart(AddToCartDTO addToCartDTO) {
        // Find the cart
        Cart cart = cartRepository.findById(addToCartDTO.getCartId())
                .orElseThrow(() -> new EntityNotFoundException("Cart not found"));

        // Find the product
        Product product = productRepository.findById(addToCartDTO.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        // Create new cart item
        CartItems cartItem = new CartItems();
        cartItem.setCart(cart);
        cartItem.setProduct(product);
        cartItem.setQuantity(addToCartDTO.getQuantity());
        cartItem.setSize(ProductInventory.Size.valueOf(addToCartDTO.getSize()));
        cartItem.setPlayer(addToCartDTO.getPlayer());
        cartItem.setNumber(addToCartDTO.getNumber());

        // Calculate price (if you're storing it in cart_items)
        cartItem.setPrice(product.getPrice().multiply(BigDecimal.valueOf(addToCartDTO.getQuantity())));

        CartItems savedItem = cartItemsRepository.save(cartItem);

        // Update cart total
        updateCartTotal(cart.getId());

        return savedItem;
    }

    @Transactional
    public void updateCartTotal(Integer cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new EntityNotFoundException("Cart not found"));

        List<CartItems> items = cartItemsRepository.findByCartId(cartId);
        BigDecimal total = items.stream()
                .map(CartItems::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        cart.setTotalPrice(total);
        cartRepository.save(cart);
    }

    public Cart updateCart(int id, Cart updatedCart) {
        return cartRepository.findById(id)
                .map(existingCart -> {
                    if (updatedCart.getUser() != null) {
                        existingCart.setUser(updatedCart.getUser());
                    }

                    return cartRepository.save(existingCart);
                })
                .orElse(null);
    }

    public void deleteCart(int id) {
        cartRepository.deleteById(id);
    }
}