package com.coe.backend.catalog.repository;

import org.springframework.data.jpa.domain.Specification;

import com.coe.backend.catalog.dto.ProductFilter;
import com.coe.backend.catalog.entity.Product;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static org.springframework.util.StringUtils.hasText;

/**
 * The search and filter RULES for books.
 *
 * Each small method below is one rule (one "WHERE" condition), like a LEGO brick.
 * from() looks at what the user asked for and snaps together ONLY those bricks with AND.
 *
 *   ?category=horror&search=king  ->  WHERE category.slug = 'horror'
 *                                     AND (lower(title) LIKE '%king%' OR lower(author) LIKE '%king%')
 *
 * Values are sent to the database as parameters, never glued into SQL text,
 * so this is safe from SQL injection.
 *
 * "final" + private constructor = this is just a toolbox of static methods, nobody creates it.
 */
public final class ProductSpecifications {

    private ProductSpecifications() {
    }

    // Builds the combined rule from the filter. If no options were given, the list is empty
    // and allOf() means "no conditions" -> all books.
    public static Specification<Product> from(ProductFilter filter) {
        List<Specification<Product>> specs = new ArrayList<>();
        if (hasText(filter.category())) specs.add(inCategory(filter.category()));
        if (hasText(filter.search())) specs.add(matchesSearch(filter.search().trim()));
        if (filter.minPrice() != null) specs.add(priceAtLeast(filter.minPrice()));
        if (filter.maxPrice() != null) specs.add(priceAtMost(filter.maxPrice()));
        if (Boolean.TRUE.equals(filter.inStock())) specs.add(inStock());
        return Specification.allOf(specs);
    }

    // root = the Product row, cb = CriteriaBuilder (the tool that builds conditions)

    // Only books whose genre slug matches, e.g. "horror"
    private static Specification<Product> inCategory(String slug) {
        return (root, query, cb) -> cb.equal(root.get("category").get("slug"), slug);
    }

    // Title OR author contains the text, ignoring upper/lower case. % means "anything here".
    private static Specification<Product> matchesSearch(String text) {
        String pattern = "%" + text.toLowerCase() + "%";

        return (root, query, cb) -> cb.or(
                cb.like(cb.lower(root.<String>get("title")), pattern),
                cb.like(cb.lower(root.<String>get("author")), pattern));
    }

    // price >= min
    private static Specification<Product> priceAtLeast(BigDecimal min) {
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.<BigDecimal>get("price"), min);
    }

    // price <= max
    private static Specification<Product> priceAtMost(BigDecimal max) {
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.<BigDecimal>get("price"), max);
    }

    // stockQuantity > 0 (at least one copy left)
    private static Specification<Product> inStock() {
        return (root, query, cb) -> cb.greaterThan(root.<Integer>get("stockQuantity"), 0);
    }
}