package com.coe.backend.catalog.dto;

import com.coe.backend.catalog.entity.Category;

/**
 * DTO (Data Transfer Object) = the shape of the JSON we SEND to the frontend for a genre.
 *
 * Example: { "id": 2, "name": "Horror", "slug": "horror", "description": "Spine-chilling..." }
 *
 * We never send the Category entity itself, so the database class can change
 * without breaking the frontend.
 */
public record CategoryResponse(Long id, String name, String slug, String description) {

    // Copies the fields from the database entity into this DTO
    public static CategoryResponse from(Category category) {
        return new CategoryResponse(category.getId(), category.getName(),
                category.getSlug(), category.getDescription());
    }
}