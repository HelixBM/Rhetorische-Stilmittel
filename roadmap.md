# Roadmap and Change Log

## Completed To-Dos

1. Removed the add-your-own-set feature.
2. Replaced runtime SQLite/sql.js loading with the static JS data file.
3. Added fuzzy matching for Freitext answers.
4. Added explanations after quiz answers.
5. Improved mobile layout and touch behavior.
6. Added accessibility cleanup for focus states, labels, semantics, and keyboard-friendly controls.
7. Applied visual polish for spacing, feedback, tables, glossary cards, and responsive controls.
8. Reorganized the code into focused components and shared helpers.
9. Added teacher/classroom tools: challenge links, printable worksheets, and copyable result summaries.

## Change Log

- Removed `CustomSetsMode`, custom-set IndexedDB storage, the "Eigene Sets" navigation item, and related active-data switching.
- Normalized the static `STILMITTEL` data with stable numeric ids and now loads it through `src/lib/data.js`.
- Removed `sql.js`, `src/db/sqlite.js`, the SQLite build script, and unused SQLite/WASM public assets.
- Added quiz helpers in `src/lib/quiz.js` for question generation, fuzzy Freitext matching, and result summaries.
- Split UI code into `src/components/FlashcardMode.jsx`, `QuizModes.jsx`, `GlossaryMode.jsx`, `StatsDashboard.jsx`, `SRSReviewMode.jsx`, `TeacherTools.jsx`, and `Shared.jsx`.
- Added answer explanations derived from each entry's definition and first example.
- Added a teacher tools screen for worksheet generation, copying, and printing.
- Improved responsive navigation, stacked mobile quiz inputs, focus-visible styling, table overflow, and accessible labels.

## Verification

- `npm run build` passes.
