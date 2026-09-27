# Data Model: Blogs

## Overview
This defines the structure for storing blog articles in the database.

## Entities

### `blogs` Table
Stores the content and metadata of an article.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID / Int | Primary Key | Unique identifier |
| `title_en` | String | Not Null | English Title |
| `title_ar` | String | Not Null | Arabic Title |
| `slug` | String | Unique, Not Null | URL-friendly identifier |
| `content_en` | Text / JSONB | Not Null | Rich text content in English |
| `content_ar` | Text / JSONB | Not Null | Rich text content in Arabic |
| `seo_description_en`| String | Nullable | Meta description (en) |
| `seo_description_ar`| String | Nullable | Meta description (ar) |
| `seo_tags` | JSONB / Array | Nullable | Array of tags for SEO/categorization |
| `og_image_url` | String | Nullable | OpenGraph sharing image URL |
| `is_published` | Boolean | Default: false | Visibility status |
| `author_id` | UUID / Int | Foreign Key | Reference to Admin User |
| `created_at` | Timestamp | Default: now() | Creation timestamp |
| `updated_at` | Timestamp | Default: now() | Last update timestamp |

## Relationships
- A **Blog** belongs to an **Admin User** (author_id).

## Validation Rules
- `slug` must be globally unique across all blogs.
- `title_en` and `title_ar` must be between 5 and 100 characters.
- `slug` must match regex `^[a-z0-9]+(?:-[a-z0-9]+)*$`.
