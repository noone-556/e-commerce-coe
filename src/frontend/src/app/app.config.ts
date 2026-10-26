import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// appConfig = the app-wide settings, read once when the app starts (see main.ts).
//
// "providers" is a list of tools we register here, so that any component or service can ask
// for them later with inject(...). Same idea as Spring creating beans for dependency injection.
export const appConfig: ApplicationConfig = {
  providers: [
    // Catches errors that nobody handled and reports them to Angular, which prints them in the console
    provideBrowserGlobalErrorListeners(),
    // Turns on page navigation, using the "URL -> page" list in app.routes.ts
    provideRouter(routes),
    // Turns on HttpClient, so our services can call the backend.
    // (withFetch() is deprecated: in this Angular version HttpClient already uses the browser's fetch by default.)
    provideHttpClient()
  ]
};
