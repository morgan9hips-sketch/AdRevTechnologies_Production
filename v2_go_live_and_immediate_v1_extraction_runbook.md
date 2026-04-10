---
title: V2 Go-Live and Immediate V1 Extraction Runbook
---

# V2 Go-Live and Immediate V1 Extraction Runbook

## Objective

Ship v2 as the only public production experience, then immediately extract and remove v1 from this production drive.

## Hard Rules

- v2 is the only public surface on the production domain.
- v1 must stay owner-only during transition.
- v1 must be removed from this production drive immediately after v2 go-live validation.

## Phase 1: Pre-Go-Live Checks

- Confirm all public navigation points to v2 pages only.
- Confirm `/platform` routes are owner-gated in middleware.
- Confirm docs, pricing, partners, and contact links do not require v1 routes.
- Confirm build success from `website_production`.

## Phase 2: Go-Live Validation (v2)

- Deploy and confirm primary pages load:
  - `/`
  - `/pricing`
  - `/docs`
  - `/partners`
  - `/contact`
- Validate no public link sends users into owner-gated v1 routes.
- Validate checkout and contact flows still function.

## Phase 3: Immediate v1 Extraction (same release window)

- Create a dedicated repository for v1 code.
- Move v1-specific app routes and components to that repository.
- Remove v1-only folders and references from this production repository.
- Keep owner access and private domain/routing inside the v1 repository only.

## Phase 4: Production Cleanup in this Repository

- Remove v1 route imports/usages that remain in marketing pages.
- Remove v1 environment variables from production where no longer needed.
- Re-run build and smoke tests.
- Deploy cleanup and verify only v2 pages remain active.

## Phase 5: Post-Cutover Controls

- Keep a rollback tag for the final mixed state before extraction.
- Keep a release note documenting:
  - timestamp of go-live
  - timestamp of v1 extraction
  - who approved
- Monitor errors for 24 hours after cutover.

## Quick Decision Gate

Proceed to Phase 3 only when:

- v2 production pages are healthy,
- critical flows pass,
- and no public dependency on v1 remains.
