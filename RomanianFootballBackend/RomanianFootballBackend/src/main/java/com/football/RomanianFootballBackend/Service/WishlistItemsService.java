package com.football.RomanianFootballBackend.Service;

import com.football.RomanianFootballBackend.Entity.WishlistItems;
import com.football.RomanianFootballBackend.Repository.WishlistItemsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WishlistItemsService {

    @Autowired
    private WishlistItemsRepository wishlistItemsRepository;

    public List<WishlistItems> getAllWishlistItems() {
        return wishlistItemsRepository.findAll();
    }

    public WishlistItems getWishlistItemsById(int id) {
        return wishlistItemsRepository.findById(id).orElse(null);
    }

    public WishlistItems addWishlistItems(WishlistItems wishlistItems) {
        return wishlistItemsRepository.save(wishlistItems);
    }

    public WishlistItems updateWishlistItems(int id, WishlistItems updatedWishlistItems) {
        return wishlistItemsRepository.findById(id)
                .map(existingWishlistItems -> {
                    if (updatedWishlistItems.getWishlist() != null) {
                        existingWishlistItems.setWishlist(updatedWishlistItems.getWishlist());
                    }
                    if (updatedWishlistItems.getProduct() != null) {
                        existingWishlistItems.setProduct(updatedWishlistItems.getProduct());
                    }

                    return wishlistItemsRepository.save(existingWishlistItems);
                })
                .orElse(null);
    }

    public void deleteWishlistItems(int id) {
        wishlistItemsRepository.deleteById(id);
    }
}
