package com.coe.backend.catalog.dto;

import java.math.BigDecimal;

/**
 * DTO holding the search/filter options the user typed in the URL.
 * Spring fills it automatically from the query string, matching names exactly:
 *
 *   /api/products?category=kids&search=dahl&minPrice=10&maxPrice=30&inStock=true
 *
 * Any option not in the URL is simply null, which means "don't filter by this".
 * ProductSpecifications turns these options into database conditions.
 */
public record ProductFilter(String category, String search, BigDecimal minPrice,
                            BigDecimal maxPrice, Boolean inStock) {
}