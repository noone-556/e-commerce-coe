package com.coe.backend.catalog.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * ENTITY = a Java class that mirrors the "products" table (created in V2__create_catalog.sql).
 * One Product object = one book row in the database.
 *
 * Setters exist for the fields our app is allowed to change.
 * id, createdAt and updatedAt have NO setters because the database/Hibernate fill them in.
 */
@Entity
@Table (name = "products")
public class Product {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;

    // Many books belong to one genre -> this is the foreign key "category_id" in Java form.
    // LAZY = don't load the category from the database until someone actually uses it.
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(nullable = false, length = 200)
    private String title;

    @Column (nullable = false, length = 150)
    private String author;

    @Column(columnDefinition = "TEXT")
    private String description;

    // BigDecimal, never double, for money: double can't store 0.10 exactly
    @Column (nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    // How many copies we have left (inventory tracking)
    @Column(name="stock_quantity", nullable = false)
    private Integer stockQuantity;

    // Path to the cover picture, e.g. "/images/books/matilda.jpg" (served by Angular's public/ folder)
    @Column(name="image_url", length = 500)
    private String imageUrl;

    // Hibernate sets this automatically when the book is first saved; it never changes after
    @CreationTimestamp
    @Column(name = "created_at", nullable=false, updatable = false)
    private Instant createdAt;

    // Hibernate updates this automatically every time the book is changed
    @UpdateTimestamp
    @Column(name = "updated_at", nullable=false)
    private Instant updatedAt;


    // Getters and Setters
    public Long getId() {
        return id;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
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

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
    

}
