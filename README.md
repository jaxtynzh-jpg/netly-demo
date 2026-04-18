# Netly Demo

Netly is a class-presentation demo for a networking decision platform. The site is intentionally frontend-only: no backend, no auth, no real AI calls, and no live event scraping.

## Stack

- Next.js 14 with the App Router
- TypeScript
- Tailwind CSS
- shadcn-style UI primitives
- Static mock data in `/data`

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build Check

```bash
npm run build
```

## Project Structure

```text
app/
  page.tsx
  events/
    page.tsx
    [id]/page.tsx
  strategy/page.tsx
  about/page.tsx
components/
data/
lib/
```

## Demo Notes

- Event filters on `/events` are visual-only for presentation purposes.
- Strategy generation on `/strategy` is a curated mock output.
- Feedback buttons on event detail pages only trigger a toast message.
