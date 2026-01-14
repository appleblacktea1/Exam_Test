I have successfully updated all pages to be fully responsive (RWD) for Desktop, Tablet, and Mobile.

Here is a summary of the changes:

1.  **Layout & Navigation (`MainLayout.tsx`)**:
    *   **Desktop**: Added a persistent **Sidebar Navigation** on the left.
    *   **Mobile/Tablet**: Kept the **Bottom Navigation**, but hid it on larger screens.
    *   **Container**: Expanded the main content area width for Desktop (up to `max-w-7xl`).

2.  **Home Page (`Home.tsx`)**:
    *   **Featured Exams**: Now displays as a 4-column grid on Desktop (was 2).
    *   **Courses**: Switched from horizontal scroll to a grid on Desktop.
    *   **Categories**: Expanded to 6-8 columns on Desktop.

3.  **Arena Page (`Arena.tsx`)**:
    *   **Layout**: Transformed into a **2-column layout** on Desktop.
        *   Left: User Stats & Match Settings.
        *   Right: Leaderboard & History.
    *   **Mobile**: Maintains the stacked vertical layout.

4.  **Academy Page (`Academy.tsx`)**:
    *   **Quick Actions**: Expanded to 4 columns on Desktop.
    *   **Course Lists**: Switched to responsive grids instead of simple lists.

5.  **Shop Page (`Shop.tsx`)**:
    *   **Items**: Grid expands to 6 columns on large screens.
    *   **Bundles**: Displays side-by-side on Desktop.

6.  **Profile Page (`Profile.tsx`)**:
    *   **Layout**: Transformed into a **2-column layout** on Desktop.
        *   Left: Stats Grid & Study Data.
        *   Right: Badges, Learning Journey, and Menu.

The project has been rebuilt (`npm run build`) successfully, confirming no syntax errors. You can now preview the app in any screen size.