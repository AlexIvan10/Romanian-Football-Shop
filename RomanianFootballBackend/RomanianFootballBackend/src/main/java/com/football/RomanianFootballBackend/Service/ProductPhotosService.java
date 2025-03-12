package com.football.RomanianFootballBackend.Service;

import com.football.RomanianFootballBackend.Entity.ProductPhotos;
import com.football.RomanianFootballBackend.Repository.ProductPhotosRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductPhotosService {
    @Autowired
    private ProductPhotosRepository productPhotosRepository;

    public List<ProductPhotos> getAllPhotos() {
        return productPhotosRepository.findAll();
    }

    public List<ProductPhotos> getPhotoByProductId(int productId) {
        return productPhotosRepository.findByProductId(productId);
    }

    @Transactional
    public ProductPhotos addPhoto(ProductPhotos newPhoto) {
        // If this photo is set as primary, update any existing primary photo for this product
        if (Boolean.TRUE.equals(newPhoto.getIsPrimary())) {
            updateExistingPrimaryPhoto(newPhoto.getProduct().getId());
        }
        return productPhotosRepository.save(newPhoto);
    }

    @Transactional
    public ProductPhotos updatePhoto(int id, ProductPhotos updatedPhoto) {
        return productPhotosRepository.findById(id)
                .map(existingPhoto -> {
                    // If setting this photo as primary, update any existing primary photo
                    if (Boolean.TRUE.equals(updatedPhoto.getIsPrimary())) {
                        updateExistingPrimaryPhoto(existingPhoto.getProduct().getId());
                    }

                    // Update the photo fields
                    if (updatedPhoto.getProduct() != null) {
                        existingPhoto.setProduct(updatedPhoto.getProduct());
                    }
                    if (updatedPhoto.getPhotoUrl() != null) {
                        existingPhoto.setPhotoUrl(updatedPhoto.getPhotoUrl());
                    }
                    existingPhoto.setIsPrimary(updatedPhoto.getIsPrimary());
                    if (updatedPhoto.getDisplayOrder() != null) {
                        existingPhoto.setDisplayOrder(updatedPhoto.getDisplayOrder());
                    }

                    return productPhotosRepository.save(existingPhoto);
                })
                .orElse(null);
    }

    private void updateExistingPrimaryPhoto(Integer productId) {
        List<ProductPhotos> currentPrimaryPhotos = productPhotosRepository.findByProductIdAndIsPrimaryTrue(productId);
        for (ProductPhotos photo : currentPrimaryPhotos) {
            photo.setIsPrimary(false);
            productPhotosRepository.save(photo);
        }
    }

    @Transactional
    public void deletePhoto(int id) {
        productPhotosRepository.deleteById(id);
    }
}
