package com.football.RomanianFootballBackend.DTO;

import java.math.BigDecimal;

public class ProductDTO {
    private Integer id;
    private String name;
    private String description;
    private BigDecimal price;
    private String team;
    private String photoUrl;
    private Boolean licenced;

    // Constructors, getters, and setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getTeam() {
        return team;
    }

    public void setTeam(String team) {
        this.team = team;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public Boolean getLicenced() {
        return licenced;
    }

    public void setLicenced(Boolean licenced) {
        this.licenced = licenced;
    }
}