# Max's GCSE Plan

A GCSE revision app for summer 2027. **Today** follows the online school's bell times (08:00–16:20): live lessons stay fixed, and each self-study period shows this week's focus, a 45-minute recipe, the week's videos and a lesson on the best topic for that subject (this week's focus first, then weak or overdue topics). There are also flashcards, practice decks, quizzes, exam-board info for every subject and the full 2027 exam timetable.

In October 2026 it absorbed the separate GCSE Study Plan page (`../GCSE-Timetable`). That repo still holds the YouTube video scraper and the Anki deck builder.

**Live:** https://maxwilliamfoster-sys.github.io/gcse-plan/

- `src/d-*.js`: subject data, plus `d-timetable.js` (bell times, live lessons, weekly focus, recipes, guides), `d-focus.js` (which topics each week's focus covers) and `d-videos.js` (generated from `../GCSE-Timetable/videos/videos.json`)
- `src/app.js`: planner engine, sync and data model. `src/timetable.js`: the bell-time day and topic picking. `src/ui.js`: router, views, lessons, flashcards and quizzes
- `src/app.css` on top of `src/vendor/basecoat.css` ([Basecoat](https://github.com/hunvreus/basecoat) 1.0.2, MIT: shadcn/ui components as plain CSS). Icons are from [Lucide](https://lucide.dev) (ISC)
- `py build.py` writes `docs/index.html` (GitHub Pages, with Firebase sign-in) and `dist/` (single-file builds, including the Claude artifact)
- `node --test tests/engine.test.js` runs the engine tests

Progress syncs through your account (Firebase on Pages, or Claude on the artifact), and is also saved in each browser's local storage.
