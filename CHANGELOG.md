# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Changed

- Search and the assistant now call server routes in `src/pages/api/`, which add the assistant API key on the server. The key no longer ships in client code.
- Rename `PUBLIC_MINTLIFY_ASSISTANT_KEY` to `MINTLIFY_ASSISTANT_KEY`. Update your `.env` file and your host's environment variables.
- Add the `@astrojs/node` adapter and an `npm run start` script.

## [1.0.0] - 2026-02-18

### Initialized Astro starter kit

- Astro-based documentation site powered by `@mintlify/astro`
- MDX content authoring with docs in `docs/` directory
- Built-in AI assistant with chat interface
- Search with recent search history
- Sidebar navigation with tabs, groups, and anchors
- Table of contents
- Mobile-responsive layout
- Tailwind CSS styling
- ESLint and Prettier configuration
