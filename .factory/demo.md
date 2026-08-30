# Limited Night Planner demo

Open [the demo](/demo/) or use **Try it with sample data** on the landing page.
`?demo=1` also opens the sample plan for catalog links.

The demo starts on a finished five-player event called **Saturday mixed box
night**. It includes 300 compatible components, one excluded uncertainty box,
direct pools of 45, a reserve of 12, five seating rounds with byes, host notes,
and a printable host sheet.

Demo data is stored only in the IndexedDB database named
`limited-night-planner-demo`; ordinary plans use `limited-night-planner`.
The persistent demo banner has **Reset demo** and **Start for real** actions.
Starting for real clears the demo plan and navigates to the blank real planner,
so sample edits never read or write ordinary plan data.
