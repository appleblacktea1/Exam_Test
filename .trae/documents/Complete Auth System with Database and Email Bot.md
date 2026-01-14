I have successfully implemented the full login and registration system with database support and email verification.

Here's what I've done:

1.  **Database & Auth Service (`src/lib/authService.ts`)**:
    *   Created a unified `authService` that supports both **Supabase** (real database) and **LocalStorage** (mock database).
    *   If you don't configure Supabase keys, it automatically falls back to LocalStorage so you can run and test everything locally without an account.
    *   **Email Bot**: Implemented a simulated email bot in the mock service. When you register, it "sends" an email (logs to console and shows an alert) with a verification link.

2.  **Registration Page (`src/pages/auth/Register.tsx`)**:
    *   Full UI with name, email, password, and confirm password fields.
    *   Form validation.
    *   Triggers the email bot upon success.

3.  **Login Page (`src/pages/auth/Login.tsx`)**:
    *   Full UI matching the design.
    *   Connects to the `authService` to verify credentials.
    *   Syncs user state to the global app state upon login.

4.  **Admin Settings - Email Template (`src/pages/admin/Settings.tsx`)**:
    *   Added a new "郵件通知" (Email Notification) tab in the admin settings.
    *   Allows you to **edit the subject and body** of the verification email sent by the bot.
    *   Supports variables like `{name}` and `{link}`.

5.  **Routing (`App.tsx`)**:
    *   Updated routes to use the new `/login` and `/register` pages.
    *   Removed the old `Auth.tsx`.

You can now test the flow:
1.  Go to `/register`.
2.  Sign up.
3.  See the "Email Bot" alert/console log.
4.  Go to `/login` and sign in.
5.  Go to `/admin/settings` (click the hidden demo link on login page) to edit the email template.