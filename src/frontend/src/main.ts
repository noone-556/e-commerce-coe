// main.ts = the "ON switch" of the whole frontend. It is the first TypeScript file the browser runs.
//
// bootstrapApplication(App, appConfig) means:
//   "Start Angular with the settings in appConfig (app.config.ts), and draw the App component."
// Angular looks in index.html for <app-root></app-root> (App's selector is 'app-root')
// and draws App there.
// If starting fails, .catch(...) prints the error in the browser console (press F12 -> Console).
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
