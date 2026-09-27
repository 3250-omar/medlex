# Quickstart Validation: Blogs

## Prerequisites
- Both frontend apps (`medlex` and `medllex_admin_dashboard`) are running locally.
- Database is running and migrations are applied.

## Validation Steps

1. **Admin Creation Flow**:
   - Navigate to `http://localhost:[admin-port]/admin/blogs`.
   - Click "Create an Article".
   - Fill in English and Arabic titles, rich text content, and SEO metadata.
   - Save the article. Verify the network response is `200/201 OK`.

2. **Public Listing**:
   - Navigate to `http://localhost:[web-port]/en/blogs` (and `/ar/blogs`).
   - Verify the newly created article appears in the list with the correct translated title.

3. **Public Detail & SEO**:
   - Click on the article from the list.
   - Verify routing navigates to `http://localhost:[web-port]/en/blogs/[slug]`.
   - Inspect the page source (`Ctrl+U` or right click -> View Source):
     - Verify `<title>` matches the SEO title.
     - Verify `<meta name="description">` matches the SEO description.
     - Verify `<link rel="alternate" hreflang="ar" ...>` exists.
     - Verify `<script type="application/ld+json">` is present and contains the Article schema.
