package com.football.RomanianFootballBackend.Service;

import com.football.RomanianFootballBackend.DTO.CartItemDTO;
import com.football.RomanianFootballBackend.DTO.ProductDTO;
import com.football.RomanianFootballBackend.Entity.CartItems;
import com.football.RomanianFootballBackend.Repository.CartItemsRepository;
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
        return cartItemsRepository.save(cartItems);
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
                    }
                    return cartItemsRepository.save(existingCartItems);
                })
                .orElse(null);
    }

    public void deleteCartItems(int id) {
        cartItemsRepository.deleteById(id);
    }
}