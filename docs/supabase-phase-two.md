# Phase two: owner photo and news dashboard

The user chose to deliver the public website first. This document records the next implementation phase; authentication, database migrations, storage policies, and the dashboard are not implemented in the current release.

## Public interfaces to preserve

The application reads `MediaItem`, `NewsPost`, and named `MediaSlot` selections through `src/lib/content.ts`. Replace those local readers with a server-side Supabase repository. Preserve media IDs, article slugs, and page URLs during an idempotent content import. Keep contact facts and general venue copy developer-managed, as agreed.

`ContentImage` resolves featured page selections through `getSiteMedia()`. `PhotoGallery` accepts gallery items. News list/article pages, metadata, and the sitemap use the news readers. Video preparation remains developer-managed in this phase.

## Owner experience

At `/admin`, provide Gallery, News, and View Website. Use invited administrators with email/password sign-in and password reset; disable public registration. A customer portal is not part of this scope.

Gallery workflow: select photos on phone/computer → upload with progress/retry → preview → edit alt text, caption, category, and crop/focal point → reorder → publish/hide/archive. Provide accessible move-up/down actions alongside drag sorting. Allow selection of named homepage/venue image slots.

News workflow: title, summary, cover photo, limited formatted article content → save draft → preview → publish/edit/unpublish. Render structured rich text with an allowlisted renderer, without accepting arbitrary HTML. Update the initial paragraph-only `body` contract deliberately when adding that editor.

## Storage and authorization

- Supabase Auth and `@supabase/ssr` handle cookie-based sessions. Validate identity and approved-admin membership in every mutation, independently of page protection.
- Enable RLS for media, news, featured slots, and Storage. Anonymous visitors can read only published records. A signed-in account alone does not grant editing access.
- Keep originals/drafts private and use signed preview URLs. Publish approved browser-safe derivatives separately; do not confuse a database draft flag with public-bucket file privacy.
- Upload directly from browser to Storage, using resumable upload for larger files/unreliable networks. Do not send photo bodies through Vercel Functions.
- Plan Supabase Pro transformations for HEIC support. Verify actual supplied HEIC files and real iPhone uploads before enabling this path. Normalize orientation, strip location metadata from public derivatives, and use new object paths for replacements.
- Restrict Next.js remote image patterns to the chosen project and published-media paths.
- On publication, invalidate affected public pages. Keep administrator and draft responses out of shared caches.

## Completion checks

Verify signed-out and authenticated nonadmin denials at the endpoint and RLS levels; draft-original privacy; publish/unpublish visibility; fresh replacement images; mobile interruption/retry; focal-point previews; stable public URLs; keyboard reordering; password reset; and an export/restore procedure. Test against separate nonproduction Supabase credentials before production deployment.

## Technical references

- [Supabase server-side authentication](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
- [Database row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Storage access control](https://supabase.com/docs/guides/storage/security/access-control)
- [Storage image transformations](https://supabase.com/docs/guides/storage/serving/image-transformations)
- [Next.js path revalidation](https://nextjs.org/docs/app/api-reference/functions/revalidatePath)
