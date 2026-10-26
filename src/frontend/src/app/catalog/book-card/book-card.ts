import { Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookCover } from '../book-cover/book-cover';
import { Book } from '../catalog.models';

/**
 * BookCard = one book "tile" in a grid (used on the Home page and the Book list page).
 * It shows the cover, genre, title, author, price and a stock badge. Clicking it opens the book's page.
 *
 * It does NOT load any data itself: the parent page gives it a book through the input below.
 * A component that only displays what it is given is easy to reuse anywhere.
 */
@Component({
  // RouterLink   -> [routerLink] in the template
  // CurrencyPipe -> "| currency" (formats the price)
  // BookCover    -> <app-book-cover>
  imports: [RouterLink, CurrencyPipe, BookCover],
  selector: 'app-book-card',
  styleUrl: './book-card.scss',
  templateUrl: './book-card.html',
})
export class BookCard {
  // The book to show, given by the parent:  <app-book-card [book]="book" />
  readonly book = input.required<Book>();
}
