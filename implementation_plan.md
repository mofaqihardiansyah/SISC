# Implementation Plan

[Overview]
Refactor and fix bugs in the Paper Submission module to ensure data integrity and improve maintainability.

The Paper Submission module currently has a critical data-matching bug (using titles instead of IDs), lacks robust validation, and contains significant UI code duplication. This plan addresses these issues by refactoring the UI into modular components, fixing the matching logic, and enhancing the server actions with validation.

[Types]
Align TypeScript interfaces with the database schema and actual API responses.

- **`RegisteredEvent`**: Update to include essential fields from `event` table.
- **`SubmittedPaper`**: Update to use `eventId` for matching and align `status` with `paperStatusEnum`.
- **`SubmissionDataResponse`**: Define a standard response type for `getSubmissionData`.

[Files]
Modify existing files to improve structure and fix logic errors.

Detailed breakdown:
- `src/actions/paper.ts`:
  - Modify `getSubmissionData` to include `eventId` in `submittedPapers` result.
  - Modify `submitNewPaper` to add Zod validation and prevent duplicate submissions for the same event (unless rejected).
- `src/app/(user)/profile/submit-paper/ClientPage.tsx`:
  - Fix matching logic in `eventsWithStatus` to use `eventId`.
  - Refactor large JSX blocks into sub-components: `StatsGrid`, `EventFilters`, `EventList`, and `SubmissionForm`.
- `src/components/profile/PaperSubmissionComponents.tsx`:
  - Mark as deprecated or refactor to match the modern UI found in `ClientPage.tsx`.

[Functions]
Improve data handling and validation in key functions.

Detailed breakdown:
- `getSubmissionData` (src/actions/paper.ts):
  - Change `eventJudul: event.judul` to `eventId: event.id` in the `submittedPapers` select query.
- `submitNewPaper` (src/actions/paper.ts):
  - Add `zod` schema validation for input data.
  - Add check: `if (existingSubmission && status !== 'rejected') throw Error`.
- `eventsWithStatus` calculation (src/app/(user)/profile/submit-paper/ClientPage.tsx):
  - Change `initialSubmittedPapers.find(p => p.eventJudul === event.judul)` to `initialSubmittedPapers.find(p => p.eventId === event.id)`.

[Classes]
No class modifications required as the project uses a functional approach with React and Server Actions.

[Dependencies]
No new dependencies required; utilizing existing `zod` and `lucide-react`.

[Testing]
Verify functionality through manual testing and existing patterns.

- Test 1: Verify that events with identical titles are correctly distinguished by ID.
- Test 2: Verify that "Submit Ulang" works correctly for rejected papers.
- Test 3: Verify that double-submission for a "review" status paper is blocked.
- Test 4: Verify form validation errors are correctly displayed via `react-hot-toast`.

[Implementation Order]
Sequential steps to ensure a stable refactor.

1. Update `src/actions/paper.ts` to include `eventId` in return data.
2. Update `ClientPage.tsx` logic to use `eventId` for matching.
3. Extract `SubmissionForm` from `ClientPage.tsx` into a separate component.
4. Extract `EventList` and `EventCard` from `ClientPage.tsx`.
5. Add Zod validation to `submitNewPaper` action.
6. Final cleanup of unused types in `PaperSubmissionComponents.tsx`.