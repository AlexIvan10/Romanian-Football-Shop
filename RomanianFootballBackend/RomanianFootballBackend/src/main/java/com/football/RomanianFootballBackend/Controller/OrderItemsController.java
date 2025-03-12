package com.football.RomanianFootballBackend.Controller;

import com.football.RomanianFootballBackend.Entity.OrderItems;
import com.football.RomanianFootballBackend.Service.OrderItemsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orderItems")
public class OrderItemsController {
    @Autowired
    private OrderItemsService orderItemsService;

    @GetMapping
    public ResponseEntity<?> getAllOrderItems() {
        return ResponseEntity.ok(orderItemsService.getAllOrderItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderItemsById(@PathVariable int id) {
        return ResponseEntity.ok(orderItemsService.getOrderItemsById(id));
    }

    @PostMapping
    public ResponseEntity<?> addOrderItems(@RequestBody OrderItems orderItems) {
        return ResponseEntity.ok(orderItemsService.addOrderItems(orderItems));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrderItems(@PathVariable int id, @RequestBody OrderItems orderItems) {
        try {
            OrderItems updatedOrderItems = orderItemsService.updateOrderItems(id, orderItems);

            if (updatedOrderItems != null) {
                return ResponseEntity.ok(updatedOrderItems);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating orderItems: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrderItems(@PathVariable int id) {
        try {
            orderItemsService.deleteOrderItems(id);
            return ResponseEntity.ok("OrderItems deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting orderItems: " + e.getMessage());
        }
    }
}