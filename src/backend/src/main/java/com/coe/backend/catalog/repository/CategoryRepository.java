package com.coe.backend.catalog.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.coe.backend.catalog.entity.Category;

/**
 * REPOSITORY = the "pantry keeper". It reads and writes Category rows in the database.
 *
 * It is empty on purpose: by extending JpaRepository<Category, Long>, Spring Data writes the
 * code for us at runtime and we get findAll(), findById(), save(), deleteById(), count()... for free.
 * <Category, Long> means "works with Category objects whose id is a Long".
 */
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
}
