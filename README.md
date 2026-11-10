# OpenWorld Travel — Client Preview v5 (Global Destinations)

## What changed
- Currency converter repositioned near the bottom, directly before the footer.
- New globally oriented globe/logo featuring multiple continents.
- Eleven international destinations added: Cape Town, Kruger, Paris, Rome/Amalfi, Swiss Alps, Barcelona, Greece, Dubai, Bali, Maldives and Japan.
- Eleven corresponding enquiry-based sample journeys and new filters for South Africa, Europe, and Asia & Islands.
- Local SVG destination fallbacks bundled for new imagery. Existing African illustration fallbacks retained.

## Run locally
Open `index.html` using VS Code Live Server or a static file server. Keep `assets/`, `openworld-logo.png`, and `openworld-emblem.png` together with index.html. No build system is required.

## Before production
- Image photographs are external Unsplash image URLs and may not display in all environments. Local SVG illustrations remain as fallback; replace with appropriately licensed local photography for final launch.
- Booking is an enquiry-preview flow only. It does not store bookings or send mail automatically. The proposed `bookings@openworldtravel.com` email must be provisioned before launch.
- All itineraries are illustrative and priced on request; do not imply availability or confirmed supplier partnerships.
- Currency converter requires network access to its exchange-rate data provider.


## Version 6: Compact browsing
- Destinations use Safaris / Africa / Worldwide tabs and previous/next controls (three visible at a time), avoiding a long list.
- Package cards initially show three journeys; **Show more journeys** adds three at a time. Filters reset the count.
- Currency converter remains just above the footer.
- All previous package enquiry interactions are retained.


## Version 7 — Cinematic Destinations Gallery
- Replaced the long destination showcase with a continuously looping horizontal marquee.
- The gallery pauses on pointer hover and keyboard focus, and has a manual pause/play button.
- Country and destination names remain readable, with stronger labels on hover.
- On mobile, the gallery becomes a manual swipe carousel.
- Requests 3840-pixel-wide versions of the existing external destination photos where the source supports that resolution, with bundled SVG fallbacks. They are **not guaranteed to be native 4K source photographs**. For reliable production quality, replace URLs with licensed locally hosted high-resolution files before launch.
- Booking enquiry functionality remains a preview and does not create confirmed reservations.
