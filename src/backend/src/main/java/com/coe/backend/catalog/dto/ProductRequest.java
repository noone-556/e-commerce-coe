package com.coe.backend.catalog.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

/**
 * DTO = the shape of the JSON the frontend SENDS us to create (POST) or update (PUT) a book.
 *
 * The annotations are validation rules. When the controller uses @Valid, Spring checks them
 * BEFORE our code runs. If any rule fails, GlobalExceptionHandler returns a 400 with a list
 * of which fields are wrong.
 *
 * Notice there is no id / createdAt here: the client is not allowed to set those.
 */
public record ProductRequest(
        @NotBlank @Size(max = 200) String title,             // required, not just spaces, max 200 chars (same as DB column)
        @NotBlank @Size(max = 150) String author,            // required, max 150 chars
        @Size(max = 2000) String description,                // optional
        @NotNull @DecimalMin("0.00") @Digits(integer = 8, fraction = 2) BigDecimal price, // required, >= 0, max 2 decimals (fits NUMERIC(10,2))
        @NotNull @PositiveOrZero Integer stockQuantity,      // required, 0 or more
        @Size(max = 500) String imageUrl,                    // optional, e.g. "/images/books/matilda.jpg"
        @NotNull Long categoryId                             // required, which genre the book belongs to
) {
}
