# Mintlify Astro Starter

An Astro starter kit for building custom documentation sites powered by Mintlify.

## Setup

1. Clone this repo
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your Mintlify credentials:
   ```
   MINTLIFY_API_KEY=your_api_key
   MINTLIFY_PROJECT_ID=your_project_id
   MINTLIFY_API_BASE_URL=https://api.mintlify.com/external/v1
   ```
4. Run the dev server:
   ```bash
   npm run dev
   ```

## Build & Deploy

```bash
npm run build    # Build for production
npm run preview  # Preview the built site
```

## Architecture

This starter uses the `@mintlify/headless-sdk` to fetch content from Mintlify's API and render it with Astro. The SDK client is configured in `src/lib/mintlify.ts` and used throughout the application.

See the [SDK documentation](https://github.com/mintlify/headless-sdk) for advanced usage.
