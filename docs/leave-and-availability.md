# Leave, conflicts and unavailability — how the Guru dashboard behaves

> **Last updated:** 21 Sep 2026
> **Scope:** everything a Guru can do to say "I am not available", and everything the
> product does in response.
> **Status:** describes the prototype as built. Numbers, names and copy are taken from
> the running app, so a demo will agree with this document.

This is a description of behaviour, not a specification. Where the prototype stands in
for a system that does not exist yet (a Program Manager inbox, for example), that is
said plainly.

---

## 1. The shape of the problem

A Guru's schedule is built *around* the times they say they are free. Great Learning's
scheduling team places sessions into those windows, sometimes weeks ahead. So there are
two different things a Guru might mean by "I'm not available":

- **"Don't schedule me here."** Forward-looking. The Guru blocks time that has not been
  filled yet. Nothing is disrupted.
- **"I can't do this session."** Backward-looking against a commitment that already
  exists. A learner cohort is expecting them.

The dashboard treats these as one continuous flow rather than two features, because in
practice they collide: a Guru books leave for a week in March and only then discovers
that two sessions already sit inside it. **Conflict handling is the bridge between the
two**, and it is where most of the design effort has gone.

The third thing a Guru can do — declining one specific session without blocking any
time at all — is a shortcut through the same machinery.

---

## 2. Three ways to step back

| What the Guru does | Where | Effect on their calendar | Effect on booked sessions |
|---|---|---|---|
| **Mark leave** over a date range | Calendar, Availability page | A visible leave block | Overlapping sessions are handled through the conflict flow |
| **Decline one session** | Session details drawer | Nothing blocked | That session only |
| **Remove an availability slot** | Calendar, click a green slot | Slot disappears | None — cannot be used on a slot that already has a session in it |

Only the first two can affect a booked session. Removing an availability slot is purely
a correction to the offer, and the app does not let a Guru remove a slot that has
already been filled, so it can never orphan a learner.

---

## 3. What "available" means in this product

Availability is not one thing. It is stored as three separate ideas, and it helps to
keep them apart when reading the rest of this document.

**Recurring patterns.** The backbone. A Guru sets up weekly windows — "Weekday evenings,
Mon–Fri, 6–8 PM" — through a short wizard. These repeat indefinitely and are what the
scheduling team plans against.

**One-off slots.** A single dated window, added because the Guru happens to be free that
Tuesday. Created by dragging on the calendar, or from the month view's quick-add.

**Leave.** The negative space. A dated block that says "not this time", which overrides
whatever pattern would otherwise apply.

A Guru sees all three drawn on the same calendar grid: availability in green dashed
outline, leave in rose dashed outline with a diagonal hatch, and real sessions as solid
tiles. The visual language is deliberate — **dashed means "an intention", solid means "a
commitment"**.

Two further settings frame the whole thing and are shown on the Availability page:

- **Max events per week — 6.** The ceiling the scheduling team works to.
- **Availability window — 60 days.** How far ahead the Guru's patterns are offered.

---

## 4. The availability gate

Until a Guru has configured availability at least once, **the Home and Calendar pages
do not show their normal contents at all.** Both are replaced by a single panel:

> **Set your availability to get started**
> Activities get scheduled around the times you mark. Let learners know when you're free
> so they can book time with you.
> `[ Set your availability ]`

(The Calendar's version of that sentence says "Events" where Home says "Activities";
otherwise they are identical.)

This is the strongest statement the product makes about its own model: **a Guru with no
availability has no dashboard.** There is nothing to show, because nothing can be
scheduled. The first-run onboarding flow — Code of Conduct, IP declaration, profile
photo — does not collect availability, so every new Guru meets this gate on their first
visit to Home.

The gate lifts permanently once availability is saved. The primary button on the
Calendar changes from "Add availability" to "Edit availability" at the same moment.

---

## 5. Setting availability

Included here because it sets up the vocabulary the leave flow reuses.

The wizard has two steps for most Gurus, three for the combined Career + Course Mentor:

1. **Confirm your timezone.** "This ensures your availability shows the correct times to
   learners." A Guru who has already configured availability skips this step.
2. **Recurring availability.** Three ready-made patterns are offered under **Popular
   slots** — "Adding these helps you get scheduled faster":
   - Weekend morning — Sat & Sun, 10 AM–12 PM
   - Weekend afternoon — Sat & Sun, 2–4 PM
   - Weekday evenings — Mon–Fri, 6–8 PM

   Any of them can be edited before or after adding, and a Guru can build a **custom
   slot** from scratch by picking weekdays and a start/end time.
3. **What will you do in each slot?** — combined role only. See §12.

Saving confirms with "Availability saved" and the number of patterns configured.

---

## 6. Marking leave

There are two routes to the same outcome, designed for different moments.

### 6a. The dialog — "I know the dates"

Reached from the **Leave** button on the Calendar header, the **Mark unavailable**
button on the Availability page, or **Mark leave** on the mobile action button.

Step one asks for four things and explains itself in a line: *"Dates you block off won't
be offered for sessions."*

- **Start date** and **end date**
- **Start time** and **end time**
- **Reason for leave (optional)** — a free-text box, placeholder *"e.g. Medical emergency
  — back next week"*

When the range spans more than one day, a clarifying line appears: *"These times bound
the first and last day — the days in between are blocked in full."* This is the single
most misread part of the flow, so it is worth restating: see §7.

The dates cannot be inverted. If they are, the Guru is told *"End date needs to be on or
after the start date."* On a single day, the times must form a real interval — *"End time
needs to be after the start time."*

### 6b. Dragging on the calendar — "I can see the gap"

On the desktop week or day view, dragging down any day column selects a time range
directly on the grid. A tip above the calendar advertises it once and can be dismissed:
*"Faster way: dragging down any day on the calendar marks availability or leave."*

Releasing the drag opens a small panel at the cursor with an **Availability / Leave**
toggle. Availability is the default — the assumption is that most dragging is Gurus
offering time, not withdrawing it. Switching to Leave reveals a date range (so a drag
started on one day can be stretched across several) and the line *"You'll show as
unavailable for this time."*

Two differences from the dialog matter:

- **The drag route does not ask for a reason.** Leave created this way is labelled simply
  "Leave". A Guru who wants to record "Sick leave" or "Wedding" uses the dialog.
- **The drag route always declines conflicting sessions.** The dialog offers a choice
  (§8); the drag panel does not.

Dragging is a desktop-only affordance. On mobile, leave is marked through the dialog.
The month view has no leave path at all — leave appears there as a chip, but is created
and edited from the week view or the dialog.

---

## 7. How a leave range is interpreted

This is the nuance that most often surprises people reading the screens for the first
time.

**A single-day leave** means exactly what it says: from the start time to the end time
on that day.

**A multi-day leave** does *not* mean "these hours on each of these days". The start and
end times bound the *ends of the range*, and everything between is blocked completely:

| Day | Blocked |
|---|---|
| First day | From the start time until midnight |
| Every day in between | The whole day |
| Last day | From midnight until the end time |

So "16 Feb 9:00 AM to 19 Feb 5:00 PM" blocks the 16th from 9 AM onwards, the whole of the
17th and 18th, and the 19th until 5 PM. This is the behaviour a Guru intends when they
say "I'm away from Tuesday morning to Friday afternoon", and the drag panel spells it out
for them: *"You'll show as unavailable for 4 days — from 9:00 AM on the first day to 5:00
PM on the last, and all day in between."*

Internally each day is stored as its own record, tied together by a shared identifier.
**The group is the range** — which is why editing a leave rewrites the whole thing rather
than patching individual days, and why cancelling leave always removes the full span
rather than one day of it.

---

## 8. Conflict handling

When leave is confirmed, the app checks it against every session on the Guru's schedule.
A session conflicts if it overlaps the blocked time on the same day. The check is
deliberately strict about edges: a session ending exactly when leave begins does **not**
conflict.

Three categories of session are left out of the check:

- Sessions the Guru has **already declined** — nothing further to do.
- Sessions **already awaiting the Program Manager's decision** — asking again would
  change nothing.
- Sessions in the **past**.

If nothing conflicts, the leave is simply created and the flow ends.

If something does conflict, the Guru is shown a step titled **"This overlaps a session"**
(or "This overlaps N sessions"), listing each one with its date and time so they can see
precisely what they are about to give up. The consequence is stated in one sentence,
which changes depending on what is being given up:

> Marking this leave **declines it**. Please add a reason for the scheduler.

or, when any of the sessions falls inside the 72-hour window:

> Marking this leave **requests a cancellation for it**. Please add a reason for the
> scheduler.

### The reason is mandatory

The Guru cannot continue without one. The design position is that **a session is never
dropped silently** — someone downstream has to reassign it, and they need to know why.
The reason is stored against every affected session and shown back to the Guru later on
the Declined tab.

### Auto-decline can be turned off — in the dialog only

The dialog route carries a checkbox, **on by default**:

> **Auto-decline overlapping events**
> We'll decline them and share your reason.

Unticking it books the leave and leaves the sessions alone. The Guru is then blocked off
and still holds the session — a state the product permits deliberately, for the case
where a Guru intends to sort it out directly with the programme team. No reason is
required in that case, because nothing is being cancelled.

The drag route has no such opt-out. Choosing to mark leave over a session there is
choosing to give it up.

### Pending scheduling requests

The dialog also picks up any **pending requests** — slots the scheduling team has
proposed but the Guru has not yet answered — that fall inside the leave. These are
automatically answered "unavailable". They are not sessions yet, so no reason is
attached and no cancellation flow applies.

---

## 9. The 72-hour rule

The most consequential policy in this area.

**A session starting more than 72 hours away can be declined outright.** The Guru's word
is final. The session leaves their schedule immediately.

**A session starting within 72 hours cannot.** There is not enough time for the
scheduling team to find a replacement without help, so the Guru's decline becomes a
**request** that the Program Manager has to accept.

The Guru is warned before they get there:

> ⚠️ **This session starts within 72 hours**
> There isn't time to arrange a replacement without your help. On the next step we'll
> show you what to do.

### The instructions step

Rather than letting the Guru submit and walk away, the flow adds a step that asks them to
do the one thing the product cannot do for them:

> **Model Evaluation** starts in less than 72 hours. Before you step away, please do this:
>
> **1 · Contact your Program Manager**
> Let Bhargavi CS know so they can arrange a replacement.
> ✉ bhargavi.cs@greatlearning.in
> ☎ +91 98765 43210
> ☐ I've contacted Bhargavi CS

The email link opens a pre-addressed message with the subject already filled in —
*"Unable to take: Model Evaluation"*, or *"Unable to take 3 sessions"* for a leave
covering several. The phone number dials.

**The checkbox is a hard gate.** The "Request cancellation" button stays disabled until
it is ticked. The Guru is asserting they have done it; the product does not verify it.

### Mixed cases

A leave covering several sessions is very often mixed — some inside the window, some
outside. The app splits them automatically: sessions more than 72 hours out are declined
there and then, and only the near ones become requests. **The Guru writes one reason and
it is applied to both groups.** The summary afterwards reports both counts, for example
*"2 sessions auto-declined, 1 cancellation request sent"*.

---

## 10. What each outcome looks like afterwards

### A declined session

- Leaves the Upcoming list and the course cards.
- Appears on the Home page's **Declined** tab, with the reason shown in italics beneath
  it and a line telling the Guru how to reverse it: *"To re-accept this session, contact
  {scheduler name} at {email}."*
- On the calendar, the tile is struck through and recoloured.
- Confirmation: a toast reading **"Marked unavailable"**.

The Guru cannot un-decline a session from within the dashboard. Reversal is a
conversation with the scheduler.

### A session with a cancellation request

This is the state people most often misread, so to be explicit: **the session is still
happening.**

- It stays in Upcoming. It stays on the calendar. It is still joinable.
- The calendar tile keeps its normal colour but gains a **red border**, and the status
  reads "Cancellation requested". It is deliberately *not* struck through — the strike
  is reserved for sessions that are actually gone.
- Opening the session shows **"Waiting for your Program Manager to accept"** in place of
  the "I'm unavailable" button, so the Guru cannot request twice.
- Confirmation: a toast that **stays on screen until dismissed**, rather than fading:
  > **Cancellation requested**
  > We've let the Program Manager know about your request. You can reach out to them for
  > more information.

There is no way for the Guru to withdraw a request once sent.

### Acceptance

When the Program Manager accepts, the session becomes a normal decline — struck through,
moved to the Declined tab, reason carried across.

**In the prototype there is no Program Manager.** Acceptance is performed from the Dev
Panel, under a section headed "Cancellation requests — accept as the Program Manager to
decline the session". This is the demo's stand-in for a system that would, in production,
live on the scheduling team's side.

---

## 11. Declining one session, without leave

The shortcut. On any upcoming session, opening the details drawer offers **"I'm
unavailable"**.

This runs the same machinery as the conflict step — same reason field, same 72-hour test,
same instructions step, same outcomes — but skips everything about dates and leave
blocks. **Nothing is blocked off.** The Guru is saying "not this one", not "not this
week", so the slot stays open and the scheduling team can fill it again.

The dialog is titled "Mark unavailable" and the flow is one step for a normal decline,
two when the 72-hour rule applies.

### Answering a scheduling request

Separately, when the scheduling team proposes a slot the Guru has not yet accepted, the
request carries its own **"I'm unavailable"**. This declines an offer rather than a
commitment, so there is no reason field, no threshold and no Program Manager —
confirmation is simply *"We won't consider you for this slot."*

---

## 12. Differences by Guru role

Ten roles exist. Most behave identically here; three differences matter.

### Career Mentors get a fixed reason list

Everyone else types a reason, with six suggestions offered in a dropdown they can ignore:
Traveling for work · Personal commitment · Personal emergency · Not keeping well ·
Clashes with another session · Session is getting rescheduled.

Career Mentors instead choose from a closed list, under the heading **"Why you're
cancelling"**: Getting late due to office work · Personal emergency · Traveling for
urgent work · Not keeping well · Session is getting rescheduled · Other. They also get an
optional **More details** box — *"Add any context for the scheduler (optional)"* — and
the two are combined into the stored reason.

This mirrors the production Career Mentor cancellation flow, which is why it is a closed
list where the others are open.

### Career + Course Mentors can split their availability

The one role that wears two hats gets a third step in the availability wizard:

> **What will you do in each slot?**
> Choose whether each time is for career mentorship, course mentorship, or both.

Each availability window is then tagged **Course** (teal), **Career** (violet) or **Both**
(green), and the calendar labels and legend expand accordingly — "Available · Course"
rather than just "Available".

**Leave is never split this way.** A Guru cannot take leave from career mentoring while
staying open for course mentoring. Leave blocks everything.

### Role determines what a leave can collide with

Each role sees only its own session types — a Moderator sees moderation work, a CV Review
Mentor sees CV reviews, a Career Mentor sees career sessions and calls. This shapes the
conflict step indirectly: the sessions a leave can collide with are the ones that role
actually does.

One further Career Mentor difference: their learners **self-schedule** from the published
calendar, so they never see the "Planned activities (subject to change)" block that other
roles get.

---

## 13. Differences by Guru stage

The prototype models six points in a Guru's life, selectable from the Dev Panel. They
affect this area mainly through the availability gate.

| Stage | Availability configured? | What the Guru sees |
|---|---|---|
| **Experienced** | Yes | Everything populated — full diary, history, stats |
| **Mid (6 months)** | Yes | Partial history, a building track record |
| **Early (2 weeks)** | Yes | Upcoming sessions, no completions yet |
| **New (Day 0)** | **No** | The availability gate on Home and Calendar |
| **Empty** | **No** | The gate; once past it, every list empty |
| **Onboarding** | **No** | The first-run flow replaces the app entirely |

The practical consequence: **at New, Empty and Onboarding there is no calendar to mark
leave on**, because the grid itself is behind the gate. The Leave button in the Calendar
header remains available, so the dialog can still be opened, but there is nothing to
conflict with.

---

## 14. Status vocabulary

The words a Guru sees attached to a session, and what each one means.

| Label | Meaning |
|---|---|
| **Scheduled** / **Confirmed** | Normal. On the books. Sessions are confirmed the moment they are scheduled — confirming is not a step the Guru performs |
| **Cancellation requested** | The Guru has asked to be released from a session inside the 72-hour window. Still scheduled, still happening, awaiting the Program Manager |
| **Declined** | The Guru is off this session. Struck through on the calendar, filed on the Declined tab with its reason |
| **Completed** | Delivered |
| **Missed** | Not delivered |

And on the calendar grid specifically:

| Appearance | Meaning |
|---|---|
| Solid tile | A real session |
| Solid tile, red border | A session with a cancellation request outstanding |
| Solid tile, struck through | A declined session |
| Green dashed outline | Availability — a window being offered |
| Rose dashed outline with hatching | Leave — labelled "Not available", with the reason beneath if one was given |

---

## 15. Managing leave after the fact

Clicking any leave block on the calendar opens a small panel showing the reason (or just
"Leave"), the date range, and a "4 days" badge for multi-day leave. Two actions:

- **Edit** — reopens the leave for changes. Because the range is stored as a group, an
  edit rewrites it wholesale: the Guru can change the dates, the times, or both, and the
  number of days can grow or shrink freely.
- **Cancel leave** — asks *"Remove this leave?"* with **Keep** / **Yes, remove**, then
  confirms how many days were removed.

One behaviour worth stating plainly: **removing leave does not restore the sessions it
declined.** The decline and the leave are separate records. A Guru who books leave over
three sessions and then cancels the leave still has three declined sessions, and must
speak to the scheduler to get them back. This follows from the model — the decline was
communicated to someone downstream, and undoing it is their decision, not the Guru's.

---

## 16. Confirmations the Guru sees

Every action in this area confirms itself with a toast in the top-right. They are listed
here because they are the only feedback the product gives — there is no notification, no
inbox entry and no email generated by any of these flows.

| Action | Confirmation |
|---|---|
| Leave marked, no conflicts | "Marked unavailable" with the date range |
| Leave marked, sessions declined | "Leave marked" / "N sessions declined" |
| Leave marked, requests sent | "Cancellation requested" — stays until dismissed |
| Leave edited | "Leave updated" |
| Leave removed | "Leave cancelled" / "N days of leave removed" |
| Single session declined | "Marked unavailable" with the session title |
| Availability slot removed | "Availability slot removed" with the date and time |
| Availability saved | "Availability saved" with the pattern count |
| Program Manager accepts | "Cancellation accepted" with the session title |

The persistent cancellation toast is the only one that does not fade on its own. That is
deliberate: it carries an instruction the Guru may need to act on.

---

## 17. Seeing this in the prototype

A short walkthrough for anyone demoing it.

1. Open the **Dev Panel** (bottom right) and set the stage to **Experienced** so there is
   a full diary to collide with.
2. Go to **Calendar**, week view, on desktop.
3. **Drag down a day column** over an existing session. Switch the toggle to **Leave** and
   press Mark leave.
4. The conflict step appears, listing the session. Pick a reason.
5. If the session falls inside 72 hours, the warning and the Program Manager step follow.
   Tick the acknowledgement and send.
6. The session keeps its place on the grid with a red border. Open it — the footer reads
   "Waiting for your Program Manager to accept".
7. Return to the **Dev Panel**, find the request under **Cancellation requests**, and
   press **Accept**. The session is now struck through and appears on Home's Declined tab.

Two notes on the demo environment:

- The 72-hour test is measured against the **real current time**, while much of the
  seeded diary sits earlier than that. In practice most conflicts in a demo will be
  classified as late and route through the cancellation-request path. To see a plain
  immediate decline, mark leave over a session dated comfortably more than three days
  ahead of today.
- Leave, declines and cancellation requests are held for the session only. **Reloading
  the page returns everything to its seeded state**, which is useful for running the
  walkthrough repeatedly.

---

## 18. Summary of the rules

For anyone who needs the policy without the walkthrough:

1. A Guru with no availability has no dashboard.
2. Leave blocks time; it does not, by itself, cancel anything.
3. Leave that covers a booked session forces a decision, and that decision requires a
   written reason.
4. A multi-day leave blocks the intervening days completely; the times given bound only
   the first and last day.
5. More than 72 hours out, a Guru may decline. The session is gone immediately.
6. Within 72 hours, a Guru may only *request* cancellation, must contact the Program
   Manager themselves, and must confirm they have done so. The session remains theirs
   until the Program Manager accepts.
7. One reason covers every session affected by a single leave, whether declined or
   requested.
8. Removing leave does not undo the declines it caused.
9. Availability can be split between career and course mentoring; leave cannot.
10. Nothing in this area sends a notification. The Guru's own email or phone call to the
    Program Manager is the escalation mechanism.
