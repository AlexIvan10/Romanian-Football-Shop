package com.football.RomanianFootballBackend.Service;

import com.football.RomanianFootballBackend.DTO.ProductDTO;
import com.football.RomanianFootballBackend.DTO.WishlistItemDTO;
import com.football.RomanianFootballBackend.Entity.*;
import com.football.RomanianFootballBackend.Repository.ProductPhotosRepository;
import com.football.RomanianFootballBackend.Repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private ProductPhotosRepository productPhotosRepository;

    public List<Wishlist> getAllWishlists() {
        return wishlistRepository.findAll();
    }

    public Wishlist getWishlistById(int id) {
        return wishlistRepository.findById(id).orElse(null);
    }

    public List<WishlistItemDTO> getWishlistItemsByUserId(Integer userId) {
        Optional<Wishlist> wishlist = wishlistRepository.findByUserId(userId);
        if (wishlist.isEmpty()) {
            return new ArrayList<>();
        }

        return wishlist.get().getWishlistItems().stream()
                .map(item -> {
                    WishlistItemDTO dto = new WishlistItemDTO();
                    dto.setId(item.getId());
                    dto.setProduct(convertToDTO(item.getProduct()));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setTeam(product.getTeam());
        dto.setLicenced(product.getLicenced());

        // Find primary photo or first available photo
        List<ProductPhotos> photos = productPhotosRepository.findByProductId(product.getId());
        if (!photos.isEmpty()) {
            // Try to find primary photo first
            ProductPhotos primaryPhoto = photos.stream()
                    .filter(ProductPhotos::getPrimary)
                    .findFirst()
                    .orElse(photos.getFirst());

            // Convert file system path to web path if necessary
            String photoUrl = primaryPhoto.getPhotoUrl();
            if (photoUrl.contains(":\\")) {  // Check if it's a file system path
                // Extract just the filename
                String[] parts = photoUrl.split("\\\\");
                String filename = parts[parts.length - 1];
                photoUrl = "/images/" + filename;
            }
            dto.setPhotoUrl(photoUrl);
        }

        return dto;
    }

    public boolean isProductInWishlist(int userId, int productId) {
    Optional<Wishlist> wishlist = wishlistRepository.findByUserId(userId);
    if (wishlist.isEmpty()) return false;

    return wishlist.get().getWishlistItems().stream()
        .anyMatch(item -> item.getProduct().getId() == productId);
}

    public Wishlist addWishlist(Wishlist wishlist) {
        return wishlistRepository.save(wishlist);
    }

    public Wishlist updateWishlist(int id, Wishlist updatedWishlist) {
        return wishlistRepository.findById(id)
                .map(existingWishlist -> {
                    if (updatedWishlist.getUser() != null) {
                        existingWishlist.setUser(updatedWishlist.getUser());
                    }
                    return wishlistRepository.save(existingWishlist);
                })
                .orElse(null);
    }

    public void deleteWishlist(int id) {
        wishlistRepository.deleteById(id);
    }
}
