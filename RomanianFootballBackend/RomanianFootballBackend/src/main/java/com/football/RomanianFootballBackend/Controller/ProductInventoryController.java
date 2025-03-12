package com.football.RomanianFootballBackend.Controller;

import com.football.RomanianFootballBackend.Entity.ProductInventory;
import com.football.RomanianFootballBackend.Service.ProductInventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/productInventory")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductInventoryController {
    @Autowired
    private ProductInventoryService productInventoryService;

    @GetMapping
    public ResponseEntity<?> getAllProductInventories() {
        return ResponseEntity.ok(productInventoryService.getAllProductInventories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductInventoryById(@PathVariable int id) {
        return ResponseEntity.ok(productInventoryService.getProductInventoryById(id));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Map<String, Object>>> getInventoryByProductId(@PathVariable Integer productId) {
        List<ProductInventory> inventory = productInventoryService.findByProductId(productId);
        List<Map<String, Object>> response = inventory.stream()
            .map(item -> {
                Map<String, Object> sizeInfo = new HashMap<>();
                sizeInfo.put("size", item.getSize().toString());
                sizeInfo.put("quantity", item.getQuantity());
                return sizeInfo;
            })
            .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> addProductInventory(@RequestBody ProductInventory productInventory) {
        return ResponseEntity.ok(productInventoryService.addProductInventory(productInventory));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProductInventory(@PathVariable int id, @RequestBody ProductInventory productInventory) {
        try {
            ProductInventory updatedProductInventory = productInventoryService.updateProductInventory(id, productInventory);
            if (updatedProductInventory != null) {
                return ResponseEntity.ok(updatedProductInventory);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating product inventory: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProductInventory(@PathVariable int id) {
        try {
            productInventoryService.deleteProductInventory(id);
            return ResponseEntity.ok("Product inventory deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting product inventory: " + e.getMessage());
        }
    }
}
