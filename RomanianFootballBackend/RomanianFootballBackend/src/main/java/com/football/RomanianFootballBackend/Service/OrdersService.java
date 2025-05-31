package com.football.RomanianFootballBackend.Service;

import com.football.RomanianFootballBackend.DTO.CreateOrderDTO;
import com.football.RomanianFootballBackend.DTO.OrderDTO;
import com.football.RomanianFootballBackend.Entity.*;
import com.football.RomanianFootballBackend.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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

    public List<OrderDTO> getAllOrdersDTO() {
        List<Orders> orders = ordersRepository.findAll();
        return orders.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Orders getOrderById(int id) {
        return ordersRepository.findById(id).orElse(null);
    }

    public OrderDTO getOrderDTOById(int id) {
        Orders order = ordersRepository.findById(id).orElse(null);
        return order != null ? convertToDTO(order) : null;
    }

    private OrderDTO convertToDTO(Orders order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setUserId(order.getUser().getId());
        dto.setUserEmail(order.getUser().getEmail());

        if (order.getDiscount() != null) {
            dto.setDiscountId(order.getDiscount().getId());
            dto.setDiscountCode(order.getDiscount().getCode());
        }

        dto.setTotalPrice(order.getTotalPrice());
        dto.setStatus(order.getStatus().name());
        dto.setCity(order.getCity());
        dto.setStreet(order.getStreet());
        dto.setNumber(order.getNumber());
        dto.setPostalCode(order.getPostalCode());

        if (order.getOrderItems() != null) {
            List<OrderDTO.OrderItemResponseDTO> itemDTOs = order.getOrderItems().stream()
                    .map(item -> {
                        OrderDTO.OrderItemResponseDTO itemDTO = new OrderDTO.OrderItemResponseDTO();
                        itemDTO.setId(item.getId());
                        itemDTO.setProductId(item.getProduct().getId());
                        itemDTO.setProductName(item.getProduct().getName());
                        itemDTO.setPlayer(item.getPlayer());
                        itemDTO.setNumber(item.getNumber());
                        itemDTO.setSize(item.getSize().name());
                        itemDTO.setQuantity(item.getQuantity());
                        itemDTO.setPrice(item.getPrice());
                        return itemDTO;
                    })
                    .collect(Collectors.toList());
            dto.setOrderItems(itemDTOs);
        }

        return dto;
    }

    @Transactional
    public Orders createOrder(CreateOrderDTO createOrderDTO) {
        try {
            // Find user
            User user = userRepository.findById(createOrderDTO.getUserId())
                    .orElseThrow(() -> new EntityNotFoundException("User not found"));

            // Find cart
            Cart cart = cartRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Cart not found"));

            // Get cart items - make a copy to avoid concurrent modification
            List<CartItems> cartItems = new ArrayList<>(cartItemsRepository.findByCartId(cart.getId()));

            if (cartItems.isEmpty()) {
                throw new IllegalStateException("Cart is empty");
            }

            // Calculate subtotal from cart items
            BigDecimal subtotal = cartItems.stream()
                    .map(CartItems::getPrice)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            // Handle discount
            Discount discount = null;
            BigDecimal totalPrice = subtotal;

            if (createOrderDTO.getDiscountId() != null) {
                discount = discountRepository.findById(createOrderDTO.getDiscountId())
                        .orElseThrow(() -> new EntityNotFoundException("Discount not found"));

                if (!discount.getActive()) {
                    throw new IllegalStateException("Discount code is no longer valid");
                }

                // Apply discount
                BigDecimal discountAmount = subtotal.multiply(
                    BigDecimal.valueOf(discount.getDiscountPercentage()).divide(BigDecimal.valueOf(100))
                );
                totalPrice = subtotal.subtract(discountAmount);
            }

            // Create order
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

            // Save order first
            order = ordersRepository.save(order);

            // Create order items from cart items
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

            // Disable the coupon if it was used
            if (discount != null) {
                discount.setActive(false);
                discountRepository.save(discount);
            }

            // Now clear the cart - delete cart items by ID to avoid concurrent modification
            List<Integer> cartItemIds = cartItems.stream()
                    .map(CartItems::getId)
                    .toList();

            for (Integer cartItemId : cartItemIds) {
                cartItemsRepository.deleteById(cartItemId);
            }

            // Reset cart total
            cart.setTotalPrice(BigDecimal.ZERO);
            cartRepository.save(cart);

            // Set order items and return
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