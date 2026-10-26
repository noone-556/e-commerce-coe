package com.coe.backend.catalog.controller;

import com.coe.backend.catalog.dto.CategoryResponse;
import com.coe.backend.catalog.repository.CategoryRepository;

import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * CONTROLLER = the "waiter". It receives HTTP requests from the frontend and sends back JSON.
 *
 * This one handles the book genres (Comedy, Horror, Fiction, History, Kids).
 *   GET /api/categories  -> list of all genres
 *
 * It talks to the repository directly (no service) because there are no business rules here,
 * it only reads data.
 */
@RestController                      // "This class answers HTTP requests and returns JSON"
@RequestMapping("/api/categories")   // every URL in this class starts with /api/categories

public class CategoryController {

    private final CategoryRepository categories;

    // Spring creates the repository and passes it in here for us (dependency injection)
    public CategoryController(CategoryRepository categories) {
        this.categories = categories;
    }

    // GET /api/categories -> load all genres ordered by id, turn each entity into a DTO, return the list
    @GetMapping
    public List <CategoryResponse> list() {
        return categories.findAll(Sort.by("id")).stream().map(CategoryResponse::from).toList();
    }
}
