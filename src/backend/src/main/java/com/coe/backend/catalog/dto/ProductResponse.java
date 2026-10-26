package com.coe.backend.catalog.dto;

import java.math.BigDecimal;
import java.time.Instant;

import com.coe.backend.catalog.entity.Product;

/**
 * DTO (Data Transfer Object) = the shape of the JSON we SEND to the frontend for one book.
 *
 * Why not send the Product entity directly?
 *  - We choose exactly which fields the outside world sees (e.g. updatedAt is hidden).
 *  - The database class can change without breaking the frontend.
 *  - Sending lazy-loaded entities as JSON often crashes.
 *
 * The genre is nested inside as a CategoryResponse, so the frontend gets the book and its genre together.
 */
public record ProductResponse(

        Long id,
        String title,
        String author,
        String description,
        BigDecimal price,
        int stockQuantity,
        String imageUrl,
        CategoryResponse category,
        Instant createdAt

)   {
        // Copies the fields from the database entity into this DTO
        public static ProductResponse from(Product product) {
            
            return new ProductResponse(

                product.getId(),
                product.getTitle(),
                product.getAuthor(),
                product.getDescription(),
                product.getPrice(),
                product.getStockQuantity(),
                product.getImageUrl(),
                CategoryResponse.from(product.getCategory()),
                product.getCreatedAt()
            
            );
        }
    }