# Adda Client

A modern social media client built with **React**, **Redux Toolkit**, **TypeScript**, and **Vite**. This project features authentication, posts, comments, user profiles, and more, styled with Tailwind CSS and Radix UI components.

## Features

- User authentication (register, login)
- Create, update, and delete posts (with image/video upload)
- Like/dislike and comment on posts
- User profiles with editable bio/about
- Friends and follow system
- Responsive, modern UI with Tailwind CSS
- Modular, scalable code structure

## Tech Stack

- [React](https://react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Axios](https://axios-http.com/)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- pnpm (or npm/yarn)

### Installation

1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd adda-client
   ```
2. Install dependencies:
   ```sh
   pnpm install
   # or
   npm install
   ```

### Development

Start the development server:

```sh
pnpm dev
# or
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Build

To build for production:

```sh
pnpm build
# or
npm run build
```

### Lint

To lint the codebase:

```sh
pnpm lint
# or
npm run lint
```

## Project Structure

- `src/` — Main source code
  - `components/` — Reusable UI components
  - `features/` — Redux slices and API logic
  - `hooks/` — Custom React hooks
  - `layout/` — Layout components (Navbar, Footer, etc.)
  - `model/` — TypeScript interfaces and schemas
  - `pages/` — Route pages (Home, Login, Profile, etc.)
  - `routes/` — App routing
  - `store/` — Redux store setup
  - `lib/` — Utility functions

## API

This client connects to a backend API (default: `https://adda-server-zeta.vercel.app`). You can change the API base URL in `src/lib/baseURL.ts`.

## License

MIT
