package com.football.RomanianFootballBackend.Controller;

import com.football.RomanianFootballBackend.DTO.CreateOrderDTO;
import com.football.RomanianFootballBackend.DTO.OrderDTO;
import com.football.RomanianFootballBackend.Entity.Orders;
import com.football.RomanianFootballBackend.Service.OrdersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class OrdersController {
    @Autowired
    private OrdersService ordersService;

    @GetMapping
    public ResponseEntity<?> getAllOrders() {
        try {
            List<OrderDTO> orders = ordersService.getAllOrdersDTO();
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching orders: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable int id) {
        try {
            OrderDTO order = ordersService.getOrderDTOById(id);
            if (order != null) {
                return ResponseEntity.ok(order);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching order: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderDTO createOrderDTO) {
        try {
            Orders newOrder = ordersService.createOrder(createOrderDTO);
            return ResponseEntity.ok(newOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating order: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrder(@PathVariable int id, @RequestBody Orders order) {
        try {
            Orders updatedOrder = ordersService.updateOrder(id, order);
            if (updatedOrder != null) {
                return ResponseEntity.ok(updatedOrder);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating order: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable int id) {
        try {
            ordersService.deleteOrder(id);
            return ResponseEntity.ok("Order deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting order: " + e.getMessage());
        }
    }
}