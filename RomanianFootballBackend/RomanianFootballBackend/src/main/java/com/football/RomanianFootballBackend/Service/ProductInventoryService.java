package com.football.RomanianFootballBackend.Service;

import com.football.RomanianFootballBackend.Entity.ProductInventory;
import com.football.RomanianFootballBackend.Repository.ProductInventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductInventoryService {

    @Autowired
    private ProductInventoryRepository productInventoryRepository;

    public List<ProductInventory> getAllProductInventories() {
        return productInventoryRepository.findAll();
    }

    public ProductInventory getProductInventoryById(int id) {
        return productInventoryRepository.findById(id).orElse(null);
    }

    public List<ProductInventory> findByProductId(Integer productId) {
        return productInventoryRepository.findByProductId(productId);
    }

    // Method to check if a specific size is available for a product
    public boolean isSizeAvailable(Integer productId, ProductInventory.Size size) {
        return productInventoryRepository.findByProductIdAndSize(productId, size)
                .map(inventory -> inventory.getQuantity() > 0)
                .orElse(false);
    }

    // Method to get available quantity for a specific size
    public int getAvailableQuantity(Integer productId, ProductInventory.Size size) {
        return productInventoryRepository.findByProductIdAndSize(productId, size)
                .map(ProductInventory::getQuantity)
                .orElse(0);
    }

    public List<InventoryResponse> getAvailableSizes(int productId) {
        List<ProductInventory> inventories = productInventoryRepository.findByProductId(productId);
        return inventories.stream()
            .map(inventory -> new InventoryResponse(
                inventory.getSize(),
                inventory.getQuantity() > 0
            ))
            .collect(Collectors.toList());
    }

    public ProductInventory addProductInventory(ProductInventory productInventory) {
        return productInventoryRepository.save(productInventory);
    }

    public ProductInventory updateProductInventory(int id, ProductInventory updatedProductInventory) {
        return productInventoryRepository.findById(id)
                .map(existingProductInventory -> {
                    if (updatedProductInventory.getProduct() != null) {
                        existingProductInventory.setProduct(updatedProductInventory.getProduct());
                    }
                    if (updatedProductInventory.getQuantity() != null) {
                        existingProductInventory.setQuantity(updatedProductInventory.getQuantity());
                    }
                    if (updatedProductInventory.getSize() != null) {
                        existingProductInventory.setSize(updatedProductInventory.getSize());
                    }

                    return productInventoryRepository.save(existingProductInventory);
                })
                .orElse(null);
    }

    public void deleteProductInventory(int id) {
        productInventoryRepository.deleteById(id);
    }

    public record InventoryResponse(
            ProductInventory.Size size,
            boolean available
    ) {
    }
}
