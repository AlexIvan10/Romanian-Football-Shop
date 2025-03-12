package com.football.RomanianFootballBackend.Service;

import com.football.RomanianFootballBackend.Entity.OrderItems;
import com.football.RomanianFootballBackend.Repository.OrderItemsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderItemsService {

    @Autowired
    private OrderItemsRepository orderItemsRepository;

    public List<OrderItems> getAllOrderItems() {
        return orderItemsRepository.findAll();
    }

    public OrderItems getOrderItemsById(int id) {
        return orderItemsRepository.findById(id).orElse(null);
    }

    public OrderItems addOrderItems(OrderItems orderItems) {
        return orderItemsRepository.save(orderItems);
    }

    public OrderItems updateOrderItems(int id, OrderItems updatedOrderItems) {
        return orderItemsRepository.findById(id)
                .map(existingOrderItems -> {
                    if (updatedOrderItems.getOrders() != null) {
                        existingOrderItems.setOrders(updatedOrderItems.getOrders());
                    }
                    if (updatedOrderItems.getProduct() != null) {
                        existingOrderItems.setProduct(updatedOrderItems.getProduct());
                    }
                    if (updatedOrderItems.getPlayer() != null) {
                        existingOrderItems.setPlayer(updatedOrderItems.getPlayer());
                    }
                    if (updatedOrderItems.getNumber() != null) {
                        existingOrderItems.setNumber(updatedOrderItems.getNumber());
                    }
                    if (updatedOrderItems.getQuantity() != null) {
                        existingOrderItems.setQuantity(updatedOrderItems.getQuantity());
                    }
                    if (updatedOrderItems.getPrice() != null) {
                        existingOrderItems.setPrice(updatedOrderItems.getPrice());
                    }

                    return orderItemsRepository.save(existingOrderItems);
                })
                .orElse(null);
    }

    public void deleteOrderItems(int id) {
        orderItemsRepository.deleteById(id);
    }
}