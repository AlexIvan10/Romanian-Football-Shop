package com.football.RomanianFootballBackend.Controller;

import com.football.RomanianFootballBackend.Entity.Discount;
import com.football.RomanianFootballBackend.Service.DiscountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/discount")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class DiscountController {
    @Autowired
    private DiscountService discountService;

    @GetMapping
    public ResponseEntity<?> getAllDiscounts() {
        return ResponseEntity.ok(discountService.getAllDiscounts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDiscountById(@PathVariable int id) {
        return ResponseEntity.ok(discountService.getDiscountById(id));
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateDiscount(@RequestParam String code) {
        System.out.println("Validating coupon code: " + code);

        Discount discount = discountService.findByCode(code);
        System.out.println("Found discount: " + discount);

        if (discount == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("valid", false);
            response.put("message", "Invalid coupon code");
            return ResponseEntity.ok(response);
        }

        if (!discount.getActive()) {
            Map<String, Object> response = new HashMap<>();
            response.put("valid", false);
            response.put("message", "Coupon is not active");
            return ResponseEntity.ok(response);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("valid", true);
        response.put("discountPercentage", discount.getDiscountPercentage());
        response.put("discountId", discount.getId()); // Add this line
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> addDiscount(@RequestBody Discount discount) {
        return ResponseEntity.ok(discountService.addDiscount(discount));
    }

    @PutMapping("/{id}/use")
    public ResponseEntity<?> useDiscount(@PathVariable int id) {
        try {
            Discount usedDiscount = discountService.markDiscountAsUsed(id);
            if (usedDiscount != null) {
                return ResponseEntity.ok(usedDiscount);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error using discount: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDiscount(@PathVariable int id, @RequestBody Discount discount) {
        try {
            Discount updatedDiscount = discountService.updateDiscount(id, discount);
            if (updatedDiscount != null) {
                return ResponseEntity.ok(updatedDiscount);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating discount: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDiscount(@PathVariable int id) {
        try {
            discountService.deleteDiscount(id);
            return ResponseEntity.ok("Discount deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting discount: " + e.getMessage());
        }
    }
}