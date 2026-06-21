# StayOS — Frontend Demo

A comprehensive multi-portal frontend demo for StayOS, the property management operating system for South African hospitality.

## Pages

| File | Description |
|------|-------------|
| `index.html` | Marketing landing page — platform overview, features, pricing |
| `property.html` | Property management dashboard — rooms, bookings, housekeeping, maintenance |
| `agency.html` | Agency portfolio dashboard — multi-property analytics, staff, billing |
| `customer.html` | Customer & student portal — stays, loyalty, NSFAS invoices, POPIA rights |

## Deploy to GitHub Pages

1. Create a new GitHub repository
2. Upload all files (maintaining the folder structure)
3. Go to **Settings → Pages**
4. Set source to **Deploy from a branch** → **main** → **/ (root)**
5. Your demo will be live at `https://yourusername.github.io/repo-name/`

## Local Development

Open any HTML file directly in your browser, or serve with any static server:

```bash
# Python
python3 -m http.server 3000

# Node.js (npx)
npx serve .

# VS Code — Live Server extension
```

## Tech Stack

- **HTML5** — semantic markup, viewport-fit=cover for Android
- **CSS3** — CSS custom properties, Grid, Flexbox, clamp(), dvh, safe-area-inset
- **Vanilla JavaScript** — no dependencies, fetch API for JSON data
- **Google Fonts** — Cormorant Garamond + Manrope + JetBrains Mono

## Design System

- **Display type:** Cormorant Garamond (editorial serif)
- **UI type:** Manrope (geometric sans)
- **Data/numbers:** JetBrains Mono
- **Accent:** #C84B28 (terracotta)
- **Dark:** #0D0C0B (near-black)
- **Light bg:** #F0EDE6 (warm parchment)

## Data

All data is loaded from `data/seed.json` — the same entities defined in the StayOS architecture spec:
- 2 properties (boutique hotel + student housing)
- 10 rooms with varied statuses
- 6 bookings across all lifecycle states
- Housekeeping tasks, maintenance work orders
- Customer loyalty account with transaction history
- Student data with NSFAS invoices and lease

*LekkerQ (Pty) Ltd — Confidential*
