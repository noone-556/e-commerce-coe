package com.coe.backend.catalog.service;

import com.coe.backend.catalog.dto.ProductFilter;
import com.coe.backend.catalog.dto.ProductRequest;
import com.coe.backend.catalog.dto.ProductResponse;
import com.coe.backend.catalog.entity.Category;
import com.coe.backend.catalog.entity.Product;
import com.coe.backend.catalog.repository.CategoryRepository;
import com.coe.backend.catalog.repository.ProductRepository;
import com.coe.backend.catalog.repository.ProductSpecifications;

import com.coe.backend.common.BadRequestException;
import com.coe.backend.common.NotFoundException;
import com.coe.backend.common.PageResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * SERVICE = the "chef". This is where the business rules for books live.
 *
 * The controller (waiter) calls these methods. The service uses the repositories (pantry)
 * to read/write data, applies the rules (e.g. "the category must exist", "404 if book is missing"),
 * and converts entities into DTOs before handing them back.
 *
 * @Transactional = "do everything in this method, or nothing at all".
 * readOnly = true on the class is the safe default; methods that write data override it
 * with a plain @Transactional.
 */
@Service
@Transactional(readOnly = true)

public class ProductService {

    private final ProductRepository products;
    private final CategoryRepository categories;



    

    // Spring passes in both repositories for us (dependency injection)
    public ProductService(ProductRepository products, CategoryRepository categories) {
        this.products = products;
        this.categories = categories;
    }

    // Turn the filter into rules -> ask the DB for one page -> convert each book to a DTO -> wrap in PageResponse
    public PageResponse<ProductResponse> list(ProductFilter filter, Pageable pageable) {
        return PageResponse.from(products.findAll(ProductSpecifications.from(filter), pageable).map(ProductResponse::from));
    }

    // One book, or a 404 error if it doesn't exist
    public ProductResponse get(Long id) {
        return ProductResponse.from(findProduct(id));
    }


    

    // Make a new empty Product, copy the request into it, save it, return it as a DTO
    @Transactional
    public ProductResponse create(ProductRequest request) {
        Product product = new Product();
        apply(request, product);
        return ProductResponse.from(products.save(product));
    }

    // Load the existing book and change its fields. No save() needed: Hibernate notices the
    // changes and writes them when the method ends ("dirty checking").
    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = findProduct(id);
        apply(request, product);
        return ProductResponse.from(product);
    }

    // 404 if the book doesn't exist, otherwise delete it
    @Transactional
    public void delete(Long id) {
        if(!products.existsById(id)) {
            throw new NotFoundException("Product with id " + id + " not found");
        }
        products.deleteById(id);
    }





    // Shared helper: find the book or throw NotFoundException (-> 404 via GlobalExceptionHandler)
    private Product findProduct(Long id) {
        return products.findById(id).orElseThrow(() -> new NotFoundException("Product with id " + id + " not found"));
    }

    // Shared by create and update, so the copying rules live in ONE place.
    // A wrong categoryId is the client's mistake -> 400 Bad Request (not 404).
    private void apply(ProductRequest request, Product product) {
        Category category = categories.findById(request.categoryId())
                .orElseThrow(() -> new BadRequestException("Category " + request.categoryId() + " does not exist"));


        product.setCategory(category);
        product.setTitle(request.title().trim());
        product.setAuthor(request.author().trim());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setStockQuantity(request.stockQuantity());
        product.setImageUrl(request.imageUrl());
    }
}

