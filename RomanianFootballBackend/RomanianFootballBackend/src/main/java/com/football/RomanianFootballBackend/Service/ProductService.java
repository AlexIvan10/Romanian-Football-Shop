package com.football.RomanianFootballBackend.Service;

import com.football.RomanianFootballBackend.DTO.ProductDTO;
import com.football.RomanianFootballBackend.Entity.Product;
import com.football.RomanianFootballBackend.Entity.ProductPhotos;
import com.football.RomanianFootballBackend.Repository.ProductRepository;
import com.football.RomanianFootballBackend.Repository.ProductPhotosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductPhotosRepository productPhotosRepository;

    public List<ProductDTO> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    ProductDTO convertToDTO(Product product) {
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

    public Product getProductById(int id) {
        return productRepository.findById(id).orElse(null);
    }

    public List<ProductDTO> getProductsByName(String name) {
        List<Product> products = productRepository.findByNameContaining(name);
        return products.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(int id, Product updatedProduct) {
        return productRepository.findById(id)
                .map(existingProduct -> {
                    if (updatedProduct.getName() != null) {
                        existingProduct.setName(updatedProduct.getName());
                    }
                    if (updatedProduct.getDescription() != null) {
                        existingProduct.setDescription(updatedProduct.getDescription());
                    }
                    if (updatedProduct.getPrice() != null) {
                        existingProduct.setPrice(updatedProduct.getPrice());
                    }
                    if (updatedProduct.getTeam() != null) {
                        existingProduct.setTeam(updatedProduct.getTeam());
                    }
                    if (updatedProduct.getLicenced() != null) {
                        existingProduct.setLicenced(updatedProduct.getLicenced());
                    }
                    return productRepository.save(existingProduct);
                })
                .orElse(null);
    }

    public void deleteProduct(int id) {
        productRepository.deleteById(id);
    }
}
