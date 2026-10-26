package com.coe.backend.common;

import org.springframework.data.domain.Page;

import java.util.List;

/**
 * The JSON shape for ANY paginated list (books now; orders later in Milestone 3):
 *
 *   { "content": [ ...items... ], "page": 0, "size": 12, "totalElements": 25, "totalPages": 3 }
 *
 * Spring's own Page object turns into messy JSON that can change between versions.
 * This small record gives the frontend a stable, predictable shape.
 *
 * <T> means "any type": PageResponse<ProductResponse>, PageResponse<OrderResponse>, ...
 */
public record PageResponse<T>(List<T> content, int page, int size, long totalElements, int totalPages) {

    // Copies the useful bits out of Spring's Page object
    public static <T> PageResponse<T> from(Page<T> page) {
        return new PageResponse<>(page.getContent(), page.getNumber(), page.getSize(),
                page.getTotalElements(), page.getTotalPages());
    }
}
