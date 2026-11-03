# Frontend (Angular)

The bookshop website: home page with 5 genres, book list with search/filter/sort/pagination,
book detail page, and an "Add a book" form. Angular 22, standalone components, signals.

## Run locally
The backend must be running on port 8080. In this folder:
```
npm install
ng serve
```
Open http://localhost:4200. `proxy.conf.json` forwards `/api/...` to http://localhost:8080.

## Structure
```
src/app/
├── app.*              the shell: header, footer, <router-outlet>
├── app.routes.ts      URL → page
└── catalog/
    ├── catalog-api.ts       the only file that calls the backend
    ├── catalog.models.ts    JSON shapes (mirror the backend DTOs)
    ├── genres.ts            emoji, colour and picture for each genre
    ├── home/ book-list/ book-detail/ book-form/   pages
    └── book-card/ book-cover/                     reusable pieces
```

## Pictures
Book covers live in `public/images/books/`. The database stores only the path, e.g. `/images/books/matilda.jpg`.
(In Milestone 2 they move to object storage.)

## Other commands
- `ng build`: production build into `dist/frontend/browser`
- `ng test`: unit tests (Vitest)

## Docker
`Dockerfile` builds the app with Node, then serves `dist/frontend/browser` with nginx.
`nginx.conf` forwards `/api/` to the `backend` container, and sends `index.html` for Angular pages like `/books/5`.