# DietApp Frontend (Next.js)

This directory contains a Next.js 16 implementation using the App Router of the DietApp frontend. It keeps the same features as the original Vite version but benefits from Next.js optimisation and routing.

## Getting Started

```bash
npm install       # install dependencies
npm run dev       # start development server
npm run build     # create production build
npm start         # start built app
```

The app will be available on [http://localhost:3000](http://localhost:3000).

## Docker

Build and run with Docker:

```bash
docker compose up --build frontend-next
```

## Theme

Tailwind CSS with daisyUI is configured in `tailwind.config.js` with a custom `mytheme` theme. Update the colours there and ensure the `Layout` component keeps the `data-theme` attribute to apply changes.
