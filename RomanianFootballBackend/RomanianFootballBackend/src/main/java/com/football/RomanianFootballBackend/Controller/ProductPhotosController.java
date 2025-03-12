package com.football.RomanianFootballBackend.Controller;

import com.football.RomanianFootballBackend.Entity.ProductPhotos;
import com.football.RomanianFootballBackend.Service.ProductPhotosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/productPhotos")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ProductPhotosController {

    @Autowired
    private ProductPhotosService productPhotosService;

    @GetMapping
    public ResponseEntity<?> getAllPhotos() {
        return ResponseEntity.ok(productPhotosService.getAllPhotos());
    }

    @GetMapping("/{productId}")
    public ResponseEntity<?> getPhotoByProductId(@PathVariable Integer productId) {
        return ResponseEntity.ok(productPhotosService.getPhotoByProductId(productId));
    }

    @PostMapping
    public ResponseEntity<?> addPhoto(@RequestBody ProductPhotos productPhotos) {
        try {
            ProductPhotos newPhoto = productPhotosService.addPhoto(productPhotos);
            return ResponseEntity.ok(newPhoto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error adding photo: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePhoto(@PathVariable Integer id, @RequestBody ProductPhotos productPhotos) {
        try {
            ProductPhotos updatedPhoto = productPhotosService.updatePhoto(id, productPhotos);
            if (updatedPhoto != null) {
                return ResponseEntity.ok(updatedPhoto);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating photo: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePhoto(@PathVariable Integer id) {
        try {
            productPhotosService.deletePhoto(id);
            return ResponseEntity.ok("Photo deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting photo: " + e.getMessage());
        }
    }
}
