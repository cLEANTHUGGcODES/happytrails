# Recurring live site health check

`npm run seo:audit` checks the canonical Happy Trails website using its live sitemap. It discovers every published sitemap URL, so new pages are included after deployment without maintaining a second page list. It makes read-only requests to `https://www.happytrailsshindigs.com` only.

The audit verifies HTTP 200 HTML, no `noindex` directive, exactly one matching canonical, one nonempty H1, title, and description on every sitemap page. It also flags duplicate H1s, titles, or descriptions across those pages. Root canonicals with and without the final slash compare equally. Internal links are checked for reachable destinations; HTML fragments must match a server-rendered ID or named anchor. Normal internal redirects are recorded as warnings; sitemap redirects, broken destinations, and missing fragments fail the run.

Referenced images, image sitemap entries, stylesheets, scripts, icons, video sources, and downloads are checked with HEAD. If a server rejects HEAD, the fallback requests only the first 1 KB and immediately cancels the response body. Videos and downloads are never read into memory. External websites, `mailto:`/`tel:` links, JavaScript buttons, empty `#` placeholders, and browser text-only fragments are outside this audit. Intended `noindex` on downloadable PDFs or non-sitemap pages does not fail the page metadata checks.

Reports are written to `test-results/site-health/report.json` and `report.md` (already ignored by Git). A failed check exits nonzero; the Markdown report names the affected URL and its linking page when applicable. Network failures also fail the run and should be checked against a rerun before changing site content. This check does not verify search indexing, rankings, external listings, JavaScript interactions, or visual quality.

For a running local build, use:

```sh
npm run seo:audit -- --base-url http://127.0.0.1:3000
```

Only an HTTP loopback origin is accepted as an override. Requests go to the local server while canonical expectations remain the public HTTPS domain. Use a build without Vercel preview `noindex` headers when testing production indexability. To retain separate reports, add `--output test-results/site-health/local.json`.

The **Live site health** GitHub Actions workflow runs Mondays at 14:23 UTC and supports **Run workflow** in the Actions tab. It uses Node.js 22, `npm ci`, the fixture checks, a ten-minute timeout, read-only repository permission, and one concurrent audit. JSON and Markdown artifacts are retained for 30 days, including failed runs. It neither opens issues nor sends messages and needs no secrets. The schedule becomes active when this workflow is on the repository's default branch with Actions enabled; GitHub scheduling is not an uptime SLA.

Workflow syntax and default-branch scheduling follow [GitHub's workflow reference](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#onschedule). Official checkout, setup-node, and upload-artifact actions are pinned to verified full commit SHAs, following [GitHub's secure-use guidance](https://docs.github.com/en/actions/reference/security/secure-use#using-third-party-actions). Refresh these pins deliberately when updating workflow dependencies.
