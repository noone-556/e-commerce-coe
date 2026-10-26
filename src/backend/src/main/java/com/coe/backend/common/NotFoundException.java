package com.coe.backend.common;

/**
 * Throw this when something the client asked for doesn't exist (e.g. GET /api/products/999).
 * GlobalExceptionHandler turns it into 404 Not Found.
 *
 * It lives in "common" so every feature (catalog, cart, order...) can reuse it.
 */
public class NotFoundException extends RuntimeException {
    public NotFoundException(String message) {
        super(message);
    }
}