package com.coe.backend.catalog.entity;

import jakarta.persistence.*;

/**
 * ENTITY = a Java class that mirrors one database table. One object = one row.
 *
 * This one mirrors the "categories" table (created in V2__create_catalog.sql).
 * Our 5 genres are inserted by V3__seed_books.sql.
 *
 * Because application.properties has ddl-auto=validate, Hibernate checks on startup
 * that these fields match the real table, and refuses to start if they don't.
 *
 * Only getters, no setters: genres are read-only in our app for now.
 */
@Entity                        // "This class is stored in the database"
@Table(name = "categories")    // ...in the table called "categories"
public class Category {

    @Id                                                   // primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)   // PostgreSQL generates the number
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    // URL-friendly name, e.g. "horror". Used in /api/products?category=horror
    @Column(nullable = false, unique = true, length = 50)
    private String slug;

    private String description;

    // JPA needs an empty constructor to build objects from database rows.
    // "protected" stops our own code from creating empty categories by accident.
    protected Category() {

    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSlug() {
        return slug;
    }

    public String getDescription() {
        return description;
    }
}