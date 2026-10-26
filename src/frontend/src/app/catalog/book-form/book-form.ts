import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { CatalogApi } from '../catalog-api';

/**
 * ADD-A-BOOK PAGE   (URL: /books/new)
 * A form to create a new book. When the user clicks "Add book", it sends POST /api/products.
 * If that works, it opens the new book's page. If the backend rejects it (400 Bad Request),
 * it shows the backend's messages under the matching fields.
 *
 * It uses REACTIVE FORMS: the fields and their rules are written in TypeScript (the "form" below),
 * and the HTML only connects each input to its field with formControlName="...".
 */
@Component({
  // ReactiveFormsModule -> [formGroup], formControlName, (ngSubmit) and [ngValue] in the template
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-book-form',
  styleUrl: './book-form.scss',
  templateUrl: './book-form.html',
})
export class BookForm {
  private readonly api = inject(CatalogApi);
  private readonly router = inject(Router);
  // A helper for building forms. "NonNullable" = when the form is reset, each field goes back
  // to its STARTING value instead of becoming null.
  private readonly fb = inject(NonNullableFormBuilder);

  // The 5 genres for the "Genre" dropdown (see home.ts for how toSignal and catchError work)
  protected readonly categories = toSignal(
    this.api.listCategories().pipe(catchError(() => of([]))),
    { initialValue: [] },
  );

  // The page's state:
  //   saving       -> true while waiting for the backend (the button shows "Saving.." and is disabled,
  //                   so the user can't create the same book twice by double-clicking)
  //   generalError -> one message shown above the button
  //   serverErrors -> one message per field from the backend, e.g. { title: 'must not be blank' }
  //                   Record<string, string> = "keys are text, values are text"
  protected readonly saving = signal(false);
  protected readonly generalError = signal('');
  protected readonly serverErrors = signal<Record<string, string>>({});


  // The form: one entry per field, written as  [starting value, [rules]].
  // The rules match the backend's ProductRequest.java on purpose. The browser checks first (fast,
  // no network trip), and the backend checks again (safe: anyone could skip the browser).
  //   Validators.required     -> must not be empty
  //   Validators.maxLength(n) -> at most n characters
  //   Validators.min(0)       -> the number must be 0 or more
  // categoryId starts as null ("nothing chosen yet"), so it is made with fb.control<number | null>
  // to tell TypeScript that it can hold a number OR null.
  protected readonly form = this.fb.group ({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    author: ['', [Validators.required, Validators.maxLength(150)]],
    categoryId: this.fb.control<number | null>(null, Validators.required),
    price: [0, [Validators.required, Validators.min(0)]],
    stockQuantity: [0, [Validators.required, Validators.min(0)]],
    imageUrl: ['', Validators.maxLength(500)],
    description: ['', Validators.maxLength(2000)],
  });

  // Runs when the form is submitted: (ngSubmit)="submit()" in book-form.html
  protected submit() {
    // 1. Browser check first. If any rule fails, mark every field as "touched" so that its error
    //    message appears (errorFor below only shows errors for touched fields), and stop here.
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // 2. getRawValue() = all the field values as one object.
    //    { categoryId, imageUrl, description, ...rest } is called "destructuring":
    //    it takes these 3 fields out into their own variables, and puts all the OTHER fields
    //    (title, author, price, stockQuantity) together into "rest".
    const { categoryId, imageUrl, description, ...rest } = this.form.getRawValue();
    // 3. Show "Saving.." and clear any old error messages
    this.saving.set(true);
    this.generalError.set('');
    this.serverErrors.set({});

    // 4. Build the request and send it.
    //      ...rest          -> copy title, author, price and stockQuantity
    //      categoryId!      -> the "!" tells TypeScript "this is not null" (safe: the required rule already checked it)
    //      .trim() || null  -> remove spaces at both ends; if nothing is left, send null ("no picture" / "no description")
    this.api
      .createBook({
        ...rest,
        categoryId: categoryId!,
        imageUrl: imageUrl.trim() || null,
        description: description.trim() || null,
      })
      // 5. .subscribe() SENDS the request (nothing is sent without it).
      //      next  -> it worked: open the new book's page, /books/<new id>
      //      error -> it failed: stop "Saving..", and show the messages.
      //               error.error = the JSON body the backend sent back (the ProblemDetail from GlobalExceptionHandler).
      //               ?.  = "only read this if it exists" (if the backend is off, there is no JSON body)
      //               .errors = the per-field messages, .detail = the general message
      //               ??  = if missing, use the value on the right instead
      .subscribe({
        next: (book) => this.router.navigate(['/books', book.id]),
        error: (error: HttpErrorResponse) => {
          this.saving.set(false);
          this.serverErrors.set(error.error?.errors ?? {});
          this.generalError.set(error.error?.detail ?? 'Could not save the book. Please try again.');
        },
      });
  }

  // First our own browser-side checks, then any message the backend sent back for this field.
  // Called from book-form.html for each field, e.g. errorFor('title').
  //   control.touched -> the user has clicked into the field and left it (or markAllAsTouched() was called),
  //                      so we don't shout "required!" before they have even tried
  //   control.invalid -> at least one rule failed
  //   hasError('...') -> which rule failed. The names are the error keys Angular uses for each validator:
  //                      'required', 'maxlength' (written all in lowercase) and 'min'
  // If there is no browser-side error, show the backend's message for this field, or null (no message).
  protected errorFor(field: string): string | null {

    const control = this.form.get(field);

    if ( control && control.touched && control.invalid) {
      if (control.hasError('required')) return 'This field is required.';
      if (control.hasError('maxlength')) return 'This is too long.';
      if (control.hasError('min')) return 'Must be 0 or more.';
    }

    return this.serverErrors()[field] ?? null;

  }

}
