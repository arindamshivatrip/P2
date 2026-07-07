# Website Refresh Plan (tightened, approved order)
_Smallest set of changes for a substantially more premium feel. Cut: dark-mode toggle, font conversion, route rename, sitemap/robots/OG generation, filter counts._

## Batch 1 — Homepage first impression ✅
- [x] Fix `siteMeta` placeholder description (recruiter-visible in search/tabs)
- [x] Hero: availability status chip + tighten side panel into signal card (orgs: L'Oréal · SP Digital · UMD)
- [x] Lens cards: index numbers + accent hairline + hover lift; break the 5-identical-boxes monotony
- [x] Selected Work cards: surface one metric per card
_Verified: typecheck + lint pass; DOM confirmed via a11y snapshot + inspect (screenshots stall due to autoplay video in preview tool — non-blocking)._

## Batch 2 — Work cards & scannability ✅
- [x] Year/category label chips on fallback card visuals (home cards no longer look empty; work tiles already had themed gradients via `tile-media.ts`)
- [x] `/work` reveal triggers earlier (`amount 0.05`); blank first paint was partly preview-tool window throttling, confirmed fine after restart
- [x] Work page intro line under heading
- [x] Archive rail cards: org added to status/year row (truncation-safe)
_Verified: typecheck + lint pass; screenshots confirm chips, metrics, intro, rail org._

## Batch 3 — Visual system polish ✅
- [x] `--shadow-card-hover` token (light+dark) + `shadow-card-hover` utility; replaced 9 hardcoded hover shadows
- [x] Global accent `:focus-visible` outline in base layer
- [x] Footer: fixed broken `href="#"` LinkedIn/GitHub links (real URLs from contact data), email → aritrip@umd.edu
_Verified: typecheck + lint pass; footer hrefs confirmed in DOM._

## Batch 4 — About personality + copy pass ✅
- [x] About headline → "Engineering taught me how. People taught me why."
- [x] Contact: concrete targets (2026 internships/full-time; PDE, human-AI, UXE, XR) + reply-time line
- [x] Home CTA → "Go one level deeper." / "Get in touch"; footer status parity with hero chip
_Verified: typecheck + lint pass; copy confirmed rendering on /, /about, /contact._

## Batch 5 — Mobile + accessibility/build ✅
- [x] Mobile pass (375px): /, /work, /contact, /experiments checked — no horizontal overflow, layouts stack cleanly
- [x] Per-page `metadata` added for /work /experiments /about /contact /cv (titles verified in served HTML)
- [x] Production build passes: 26 static pages, first-load JS 102–174 kB
_All five batches complete._

## Protocol
Each batch: edit → `npm run typecheck` + `npm run lint` → preview (1280 + 375) → summary (files, effect, verification, next).
