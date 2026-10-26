import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Book, BookQuery, BookRequest, Category, Page} from './catalog.models';

/**
 * CatalogApi = the frontend's MESSENGER to the backend.
 * It is a SERVICE: a class that does a job for components (it has no HTML of its own).
 * It is the ONLY file that knows the backend URLs, so if a URL changes, we fix it in one place.
 *
 * @Injectable({ providedIn: 'root' }) = Angular creates ONE CatalogApi for the whole app,
 * and hands that same one to every component that asks with inject(CatalogApi).
 *
 * The URLs start with /api. During development, proxy.conf.json forwards them to Spring Boot (port 8080).
 *
 * ------------------------------------------------------------------------------------------
 * WHAT IS AN OBSERVABLE?  (you will see this everywhere)
 * ------------------------------------------------------------------------------------------
 * Every method below returns an "Observable". Think of it as an ORDER FORM for a parcel:
 *
 *   1. Calling listBooks(...) only FILLS IN the form. NOTHING is sent to the server yet.
 *   2. Calling .subscribe(...) on it SENDS the order: now the request goes to the backend.
 *   3. When the reply arrives, the function you gave to .subscribe() runs with the data.
 *   4. With HttpClient, one request gives one reply, and then the Observable is finished.
 *
 * Why not just "return the books"? Because the network takes time. The reply arrives LATER,
 * so instead we hand over a function that should run WHEN the data arrives.
 *
 * Some pages call .subscribe() themselves. Others use toSignal(), which subscribes for them.
 * ------------------------------------------------------------------------------------------
 */
@Injectable({ providedIn: 'root'})
export class CatalogApi {
    // inject(HttpClient) = "Angular, please give me the HttpClient tool".
    // It exists because app.config.ts registered it with provideHttpClient().
    private readonly http = inject(HttpClient);

    // GET /api/categories -> the 5 genres.
    // <Category[]> tells TypeScript "the reply is a list of Category" (TypeScript trusts us; nothing checks it at runtime).
    listCategories() {
        return this.http.get<Category[]>('/api/categories');
    }

    // GET /api/products?page=0&size=12&sort=createdAt,desc&category=horror&search=king
    // HttpParams builds the ?... part of the URL safely (it also encodes spaces and special characters).
    // .set(...) does not change the old HttpParams: it returns a NEW one. That's why we write
    // "params = params.set(...)" to keep the result.
    // category and search are only added when they are not empty, so the URL stays clean.
    listBooks(query: BookQuery) {
        let params = new HttpParams()
        .set('page', query.page)
        .set('size', query.size)
        .set('sort', query.sort);

        if(query.category) params = params.set('category', query.category);
        if(query.search) params = params.set('search', query.search);
        // { params } is short for { params: params }
        return this.http.get<Page<Book>>('/api/products', { params });

    }

    // GET /api/products/5
    // The backticks ` ` make a "template string": ${id} puts the value of id inside the text.
    getBook(id: number) {
        return this.http.get<Book>(`/api/products/${id}`);
    }

    // POST /api/products with the book as the body. Angular turns the object into JSON for us.
    // The backend replies 201 Created with the saved book, including its new id.
    createBook(book:BookRequest) {
        return this.http.post<Book>('/api/products', book);
    }

    // DELETE /api/products/5
    // <void> = we expect no data back (the backend replies 204 No Content).
    deleteBook(id: number) {
        return this.http.delete<void>(`/api/products/${id}`);
    }
}
