import { Component } from '@angular/core';
import { RouterOutlet, IsActiveMatchOptions, RouterLink, RouterLinkActive } from '@angular/router';

/**
 * App = the "shell" (the frame) of the website: header, footer, and an empty space in the middle
 * where the router shows the current page. It stays on screen the whole time.
 *
 * @Component(...) is a "decorator": a label telling Angular "this class is a component".
 *   imports     -> other Angular pieces that THIS component's HTML uses:
 *                    RouterOutlet     -> <router-outlet />  (where pages appear)
 *                    RouterLink       -> routerLink="..."   (links that don't reload the website)
 *                    RouterLinkActive -> routerLinkActive="active" (highlights the current menu link)
 *   selector    -> this component's HTML tag: <app-root> (used in index.html)
 *   styleUrl    -> its CSS file (these styles only affect this component)
 *   templateUrl -> its HTML file
 */
@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {

  // The current year for the footer, e.g. 2026.
  //   protected -> the HTML template can use it, other classes can't
  //   readonly  -> it can't be replaced with something else later
  protected readonly year = new Date().getFullYear();

  // Rules for routerLinkActive (in app.html): when should a menu link be highlighted?
  // Only when the PATH matches exactly, ignoring the ?... part of the URL.
  // So "Browse" lights up on /books and on /books?category=horror, but NOT on /books/new.
  protected readonly exactPath: IsActiveMatchOptions = {
    paths: 'exact',
    queryParams: 'ignored',
    matrixParams: 'ignored',
    fragment: 'ignored',
  };
}
