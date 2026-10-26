import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { BookCard } from '../book-card/book-card';
import { CatalogApi } from '../catalog-api';
import { Book, BookQuery, DEFAULT_QUERY, Page } from '../catalog.models';
import { genreLook } from '../genres';

// The choices in the "Sort by" menu.
//   value -> what we send to the backend as ?sort=  ("field,direction": asc = A->Z / low->high, desc = the opposite)
//   label -> what the user sees
const SORT_OPTIONS = [
  {value: 'createdAt,desc', label: 'Newest first'},
  {value: 'title,asc', label: 'Title A-Z'},
  {value: 'price,asc', label: 'Price: Low to High'},
  {value: 'price,desc', label: 'Price: High to Low'},

];

/**
 * BOOK LIST PAGE   (URL: /books, e.g. /books?category=horror&search=king&sort=price,asc&page=1)
 * Shows: a search box, the sort menu, genre buttons, the books, and Previous/Next page buttons.
 *
 * BIG IDEA: the URL is the "single source of truth".
 * When the user picks a genre, searches, sorts or changes page, we do NOT load books directly.
 * We only CHANGE THE URL. The constructor below watches the URL and loads whatever the URL says.
 * Bonus: links can be shared, the browser's Back button works, and refreshing keeps your filters.
 *
 *   user clicks "Horror" -> chooseCategory('horror') -> URL becomes /books?category=horror
 *   -> the URL watcher notices -> GET /api/products?...&category=horror -> the books appear
 */
@Component({
  imports: [BookCard],
  selector: 'app-book-list',
  styleUrl: './book-list.scss',
  templateUrl: './book-list.html',
})
export class BookList {
  // Tools we ask Angular for:
  //   api    -> our messenger to the backend (catalog-api.ts)
  //   route  -> information about the CURRENT URL (we read the ?... part from it)
  //   router -> lets us CHANGE the URL from code
  private readonly api = inject(CatalogApi);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // Make these usable in book-list.html
  protected readonly sortOptions = SORT_OPTIONS;
  protected readonly genreLook = genreLook;

  // The 5 genres for the genre buttons. Loaded once (see home.ts for how toSignal and catchError work).
  protected readonly categories = toSignal(
    this.api.listCategories().pipe(catchError(() => of([]))),
    {initialValue: [] },
  );

  // The page's STATE, kept in signals so the screen redraws whenever they change:
  //   query   -> the current genre / search / sort / page (read from the URL)
  //   result  -> the last page of books from the backend (null = nothing yet)
  //   loading -> true while waiting for the backend (shows "Loading Books...")
  //   failed  -> true if the request failed (shows the error message)
  protected readonly query = signal<BookQuery>(DEFAULT_QUERY);
  protected readonly result = signal<Page<Book> | null>(null);
  protected readonly loading = signal(true);
  protected readonly failed = signal(false);

  // The page title: the chosen genre's name, or 'All Books' when no genre is chosen.
  //   .find(...)    -> look for the genre whose slug matches the one in the URL
  //   ?.name        -> read its name only if one was found (otherwise the result is undefined)
  //   ?? 'All Books' -> use 'All Books' when nothing was found
  // It is "computed", so it updates by itself when query or categories change.
  protected readonly heading = computed(() => {
    const slug = this.query().category;
    return this.categories().find((category) => category.slug === slug)?.name ?? 'All Books';
  });

  // The constructor runs ONCE, when the page is created. Here it sets up a "watcher" on the URL.
  //
  // this.route.queryParamMap is an Observable of the ?... part of the URL. It gives a value
  // once straight away, and then again EVERY time that part of the URL changes.
  // Each value travels through the steps inside .pipe(...) from top to bottom, like a production line.
  constructor() {
    this.route.queryParamMap.pipe(
      // Step 1 - map: turn the raw URL values into a BookQuery object (see readQuery at the bottom of this file)
      map(readQuery),
      // Step 2 - tap: do some side jobs WITHOUT changing the value that passes through:
      //          remember the query, show "Loading Books...", and hide any old error message
      tap((query) => {
        this.query.set(query);
        this.loading.set(true);
        this.failed.set(false);
      }),
      // Step 3 - switchMap: SWAP the query for the backend's reply (this sends GET /api/products?...).
      //          "switch" = if the URL changes again before the reply arrives, CANCEL the old request
      //          and keep only the newest one, so a slow old reply can never overwrite newer results.
      switchMap((query) =>
      this.api.listBooks(query).pipe(
        // If THIS request fails: show the error message, and pass on null instead of a page.
        // It sits INSIDE switchMap on purpose: only this one request is affected, and the URL
        // watcher keeps working, so the user's next search still works.
        catchError(() => {
          this.failed.set(true);
          return of(null);
        }),
      ),
    ),
    // Step 4 - takeUntilDestroyed: stop watching when the user leaves this page.
    //          Otherwise the watcher would keep running in the background (a "memory leak").
    takeUntilDestroyed(),
    )
    // Step 5 - subscribe: START the production line. NOTHING above runs until .subscribe() is called.
    //          The function we give it receives each final result: store it, and hide "Loading Books...".
    .subscribe((result) => {
      this.result.set(result);
      this.loading.set(false);
    });
  }

  // The four methods below are called from book-list.html. They ONLY change the URL.
  // The watcher in the constructor then loads the books.

  // Search form submitted. trim() removes spaces at both ends.
  // "|| null": an empty search becomes null, which REMOVES ?search= from the URL.
  protected search(text: string) {
    this.updateUrl({ search: text.trim() || null});
  }

  // Genre button clicked. null (the "All" button) removes ?category= from the URL.
  protected chooseCategory(slug: string | null) {
    this.updateUrl({ category: slug});
  }

  // A new option picked in the "Sort by" menu
  protected chooseSort(sort: string) {
    this.updateUrl({ sort });
  }

  // Previous / Next clicked
  protected goToPage(page: number) {
    this.updateUrl({ page })
  }

  // Changing the URL is enough: queryParamMap above notices and reloads the books.
  // "page: null" first means "go back to page 1" unless we are changing the page itself.
  //   navigate([], { relativeTo: this.route }) -> stay on this same page, only change the ?... part
  //   queryParamsHandling: 'merge'            -> KEEP the other values already in the URL
  //                                              (e.g. keep ?category=horror while changing the sort)
  //   a value of null                         -> REMOVE that key from the URL
  //   { page: null, ...params }               -> ...params is written second, so if params contains
  //                                              a page, it replaces the null
  private updateUrl(params: Params) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: null, ...params},
      queryParamsHandling: 'merge',
    });
  }
}

// Turns the URL values into a BookQuery.
// URL values are always text, or null when they are missing from the URL.
//   ...DEFAULT_QUERY -> start from the default options (this is where size: 12 comes from)
//   ?? ''            -> if the value is missing, use empty text
//   Number(...)      -> turn the text "2" into the number 2
// It is a plain function outside the class, because it doesn't need anything from the class.
function readQuery(params:ParamMap): BookQuery {
  return {
    ...DEFAULT_QUERY,
    category: params.get('category') ?? '',
    search: params.get('search') ?? '',
    sort: params.get('sort') ?? DEFAULT_QUERY.sort,
    page: Number(params.get('page') ?? 0),
  };
}
