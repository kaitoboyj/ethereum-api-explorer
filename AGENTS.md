<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- DexScreener is called from the browser via `src/lib/dexscreener.ts` query options (public API, no key, CORS-enabled); keep market fetches there so caching and rate-limit handling stay in one place.
- Never display invented values (addresses, prices, audit results, payment details); unavailable data renders as "N/A" or an explicit "not configured" state.
