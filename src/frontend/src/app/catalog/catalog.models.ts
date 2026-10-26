// The SHAPES of the data that our backend sends and receives (TypeScript "interfaces").
// They mirror the Java DTOs, field by field:
//   Category    <->  CategoryResponse.java
//   Book        <->  ProductResponse.java   (the shop says "book", the backend says "product")
//   BookRequest <->  ProductRequest.java
//   Page<T>     <->  PageResponse.java
//
// An interface is only a description used while you WRITE code: if you type book.titel by mistake,
// VS Code underlines it in red. Interfaces disappear when the app is built, so they do NOT check
// the real data while the app runs.
//
// "string | null" means "some text, OR nothing at all" (the database column is allowed to be empty).
// "export" means other files are allowed to import it.

// One genre, e.g. { id: 2, name: 'Horror', slug: 'horror', description: '...' }
export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
}


// One book, exactly as the backend sends it. Its genre comes inside it as a Category.
export interface Book {
    id: number;
    title: string;
    author: string;
    description: string | null;
    price: number;
    stockQuantity: number;
    imageUrl: string | null;
    category: Category;
    createdAt: string;
}

// What we SEND to the backend to create a book (POST /api/products).
// No id or createdAt: the backend creates those. The genre is sent as its id only.
export interface BookRequest {
    title: string;
    author: string;
    description: string | null;
    price: number;
    stockQuantity: number;
    imageUrl: string | null;
    categoryId: number;
}

// One PAGE of results from a list endpoint.
// <T> means "any type": Page<Book> is a page of books, and later Page<Order> could be a page of orders.
//   content       -> the items on this page
//   page          -> which page this is (the backend counts from 0)
//   size          -> how many items per page
//   totalElements -> how many items match in total, across all pages
//   totalPages    -> how many pages there are
export interface Page<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;

}

// The options for the book list: which genre, what search text, how to sort, which page, how many per page.
// catalog-api.ts turns them into the ?category=...&search=... part of the API URL.
export interface BookQuery {
    category: string;
    search: string;
    sort: string;
    page: number;
    size: number;
}

// The starting options: no genre filter, no search, newest first, the first page (0), 12 books per page.
export const DEFAULT_QUERY: BookQuery = {
    category: '',
    search: '',
    sort: 'createdAt,desc',
    page: 0,
    size: 12,
};
