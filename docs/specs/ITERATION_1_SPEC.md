## 1. Scope of Days 1–5

Goal: by the end of Day 5, there is a single monorepo with a running backend API that supports:

- Managing employees and their work sessions.
- Ingesting and viewing activity events per session.
- Defining simple monitoring rules.
- Automatically generating alerts when rules are violated.
- Providing basic per‑employee summary and daily stats endpoints.

The system should be usable via API clients (e.g., curl, Postman) and behave predictably for all defined flows.

No frontend UI is required yet.

## 2. Monorepo Setup – Product Requirements

From the product perspective, the repo must:

- Contain all code in one place for this platform:
  - A backend app named api.
  - A placeholder folder for the future frontend app named web (can be empty or have a minimal README).
  - A shared contracts package for domain types.
- Support simple developer experience:
  - A new developer should be able to:
    - Clone the repo.
    - Run one command to install dependencies.
    - Run one command to start the backend and database in dev mode.
  - A single README at the root must describe:
    - What the project is.
    - How to start the backend.
    - How to run example requests.
- Run with Dockerized Postgres:
  - There is a docker-compose file at the root that:
    - Starts a Postgres instance with a known port, username, password, and database name.
    - The backend is configured to use that database in development.

When this part is done, the “product” is one repo that can be started and interacted with by any engineer without extra context.

## 3. Domain Objects and Behaviors

The backend core must implement the following domain concepts and behaviors at the product level.

### 3.1 Employees

Concept: an employee is a monitored user in the system (e.g., person whose activity is tracked).

Requirements:

- The system must allow creating employees with:
  - Name (required, non‑empty).
  - Email (required, must be unique within the system).
  - Department (optional string).
- The system must allow listing employees:
  - Return all employees with their id, name, email, department, and creation time.
  - If there are no employees, return an empty list.
- It must be possible to retrieve a single employee by id:
  - If the id exists → return the employee.
  - If it does not exist → clear 404‑type error.

Product expectations:

- Duplicate emails are not allowed; attempts must result in a clear error.
- Employee records are stable and never silently modified or deleted during Days 1–5 (no update/delete endpoints yet).

### 3.2 Sessions

Concept: a session represents a continuous period of activity for an employee (e.g., a work session for a portion of the day).

Requirements:

- The system must support starting a session for a given employee:
  - Input: employee id.
  - Result: create a session with:
    - Status ACTIVE.
    - startedAt set to current server time.
    - endedAt empty.
- The system must support ending a session:
  - Input: session id.
  - Result:
    - status changes from ACTIVE to ENDED.
    - endedAt set to current server time.
- The system must allow listing sessions for a given employee:
  - Input: employee id.
  - Result: all sessions for that employee, including status and start/end times.
  - Optional: sorted by startedAt descending.
- It must be possible to retrieve a single session by id.

Product expectations:

- A session must always belong to exactly one employee.
- If trying to start a session for a non‑existing employee → clear error.
- Ending an already ended session should not break; it should return a reasonable error or idempotent result (e.g., “already ended”).

### 3.3 Activity Events

Concept: an activity event is a discrete piece of activity that occurs within a session (e.g., visiting a website, using an app, file operation, keystroke summary).

Event Types (for now):

- APP – application usage (e.g., VSCode, Chrome).
- WEB – website visit (e.g., https://facebook.com).
- FILE – file operation (e.g., opening /home/user/confidential.docx).
- KEYSTROKE_SUMMARY – aggregated keystroke count in a period.

Requirements:

- The system must support recording activity events for a given session:
  - Input:
    - Session id.
    - Event type (APP, WEB, FILE, KEYSTROKE_SUMMARY).
    - occurredAt timestamp.
    - A metadata object whose contents depend on the type, e.g.:
      - APP: { "appName": "VSCode", "windowTitle": "main.ts" }
      - WEB: { "url": "https://facebook.com", "title": "Facebook" }
      - FILE: { "filePath": "/home/user/report.pdf", "operation": "OPEN" }
      - KEYSTROKE_SUMMARY: { "keystrokeCount": 123 }
- The system must verify that:
  - The given session exists.
  - The event type is one of the allowed values.
  - occurredAt is a valid timestamp.
- The system must allow listing events for a session:
  - Input: session id.
  - Optional filters:
    - type (only events of that type).
    - from and to timestamps (only events in that range).
  - Result: ordered list (e.g., by occurredAt ascending or descending) with full event details.

Product expectations:

- If a session does not exist, the system must not accept events for it.
- If a filter is applied (e.g., type=WEB), only matching events are returned.
- The metadata object is not interpreted by the user directly but is available for inspection.

### 3.4 Rules

Concept: rules define conditions under which activity becomes problematic and should generate an alert. Rules are simple, human‑interpretable configurations.

For Days 1–5, support at least two types:

- BLOCKED_WEBSITE
- AFTER_HOURS

Requirements:

- The system must support creating rules:
  - Common properties:
    - name (human‑friendly name).
    - description (optional, human‑friendly explanation).
    - type (BLOCKED_WEBSITE or AFTER_HOURS).
    - severity (LOW, MEDIUM, HIGH).
    - active (boolean).
  - Type‑specific config (stored as JSON):
    - BLOCKED_WEBSITE:
      - pattern: string (e.g., "facebook.com" or "*.social.com").
    - AFTER_HOURS:
      - workHours: with start and end (e.g., "09:00", "18:00").
      - timezone: string (e.g., "Europe/Belgrade").
- The system must allow listing rules:
  - All rules, with an optional filter active=true/false.
- The system must allow updating rules:
  - Change severity, description, config, active flag.

Product expectations:

- Rules are not tied to specific employees yet; they apply globally.
- If a rule is inactive (active=false), it must not generate alerts.
- The configuration must be stored and returned exactly as entered, so an admin can understand what each rule does.

### 3.5 Alerts

Concept: an alert represents a rule violation for a specific employee (and session).

Requirements:

- The system must automatically create alerts when events are ingested and rules are violated.
- For BLOCKED_WEBSITE:
  - When a WEB event is recorded with a URL matching the rule’s pattern:
    - Create an alert with:
      - employeeId (from session’s employee).
      - sessionId (from event’s session).
      - ruleId (violated rule).
      - detectedAt (time of event or current server time).
      - status set to OPEN.
      - details storing relevant context (e.g., URL, rule pattern).
- For AFTER_HOURS:
  - When any event occurs outside the configured work hours (in given timezone):
    - Create an alert similarly, with details about the time and work hours window.
- The system must allow listing alerts:
  - Optional filters:
    - employeeId
    - severity
    - status (OPEN, CLOSED)
    - from, to (by detectedAt).
- The system must allow updating alert status:
  - Change OPEN to CLOSED (and vice versa if needed).

Product expectations:

- Every rule violation event produces at least one alert if active rules match.
- Alerts must be clearly tied to the employee and session so an analyst can reason about them.
- Marking an alert as CLOSED is a simple operation and does not affect past events.

### 3.6 Stats and Summaries

Concept: simple analytics endpoints that help understand behavior per employee, without a UI yet.

Requirements:

- Employee summary endpoint:
  - Input: employeeId.
  - Output:
    - totalSessions
    - totalActiveMinutes (sum of durations of all ended sessions; active sessions can be ignored or computed up to “now” if you prefer)
    - eventsByType: object mapping event type → count.
    - alertsCountBySeverity: object mapping severity → count.
- Employee daily stats endpoint:
  - Input: employeeId, optional from and to dates.
  - Output: list of daily stats entries:
    - date
    - totalActiveMinutes
    - totalEvents
    - totalAlerts
    - eventsByType (per day)

For Days 1–5, it is acceptable if daily stats are computed on the fly from raw data, as long as the result is correct and the API behaves predictably.

Product expectations:

- If there is no data for an employee, the summary returns zeros or empty structures (not errors).
- If the user supplies a date range with no activity, the daily stats endpoint returns an empty list.

## 4. API Behavior & UX Expectations (API‑Consumer View)

From a product standpoint (as if an API consumer is your “user”), the system must:

- Produce consistent JSON responses:
  - Every successful endpoint returns data in a predictable shape.
  - Errors include an informative message and appropriate status code.
- Handle invalid input gracefully:
  - Missing required fields → error with a clear message.
  - Invalid ids → not found error.
  - Invalid types or timestamps → validation error.
- Support happy path usage for all core flows:
  - Example flow the system must fully support:
    - Create an employee.
    - Start a session for that employee.
    - Post a few WEB events, including one to https://facebook.com.
    - Create a BLOCKED_WEBSITE rule for "facebook.com" and mark it active (or have it already defined).
    - Post another WEB event to https://facebook.com.
    - Result: an alert gets created automatically.
    - List alerts filtered by that employee; see the one just created.
    - Call employee summary and see:
      - total sessions = 1
      - events counts by type
      - alertsCountBySeverity including your alert.

If this scenario works end‑to‑end, the product is considered working as expected for Days 1–5.

## 5. “Definition of Done” for Days 1–5

You can mark this phase as complete when:

- Monorepo:
  - Repository contains apps/api, apps/web (placeholder), and packages/contracts.
  - Root README explains how to start the backend and contains example requests.
- Backend core:
  - There are working endpoints for:
    - Employees: create, list, get.
    - Sessions: start, end, list per employee, get.
    - Events: create per session, list per session with filters.
    - Rules: create, list, update.
    - Alerts: list with filters, update status.
    - Stats: per‑employee summary, per‑employee daily stats.
  - All core flows described above can be executed via API client.
- Behavior:
  - Rule violations during event creation generate alerts as specified.
  - Summaries and daily stats reflect the underlying data correctly.
  - Error handling for common mistakes is user‑friendly (clear messages).