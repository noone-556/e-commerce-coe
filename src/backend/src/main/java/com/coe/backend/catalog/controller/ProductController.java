package com.coe.backend.catalog.controller;

import com.coe.backend.catalog.dto.ProductFilter;
import com.coe.backend.catalog.dto.ProductRequest;
import com.coe.backend.catalog.dto.ProductResponse;
import com.coe.backend.catalog.service.ProductService;

import com.coe.backend.common.PageResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;


/**
 * CONTROLLER = the "waiter" for books. It only deals with HTTP (URLs, status codes, JSON)
 * and passes the real work to ProductService (the "chef").
 *
 *   GET    /api/products        -> list books (with search, filter, sort, pagination)  200
 *   GET    /api/products/{id}   -> one book                                             200
 *   POST   /api/products        -> create a book                                        201 Created
 *   PUT    /api/products/{id}   -> update a book                                        200
 *   DELETE /api/products/{id}   -> delete a book                                        204 No Content
 *
 * The URL is a noun ("products"); the HTTP method (GET/POST/PUT/DELETE) is the verb.
 */
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService service;

    // Spring gives us the ProductService automatically (dependency injection)
    public ProductController(ProductService service) {
        this.service = service;
    }

    // Example: GET /api/products?category=horror&search=king&sort=price,asc&page=0&size=12
    //  - ProductFilter is filled from ?category, ?search, ?minPrice, ?maxPrice, ?inStock
    //  - Pageable is filled from ?page, ?size, ?sort (defaults: 12 per page, newest first)
    @GetMapping
    public PageResponse<ProductResponse> list(
        ProductFilter filter,
        @PageableDefault(size = 12, sort = "createdAt", direction = Sort.Direction.DESC)
        Pageable pageable) {
            return service.list(filter, pageable);
        }

        // GET /api/products/5 -> @PathVariable takes the "5" from the URL
        @GetMapping("/{id}")
        public ProductResponse get(@PathVariable Long id) {
            return service.get(id);
        }

        // POST /api/products with a JSON body.
        // @RequestBody turns the JSON into a ProductRequest; @Valid checks its rules (@NotBlank etc.)
        // before this method runs. Returns 201 Created + a "Location" header pointing to the new book.
        @PostMapping
        public ResponseEntity<ProductResponse> create(@Valid @RequestBody ProductRequest request) {
            ProductResponse created = service.create(request);
            return ResponseEntity.created(URI.create("/api/products/" + created.id())).body(created);
        } 

        // PUT /api/products/5 with a JSON body -> replaces the book's details
        @PutMapping("/{id}")
        public ProductResponse update(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
            return service.update(id, request);
        }

        // DELETE /api/products/5 -> returns 204 No Content (success, nothing to send back)
        @DeleteMapping("/{id}")
        @ResponseStatus(HttpStatus.NO_CONTENT)
        public void delete(@PathVariable Long id) {
            service.delete(id);
        }
     
}
