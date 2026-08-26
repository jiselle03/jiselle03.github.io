# Small Walks architecture

## Scope

One static Astro route with browser-only state. A photo is read locally for preview and saved in browser storage with the walk entry. There is no account, upload endpoint, cloud storage, social feed, or fake sharing claim.

## Local State

- Prompt: walk length, title, and observation question.
- Walk entry: date, caption, match, optional photo data URL, and generated palette.
- Walkbook: entries restored from local storage when available.

## Interaction Rules

- A completed entry requires a caption and prompt match; photo is optional.
- File input accepts an image and shows a local preview only.
- The share-card action uses the browser print dialog so a visitor can save a real card as PDF or image without a server.
- Reset removes only browser-stored demo entries after confirmation.

## Files

- `src/pages/demo/small-walks.astro`
- `src/styles/small-walks.css`
