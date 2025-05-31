package com.football.RomanianFootballBackend.Service;

import com.football.RomanianFootballBackend.DTO.CartItemDTO;
import com.football.RomanianFootballBackend.DTO.ProductDTO;
import com.football.RomanianFootballBackend.Entity.CartItems;
import com.football.RomanianFootballBackend.Repository.CartItemsRepository;
import com.football.RomanianFootballBackend.Repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartItemsService {

    @Autowired
    private CartItemsRepository cartItemsRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductService productService;

    public List<CartItems> getAllCartItems() {
        return cartItemsRepository.findAll();
    }

    public CartItems getCartItemsById(int id) {
        return cartItemsRepository.findById(id).orElse(null);
    }

    public List<CartItemDTO> getCartItemsByCartId(Integer cartId) {
        List<CartItems> items = cartItemsRepository.findByCartId(cartId);
        return items.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private CartItemDTO convertToDTO(CartItems cartItem) {
        CartItemDTO dto = new CartItemDTO();
        dto.setId(cartItem.getId());
        dto.setSize(cartItem.getSize().name());
        dto.setQuantity(cartItem.getQuantity());
        dto.setPlayer(cartItem.getPlayer());
        dto.setNumber(cartItem.getNumber());
        dto.setPrice(cartItem.getPrice());

        ProductDTO productDTO = productService.convertToDTO(cartItem.getProduct());
        dto.setProduct(productDTO);

        return dto;
    }

    public CartItems addCartItems(CartItems cartItems) {
        CartItems savedItem = cartItemsRepository.save(cartItems);
        // Update cart total after adding item
        updateCartTotal(cartItems.getCart().getId());
        return savedItem;
    }

    @Transactional
    public CartItems updateCartItems(int id, CartItems updatedCartItems) {
        return cartItemsRepository.findById(id)
                .map(existingCartItems -> {
                    if (updatedCartItems.getQuantity() != null) {
                        existingCartItems.setQuantity(updatedCartItems.getQuantity());
                        // Update the price based on the new quantity
                        BigDecimal unitPrice = existingCartItems.getProduct().getPrice();
                        existingCartItems.setPrice(unitPrice.multiply(BigDecimal.valueOf(updatedCartItems.getQuantity())));

                        CartItems saved = cartItemsRepository.save(existingCartItems);
                        // Update cart total after item update
                        updateCartTotal(existingCartItems.getCart().getId());
                        return saved;
                    }
                    return cartItemsRepository.save(existingCartItems);
                })
                .orElse(null);
    }

    @Transactional
    public void deleteCartItems(int id) {
        CartItems item = cartItemsRepository.findById(id).orElse(null);
        if (item != null) {
            Integer cartId = item.getCart().getId();
            cartItemsRepository.deleteById(id);
            // Update cart total after item deletion
            updateCartTotal(cartId);
        }
    }

    private void updateCartTotal(Integer cartId) {
        List<CartItems> items = cartItemsRepository.findByCartId(cartId);
        BigDecimal total = items.stream()
                .map(CartItems::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        cartRepository.findById(cartId).ifPresent(cart -> {
            cart.setTotalPrice(total);
            cartRepository.save(cart);
        });
    }
}