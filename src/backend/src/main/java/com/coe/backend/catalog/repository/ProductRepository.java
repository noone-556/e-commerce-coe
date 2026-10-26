package com.coe.backend.catalog.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.coe.backend.catalog.entity.Product;

/**
 * REPOSITORY = the "pantry keeper" for books. Spring Data writes the implementation for us.
 *
 *  - JpaRepository          -> findById(), save(), deleteById(), existsById()... for free
 *  - JpaSpecificationExecutor -> findAll(spec, pageable): run a query built from search/filter
 *                              rules (see ProductSpecifications) and return one page of results
 */
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    // Same findAll as Spring's, but also load each book's category in the SAME query.
    // Without this, 12 books = 1 query for books + 12 queries for categories (the "N+1 problem").
    @Override
    @EntityGraph (attributePaths = {"category"})
    Page<Product> findAll(Specification<Product> spec, Pageable pageable);
}
