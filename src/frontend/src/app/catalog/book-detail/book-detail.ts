import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe} from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';
import { BookCover } from '../book-cover/book-cover';
import { CatalogApi } from '../catalog-api';
import { Book } from '../catalog.models';

/**
 * BOOK DETAIL PAGE   (URL: /books/5)
 * Shows one book in full, with a Delete button.
 * It reads the id (5) from the URL, asks the backend for that book, and shows it.
 * If the request fails (e.g. the backend answers 404 because there is no such book),
 * it shows "We couldn't find that book".
 */
@Component({
  imports: [RouterLink, CurrencyPipe, BookCover],
  selector: 'app-book-detail',
  styleUrl: './book-detail.scss',
  templateUrl: './book-detail.html',
})
export class BookDetail {
  // api = messenger to the backend, route = info about the current URL, router = change pages from code
  private readonly api = inject(CatalogApi);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // The page's state:
  //   book     -> the loaded book (null = not loaded yet, or not found)
  //   notFound -> true if loading failed
  protected readonly book = signal<Book | null>(null);
  protected readonly notFound = signal(false);

  // Same "production line" idea as book-list.ts, but watching the PATH part of the URL (/books/:id).
  // We watch it instead of reading it once, so the page still works if the id in the URL changes
  // while this page is open.
  constructor() {
    this.route.paramMap
    .pipe(
      // Take ":id" out of the URL. URL values are text, so Number(...) turns "5" into 5.
      map((params) => Number(params.get('id'))),
      // Swap the id for the backend's reply (GET /api/products/5). If the id changes again
      // before the reply arrives, the old request is cancelled.
      switchMap((id) =>
        this.api.getBook(id).pipe(
            // Any failure (404 not found, or the backend is off) -> show "not found" and pass on null
            catchError(() => {
              this.notFound.set(true);
              return of(null);
            }),
        ),
      ),
      // Stop watching when the user leaves this page
      takeUntilDestroyed(),
    )
    // START the line. Each result (a book, or null) is stored in the book signal, and the screen redraws.
    .subscribe((book) => this.book.set(book));
  }


  // Called by the "Delete Book" button in book-detail.html.
  protected remove(book:Book) {
    // confirm(...) shows the browser's OK / Cancel box. It returns true for OK, false for Cancel.
    // "!" means NOT: if the user did NOT press OK, stop here.
    if(!confirm('Delete "${book.title}"? This cannot be undone.')) {
      return;
    }
    // Here we must call .subscribe() ourselves: without it, the DELETE request would never be sent.
    // We give it an object with two functions:
    //   next  -> runs when it worked (the backend replied 204): go back to the book list
    //   error -> runs when it failed: show a message box
    this.api.deleteBook(book.id).subscribe({
      next: () => this.router.navigate(['/books']),
      error:() => alert('Sorry, the book could not be deleted.'),
    });
  }
}
