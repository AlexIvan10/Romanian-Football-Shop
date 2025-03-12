package com.football.RomanianFootballBackend.DTO;

public class WishlistItemDTO {
    private Integer id;
    private ProductDTO product;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public ProductDTO getProduct() {
        return product;
    }

    public void setProduct(ProductDTO product) {
        this.product = product;
    }
}