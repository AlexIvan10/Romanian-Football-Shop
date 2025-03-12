package com.football.RomanianFootballBackend.Service;

import com.football.RomanianFootballBackend.DTO.CreateOrderDTO;
import com.football.RomanianFootballBackend.Entity.*;
import com.football.RomanianFootballBackend.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrdersService {

    @Autowired
    private OrdersRepository ordersRepository;

    @Autowired
    private CartItemsRepository cartItemsRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderItemsRepository orderItemsRepository;

    @Autowired
    private DiscountRepository discountRepository;

    @Autowired
    private OrderItemsService orderItemsService;

    public List<Orders> getAllOrders() {
        return ordersRepository.findAll();
    }

    public Orders getOrderById(int id) {
        return ordersRepository.findById(id).orElse(null);
    }

    @Transactional
    public Orders createOrder(CreateOrderDTO createOrderDTO) {
        try {
            User user = userRepository.findById(createOrderDTO.getUserId())
                    .orElseThrow(() -> new EntityNotFoundException("User not found"));

            Cart cart = cartRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Cart not found"));

            List<CartItems> cartItems = cartItemsRepository.findByCartId(cart.getId());

            Discount discount = null;
            BigDecimal totalPrice = cart.getTotalPrice();

            if (createOrderDTO.getDiscountId() != null) {
                discount = discountRepository.findById(createOrderDTO.getDiscountId())
                        .orElseThrow(() -> new EntityNotFoundException("Discount not found"));

                if (!discount.getActive()) {
                    throw new IllegalStateException("Discount code is no longer valid");
                }

                BigDecimal discountMultiplier = BigDecimal.ONE.subtract(
                        BigDecimal.valueOf(discount.getDiscountPercentage()).divide(BigDecimal.valueOf(100))
                );
                totalPrice = totalPrice.multiply(discountMultiplier);
            }

            Orders order = new Orders();
            order.setUser(user);
            order.setStatus(Orders.OrderStatus.PENDING);
            order.setTotalPrice(totalPrice);
            order.setCity(createOrderDTO.getCity());
            order.setStreet(createOrderDTO.getStreet());
            order.setNumber(createOrderDTO.getNumber());
            order.setPostalCode(createOrderDTO.getPostalCode());
            if (discount != null) {
                order.setDiscount(discount);
            }

            order = ordersRepository.save(order);

            List<OrderItems> orderItems = new ArrayList<>();
            for (CartItems cartItem : cartItems) {
                OrderItems orderItem = new OrderItems();
                orderItem.setOrders(order);
                orderItem.setProduct(cartItem.getProduct());
                orderItem.setQuantity(cartItem.getQuantity());
                orderItem.setSize(cartItem.getSize());
                orderItem.setPlayer(cartItem.getPlayer());
                orderItem.setNumber(cartItem.getNumber());
                orderItem.setPrice(cartItem.getPrice());
                orderItems.add(orderItemsRepository.save(orderItem));
            }

            for (CartItems item : cartItems) {
                cartItemsRepository.delete(item);
            }

            cart.setTotalPrice(BigDecimal.ZERO);
            cartRepository.save(cart);

            order.setOrderItems(orderItems);
            return order;

        } catch (Exception e) {
            throw new RuntimeException("Error creating order: " + e.getMessage(), e);
        }
    }

    public Orders updateOrder(int id, Orders updatedOrder) {
        return ordersRepository.findById(id)
                .map(existingOrder -> {
                    if (updatedOrder.getStatus() != null) {
                        existingOrder.setStatus(updatedOrder.getStatus());
                    }
                    if (updatedOrder.getCity() != null) {
                        existingOrder.setCity(updatedOrder.getCity());
                    }
                    if (updatedOrder.getStreet() != null) {
                        existingOrder.setStreet(updatedOrder.getStreet());
                    }
                    if (updatedOrder.getNumber() != null) {
                        existingOrder.setNumber(updatedOrder.getNumber());
                    }
                    if (updatedOrder.getPostalCode() != null) {
                        existingOrder.setPostalCode(updatedOrder.getPostalCode());
                    }
                    return ordersRepository.save(existingOrder);
                })
                .orElse(null);
    }

    public void deleteOrder(int id) {
        ordersRepository.deleteById(id);
    }
}