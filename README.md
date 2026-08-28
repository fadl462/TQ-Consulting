# TQ Consulting — V36 About Hero Hard Reset

This version fixes the persistent oversized blank area between the fixed navigation and the About page hero content.

Changes:
- Hard-resets the About hero section height/min-height on desktop.
- Removes any inherited vertical centering/offset from the hero grid, copy and artwork.
- Forces the hero grid to begin immediately after the navigation's intended content offset.
- Adds cache-busting version parameters to the About page CSS/JS references so GitHub Pages/browser caching cannot keep the previous stylesheet.
- No changes to the other page content or design system.
