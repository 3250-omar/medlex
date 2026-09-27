# API Contracts: Blogs

## Endpoints

### 1. `GET /api/blogs`
Retrieves a paginated list of published blogs for the public website.
**Response**: 200 OK
```json
{
  "data": [
    {
      "id": "...",
      "slug": "...",
      "title_en": "...",
      "title_ar": "...",
      "created_at": "...",
      "og_image_url": "..."
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10
  }
}
```

### 2. `GET /api/blogs/:slug`
Retrieves a single published blog by slug for the public website.
**Response**: 200 OK
```json
{
  "id": "...",
  "slug": "...",
  "title_en": "...",
  "title_ar": "...",
  "content_en": "...",
  "content_ar": "...",
  "seo_description_en": "...",
  "seo_description_ar": "...",
  "seo_tags": ["..."],
  "og_image_url": "...",
  "created_at": "...",
  "author_name": "..."
}
```

*(Admin endpoints for Create, Update, Delete will also exist on the admin dashboard's backend structure, typically requiring authentication headers).*
