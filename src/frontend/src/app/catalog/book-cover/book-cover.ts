import { Component,computed, input, signal } from '@angular/core';
import { Book } from '../catalog.models';
import { genreLook } from '../genres';

/**
 * BookCover = a small reusable piece that shows a book's cover picture.
 * If the book has no picture, or the picture file can't be found, it shows the genre's emoji
 * on the genre's colour instead, so the user never sees a broken-image icon.
 * Used by BookCard (the small tiles) and BookDetail (the big book page).
 *
 * How the picture gets here: the database stores only the picture's PATH (text),
 * e.g. "/images/books/matilda.jpg". The <img> tag in book-cover.html gives that path to the browser,
 * and the browser downloads the file from src/frontend/public/images/books/.
 */
@Component({
  // The template only uses built-in syntax, so there is nothing to import
  imports: [],
  selector: 'app-book-cover',
  styleUrl: './book-cover.scss',
  templateUrl: './book-cover.html',
})
export class BookCover {
  // input = a value that the PARENT component gives to this one, like a function parameter.
  // The parent writes:  <app-book-cover [book]="someBook" />
  // .required = the parent MUST give a book, otherwise the app won't build.
  // You read an input like a signal, with brackets: this.book()
  readonly book = input.required<Book>();

  // signal = a box that holds a value.   Read it: failed()   Change it: failed.set(true)
  // When a signal changes, Angular redraws the parts of the screen that use it.
  // This one remembers "did the picture fail to load?". private = only this class uses it.
  private readonly failed = signal(false);

  // computed = a signal whose value is CALCULATED from other signals,
  // and recalculated automatically whenever those signals change.
  // src: if the picture failed -> null (show the emoji). Otherwise -> the picture path (which can also be null).
  protected readonly src = computed(() => (this.failed() ? null : this.book().imageUrl));

  // look: the emoji and colour for this book's genre (see genres.ts)
  protected readonly look = computed(() => genreLook(this.book().category.slug));

  // Runs when the browser could NOT load the picture (see (error)="onError()" in book-cover.html).
  // Setting failed to true makes src become null, so the template switches to the emoji.
  protected onError() {
    this.failed.set(true);
  }
}
