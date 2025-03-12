package com.football.RomanianFootballBackend.Entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "wishlist")
public class Wishlist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "wishlist", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WishlistItems> wishlistItems;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<WishlistItems> getWishlistItems() {
        return wishlistItems;
    }

    public void setWishlistItems(List<WishlistItems> wishlistItems) {
        this.wishlistItems = wishlistItems;
    }
}
