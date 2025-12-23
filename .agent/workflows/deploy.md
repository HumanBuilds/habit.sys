---
description: How to deploy the application to Vercel
---

# Deploying to Vercel

This workflow describes how to deploy the application to Vercel production.

## Prerequisites

-   **Vercel CLI**: Must be installed and linked (`vercel link`).
-   **Credentials**: Supabase env vars must be set in Vercel (`vercel env add` was used).

## Steps

1.  **Check Build**: Ensure local build passes.
    ```bash
    npm run build
    ```

2.  **Deploy**: Run the deploy script.
    ```bash
    // turbo
    npm run deploy
    ```
    -   This runs `vercel --prod`.
    -   If prompted, confirm the settings (defaults are usually correct).
    -   For zero-intervention, use `vercel --prod --yes` (but check `package.json`).

3.  **Verify**:
    -   Check the output URL.
    -   Ensure Supabase data loads correctly.
