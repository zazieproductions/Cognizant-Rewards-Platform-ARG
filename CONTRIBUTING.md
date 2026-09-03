# Contributing

Thanks for wanting to work on Cognizant Rewards Platform. This is a
creative-technology piece, so contributing is a bit different from a typical
OSS repo: the *fiction* and the *engineering* are both first-class, and they
often pull in opposite directions. Here's how to cooperate with both.

## Ground rules

1. **Preserve the voice.** All task text, memos, system observations, warnings,
   and contradictions are written in a specific deadpan bureaucratic register.
   Match it. If you're unsure, read `docs/design/interaction-model.md` and
   `docs/design/visual-language.md` first.
2. **Don't flatten the strangeness.** The piece is deliberately hostile,
   impossible, and procedurally inaccurate. "Fix it so it's a fair game" is not
   a valid contribution. "Make the lobby more believable" often is.
3. **Keep the domain logic pure.** `src/lib/*` are pure, unit-tested functions.
   Don't add React, DOM, or side effects into them.
4. **No new dependencies unless necessary.** The bundle is tiny and the piece
   works fully client-side. Before adding a package, consider whether the
   existing primitives (CSS, Web Audio, `framer-motion`) suffice.
5. **Don't rewrite working systems** to satisfy stylistic preferences. Refactor
   when it improves legibility or testability; otherwise leave it.

## Working on content

The corpus is `src/data/tasks.ts`. To add a task:

- Give it a unique `id` (two digits, e.g. `'021'`).
- Set a `category` (from `src/types.ts`), `title`, `instructions`, and `reward`.
- Set `minDepth` (the corruption gate) and `corruptionLevel`.
- Optionally add `systemNote`, `warning`, `contradiction`, `completionReq`, or
  `references`.
- If it needs a bespoke interactive panel (beyond the generic submit button),
  add its id to `CUSTOM_PANEL_TASK_IDS` in `src/lib/tasks.ts` **and** add the
  panel JSX in `src/App.tsx`.

## Working on behaviour

- Status resolution lives in `src/lib/tasks.ts`; state in `src/App.tsx`.
- Add or update the pure functions in `tests/` and run `npm test`.
- Verify you haven't broken the reward → depth → unlock loop. The simplest check
  is to play the dashboard end-to-end.

## Workflow

This is a lightweight workflow — no CLA, no DCO, no commit-signing requirement.

1. **Open an issue** (or check existing ones) describing the change.
2. **Branch off `main`.** Name it clearly (e.g. `add-fridge-audio`,
   `fix-reset-balances`).
3. **Make the change.** Keep it small and focused.
4. **Run the gates** locally:
   ```bash
   npm run lint
   npm run typecheck
   npm test
   npm run build
   ```
5. **Open a pull request.** Use the PR template. If your change touches the
   fiction, say so and note the intended tone so reviewers can check it fits.

## Pull-request checklist

- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm test` passes
- [ ] `npm run build` passes
- [ ] New behaviour has a test (if it's pure logic)
- [ ] New content matches the register
- [ ] No new dependency unless justified
- [ ] Screenshots/examples updated if it changes the visible interface

## Environment

- Node 18+ (lockfile generated on Node 22).
- `npm install` then `npm run dev`.
- No `.env` required (see `.env.example`).

## Code of conduct

Be respectful. This is an art project; good faith is more important than being
"right." Harassment, dismissal of others' work, and attempts to sanitise the
piece's politics out of existence are not welcome.
