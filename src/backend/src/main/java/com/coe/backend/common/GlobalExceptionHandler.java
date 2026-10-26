package com.coe.backend.common;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.core.PropertyReferenceException;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * The SAFETY NET around every controller. When any code throws an error, it lands here
 * and is turned into the same JSON shape (ProblemDetail, an official web standard RFC 9457):
 *
 *   { "type": "about:blank", "title": "Not Found", "status": 404,
 *     "detail": "Product with id 99 not found", "instance": "/api/products/99" }
 *
 * The user never sees a Java stack trace.
 *
 * Extending ResponseEntityExceptionHandler makes Spring's own errors (unknown URL,
 * wrong HTTP method, broken JSON...) use the same shape too.
 */
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // Thing doesn't exist -> 404
    @ExceptionHandler(NotFoundException.class)
    ProblemDetail handleNotFound(NotFoundException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    // Client's mistake -> 400. PropertyReferenceException = sorting by a field that
    // doesn't exist, e.g. ?sort=banana
    @ExceptionHandler({BadRequestException.class, PropertyReferenceException.class})
    ProblemDetail handleBadRequest(RuntimeException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    // The database refused the change because a constraint was broken
    // (e.g. duplicate unique value, or deleting a row others still point to) -> 409 Conflict
    @ExceptionHandler(DataIntegrityViolationException.class)
    ProblemDetail handleConflict(DataIntegrityViolationException ex) {
        log.warn("Data integrity violation", ex);
        return ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, "The request conflicts with existing data.");
    }

    // Anything we didn't expect -> 500. Log the full error for US to debug,
    // but show the user only a polite message.
    @ExceptionHandler(Exception.class)
    ProblemDetail handleUnexpected(Exception ex) {
        log.error("Unexpected error", ex);
        return ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, "Something went wrong on our side.");
    }

    // @Valid failed (e.g. empty title). Spring already returns 400; we add an "errors" map
    // so the frontend knows which field is wrong:  "errors": { "title": "must not be blank" }
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        Map<String, String> errors = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> errors.putIfAbsent(error.getField(), error.getDefaultMessage()));

        ProblemDetail body = ex.getBody();
        body.setDetail("Some fields are invalid.");
        body.setProperty("errors", errors);
        return handleExceptionInternal(ex, body, headers, status, request);
    }
}