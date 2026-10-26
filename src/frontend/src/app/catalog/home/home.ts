import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { BookCard } from '../book-card/book-card';
import { CatalogApi } from '../catalog-api';
import { DEFAULT_QUERY } from '../catalog.models';
import { genreLook } from '../genres';

/**
 * HOME PAGE   (URL: /)
 * Shows: a welcome banner, the 5 genre cards, and the 4 newest books.
 *
 * This page only needs to load its data ONCE, when it opens. So it uses toSignal()
 * (explained below) instead of calling .subscribe() by hand.
 */
@Component({
  imports: [RouterLink, BookCard],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {
  // Ask Angular for the shared CatalogApi service (our messenger to the backend)
  private readonly api = inject(CatalogApi);

  // Make the genreLook function usable in home.html
  // (a template can only use what its class exposes)
  protected readonly genreLook = genreLook;

  // Turns a genre picture into a CSS background: a dark fade (stronger at the bottom) on top
  // of the picture, so the white text on the card stays easy to read.
  // Returns null when there is no picture, so the card just keeps its plain colour.
  protected cardImage(image: string | null): string | null {
    return image ? `linear-gradient(to top, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.1)), url('${image}')` : null;
  }

  // The 5 genres, for the genre cards.
  //
  // toSignal(observable, { initialValue: [] }) does these jobs for us:
  //   1. It subscribes straight away, so the GET /api/categories request is sent.
  //   2. It starts with an empty list [], so the page can be drawn before the reply arrives.
  //   3. When the reply arrives, it puts it in the signal, and the screen redraws with the genres.
  //   4. It stops listening by itself when you leave the page.
  //
  // .pipe(...) = attach extra steps that work on the reply before it reaches us.
  // catchError(() => of([])) = "if the request FAILS (for example, the backend is off), use an empty list instead".
  //   of([]) makes a tiny Observable that just gives back []. Without catchError, the error would break this page.
  protected readonly categories = toSignal(
    this.api.listCategories().pipe(catchError(() => of([]))),
    {initialValue: [] },
  );

  // The 4 newest books, for "Fresh on the shelf".
  // { ...DEFAULT_QUERY, size: 4 } = copy all the default options, but change size to 4.
  //   (DEFAULT_QUERY already sorts newest first.)
  // map((page) => page.content) = the backend sends a whole page object
  //   { content: [...], page, size, totalElements, totalPages }, and we only want the list of books inside it.
  protected readonly newest = toSignal(
    this.api.listBooks({ ...DEFAULT_QUERY, size: 4 }).pipe(
      map((page) => page.content),
      catchError(() => of([])),
    ),
    {initialValue: [] },
  );
}
