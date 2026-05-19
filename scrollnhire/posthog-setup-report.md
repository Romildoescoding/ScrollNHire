<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into ScrollnHire. Here is a summary of what was set up:

**Client-side initialization** was added via `instrumentation-client.ts` (Next.js 15.3+ pattern), enabling automatic pageview tracking, session replay, and exception capture.

**Reverse proxy rewrites** were added to `next.config.ts` so PostHog events route through `/ingest` on your own domain, improving ad-blocker resilience.

**A server-side PostHog client** was created at `app/lib/posthog-server.ts` using `posthog-node` for capturing critical business events from API routes.

**User identification** is performed at login (`user_logged_in`) and signup (`user_signed_up`) so client and server events can be correlated by distinct ID.

## Events

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a user successfully completes OTP verification and their account is created | `components/signup-form-with-otp.tsx` |
| `user_logged_in` | Fired when a user successfully logs in via email/password | `components/login-form.tsx` |
| `onboarding_role_selected` | Fired when a new user selects their role (student or employer) during onboarding | `app/(root)/onboarding/page.tsx` |
| `onboarding_completed` | Fired when a user reaches the completion screen after finishing all onboarding steps | `app/(root)/onboarding/page.tsx` |
| `reel_uploaded` | Fired when a student successfully uploads and publishes a reel | `app/(root)/(dashboard)/create/page.tsx` |
| `reel_liked` | Fired server-side when a user likes a reel | `app/api/reel/[reelId]/like/route.ts` |
| `reel_shortlisted` | Fired server-side when an employer shortlists a student from their reel | `app/api/reel/[reelId]/shortlist/route.ts` |
| `search_performed` | Fired when a user submits a search query on the explore page | `app/(root)/(dashboard)/explore/page.tsx` |
| `conversation_started` | Fired server-side when an employer initiates a conversation with a student | `app/api/conversations/create/route.ts` |
| `interview_scheduled` | Fired server-side when an employer schedules an interview with a student | `app/api/interview/route.ts` |
| `hiring_status_updated` | Fired server-side when an employer updates a candidate's hiring status | `app/api/hiring/status/route.ts` |

## New files

| File | Purpose |
|---|---|
| `instrumentation-client.ts` | Client-side PostHog initialization (Next.js 15.3+) |
| `app/lib/posthog-server.ts` | Singleton server-side PostHog client |

## Modified files

| File | Change |
|---|---|
| `next.config.ts` | Added `/ingest` reverse proxy rewrites + `skipTrailingSlashRedirect` |
| `.env.local` | Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1602419)
- [New Signups & Logins Over Time](/insights/jqObiqyZ)
- [Signup → Onboarding Conversion Funnel](/insights/SH3EF5Jv)
- [Hiring Pipeline Funnel](/insights/sA2K8zZS)
- [Reel Engagement Trends](/insights/fZy12d9J)
- [Hiring Status Updates](/insights/vXWo1EvM)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
