import { Routes } from '@angular/router';

// The "map" of the website: which page (component) to show for which URL.
// The router checks these from TOP to BOTTOM and uses the FIRST one that matches.
//
//   path          -> the part of the URL after the domain ('' = the home page)
//   title         -> the text shown on the browser tab
//   loadComponent -> "lazy loading": a page's code is only downloaded the FIRST time someone
//                    visits it, so the website opens faster.
//                    import('...') loads the file, then .then((m) => m.Home) picks the Home class out of it.
export const routes: Routes = [
  // Home page: http://localhost:4200/
  {
    path: '',
    title: 'Bookworm Corner',
    loadComponent: () => import('./catalog/home/home').then((m) => m.Home),
  },
  // List of books: /books  (also /books?category=horror&search=king ... the ?... part is read by the page)
  {
    path: 'books',
    title: 'Browse books',
    loadComponent: () => import('./catalog/book-list/book-list').then((m) => m.BookList),
  },
  // Add-a-book form: /books/new
  // It MUST come before 'books/:id', otherwise the router would think "new" is a book id.
  {
    path: 'books/new',
    title: 'Add a book',
    loadComponent: () => import('./catalog/book-form/book-form').then((m) => m.BookForm),
  },
  // One book: /books/5   (":id" is a placeholder; the page reads the 5 from the URL)
  {
    path: 'books/:id',
    title: 'Book details',
    loadComponent: () => import('./catalog/book-detail/book-detail').then((m) => m.BookDetail),
  },
  // Any other URL (a typo, an old link) -> send the visitor back to the home page
  { path: '**', redirectTo: '' },
];
