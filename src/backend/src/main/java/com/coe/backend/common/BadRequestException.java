package com.coe.backend.common;

/**
 * Throw this when the CLIENT sent something wrong that @Valid can't catch on its own
 * (e.g. a categoryId that doesn't exist). GlobalExceptionHandler turns it into 400 Bad Request.
 *
 * Extends RuntimeException so we don't have to declare it with "throws" everywhere.
 */
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}