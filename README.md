# Shared Components

## Overview

This document records the reusable UI components identified by reviewing the available screens in the Taskly application. The components below were selected because they appear on multiple screens and have a consistent purpose, behavior, or layout pattern. We did not treat visually similar elements as shared components unless they were used as the same reusable interface pattern.

The screen references in this document are based on the images stored in the `docs/` folder.

## Shared Components

| #   | Component           | Description                                                                  | Used In                                                                                                                                                                                          | Screenshot                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| --- | ------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Header              | Public authentication header with the Taskly brand.                          | Login, Register, Forgot Password, Reset Password                                                                                                                                                 | [Login](<docs/Login%20(Desktop).png>) [Register](<docs/Sign%20Up%20(Desktop).png>) [Forgot Password](<docs/Forgot%20Password%20(Desktop).png>) [Reset Password](<docs/Reset%20Password%20(Desktop).png>)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 2   | AuthCard            | Centered form container used across authentication and project forms.        | Login, Register, Forgot Password, Reset Password, Add Project, Edit Project                                                                                                                      | [Login](<docs/Login%20(Desktop).png>) [Register](<docs/Sign%20Up%20(Desktop).png>) [Forgot Password](<docs/Forgot%20Password%20(Desktop).png>) [Reset Password](<docs/Reset%20Password%20(Desktop).png>) [Add Project](<docs/Add%20New%20Project%20(Desktop).png>) [Edit Project](<docs/Edit%20Project%20(Desktop).png>)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 3   | FormField           | Standard labeled input used for text and email entry.                        | Login, Register, Forgot Password, Reset Password, Add Project, Edit Project, Add New Task, Add New Epic                                                                                          | [Login](<docs/Login%20(Desktop).png>) [Register](<docs/Sign%20Up%20(Desktop).png>) [Forgot Password](<docs/Forgot%20Password%20(Desktop).png>) [Reset Password](<docs/Reset%20Password%20(Desktop).png>) [Add Project](<docs/Add%20New%20Project%20(Desktop).png>) [Edit Project](<docs/Edit%20Project%20(Desktop).png>) [Add New Task](<docs/Add%20New%20Task%20(Desktop).png>) [Add New Epic](<docs/Add%20New%20Epic%20(Desktop).png>)                                                                                                                                                                                                                                                                                                                                                                            |
| 4   | PasswordField       | Password input with visibility toggle and validation state.                  | Login, Register, Reset Password                                                                                                                                                                  | [Login](<docs/Login%20(Desktop).png>) [Register](<docs/Sign%20Up%20(Desktop).png>) [Reset Password](<docs/Reset%20Password%20(Desktop).png>)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 5   | Button              | Primary action button for form submissions and navigation actions.           | Login, Register, Forgot Password, Reset Password                                                                                                                                                 | [Login](<docs/Login%20(Desktop).png>) [Register](<docs/Sign%20Up%20(Desktop).png>) [Forgot Password](<docs/Forgot%20Password%20(Desktop).png>) [Reset Password](<docs/Reset%20Password%20(Desktop).png>)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 6   | FooterLink          | Secondary text link for switching between authentication screens.            | Login, Register, Reset Password                                                                                                                                                                  | [Login](<docs/Login%20(Desktop).png>) [Register](<docs/Sign%20Up%20(Desktop).png>) [Reset Password](<docs/Reset%20Password%20(Desktop).png>)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 7   | AuthenticatedLayout | Shared application shell for all authenticated screens.                      | Projects, Add Project, Edit Project, Project Members, Invite Member Popup, Project Epics, Epic Details Popup, Add New Epic, Add New Task, Project Tasks Board, Tasks Calendar, Project Analytics | [Projects](<docs/Projects%20List%20(Desktop).png>) [Add Project](<docs/Add%20New%20Project%20(Desktop).png>) [Edit Project](<docs/Edit%20Project%20(Desktop).png>) [Project Members](<docs/Project%20Members%20List%20(Desktop).png>) [Invite Member Popup](<docs/Invite%20Member%20Popup%20(Desktop).png>) [Project Epics](<docs/Project%20Epics%20List%20(Desktop).png>) [Epic Details Popup](<docs/Epic%20Details%20Popup%20(Desktop).png>) [Add New Epic](<docs/Add%20New%20Epic%20(Desktop).png>) [Add New Task](<docs/Add%20New%20Task%20(Desktop).png>) [Project Tasks Board](<docs/Project%20Tasks%20Board%20(Desktop).png>) [Tasks Calendar](<docs/Tasks%20Calendar%20%26%20Project%20Analytics%20(Desktop).png>) [Project Analytics](<docs/Tasks%20Calendar%20%26%20Project%20Analytics%20(Desktop).png>) |
| 8   | Navbar              | Top navigation bar for authenticated screens.                                | Projects, Add Project, Edit Project, Project Members, Project Epics, Project Tasks, Analytics                                                                                                    | [Projects](<docs/Projects%20List%20(Desktop).png>) [Add Project](<docs/Add%20New%20Project%20(Desktop).png>) [Edit Project](<docs/Edit%20Project%20(Desktop).png>) [Project Members](<docs/Project%20Members%20List%20(Desktop).png>) [Project Epics](<docs/Project%20Epics%20List%20(Desktop).png>) [Project Tasks](<docs/Project%20Tasks%20Board%20(Desktop).png>) [Analytics](<docs/Tasks%20Calendar%20%26%20Project%20Analytics%20(Desktop).png>)                                                                                                                                                                                                                                                                                                                                                               |
| 9   | Sidebar             | Desktop navigation panel across project and dashboard flows.                 | Projects, Add Project, Edit Project, Project Members, Project Epics, Project Tasks, Analytics                                                                                                    | [Projects](<docs/Projects%20List%20(Desktop).png>) [Add Project](<docs/Add%20New%20Project%20(Desktop).png>) [Edit Project](<docs/Edit%20Project%20(Desktop).png>) [Project Members](<docs/Project%20Members%20List%20(Desktop).png>) [Project Epics](<docs/Project%20Epics%20List%20(Desktop).png>) [Project Tasks](<docs/Project%20Tasks%20Board%20(Desktop).png>) [Analytics](<docs/Tasks%20Calendar%20%26%20Project%20Analytics%20(Desktop).png>)                                                                                                                                                                                                                                                                                                                                                               |
| 10  | MobileDrawer        | Mobile navigation overlay used within the authenticated layout.              | Projects, Mobile Project Views                                                                                                                                                                   | [Projects](<docs/Projects%20List%20(Desktop).png>) [Mobile Project Views](<docs/Projects%20List%20(Desktop).png>)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 11  | BottomNav           | Fixed lower navigation for mobile authenticated views.                       | Projects, Mobile Project Views                                                                                                                                                                   | [Projects](<docs/Projects%20List%20(Desktop).png>) [Mobile Project Views](<docs/Projects%20List%20(Desktop).png>)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 12  | SidebarNavItem      | Shared navigation row with icon and label.                                   | Projects, Project Members                                                                                                                                                                        | [Projects](<docs/Projects%20List%20(Desktop).png>) [Project Members](<docs/Project%20Members%20List%20(Desktop).png>)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 13  | ProjectAccordion    | Expandable project list used in navigation shells.                           | Projects, Project Members                                                                                                                                                                        | [Projects](<docs/Projects%20List%20(Desktop).png>) [Project Members](<docs/Project%20Members%20List%20(Desktop).png>)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 14  | PageHeader          | Reusable page title block for project-related screens.                       | Add Project, Edit Project                                                                                                                                                                        | [Add Project](<docs/Add%20New%20Project%20(Desktop).png>) [Edit Project](<docs/Edit%20Project%20(Desktop).png>)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 15  | FormSectionHeader   | Reusable section heading with icon and description for grouped form content. | Add Project, Edit Project                                                                                                                                                                        | [Add Project](<docs/Add%20New%20Project%20(Desktop).png>) [Edit Project](<docs/Edit%20Project%20(Desktop).png>)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 16  | TextAreaField       | Multi-line input used for descriptions and notes.                            | Add Project, Edit Project, Add New Task, Add New Epic                                                                                                                                            | [Add Project](<docs/Add%20New%20Project%20(Desktop).png>) [Edit Project](<docs/Edit%20Project%20(Desktop).png>) [Add New Task](<docs/Add%20New%20Task%20(Desktop).png>) [Add New Epic](<docs/Add%20New%20Epic%20(Desktop).png>)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 17  | FormActions         | Shared action row for saving or canceling form operations.                   | Add Project, Edit Project                                                                                                                                                                        | [Add Project](<docs/Add%20New%20Project%20(Desktop).png>) [Edit Project](<docs/Edit%20Project%20(Desktop).png>)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 18  | Pagination          | Reusable page navigation for list-based data views.                          | Projects                                                                                                                                                                                         | [Projects](<docs/Projects%20List%20(Desktop).png>)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

## Detailed Component Notes

### Header

The Header is a public shared component used at the top of the authentication screens. It keeps branding and layout consistent across the login, register, forgot password, and reset password flows.

- Used in: Login, Register, Forgot Password, Reset Password
- Screens:
  - ![Login](<docs/Login%20(Desktop).png>)
  - ![Sign Up](<docs/Sign%20Up%20(Desktop).png>)
  - ![Forgot Password](<docs/Forgot%20Password%20(Desktop).png>)
  - ![Reset Password](<docs/Reset%20Password%20(Desktop).png>)

### AuthCard

AuthCard provides a consistent container for authentication and small form experiences. It is reused because the same card layout, spacing, and visual hierarchy appear across multiple pages, including project creation and editing forms.

- Used in: Login, Register, Forgot Password, Reset Password, Add Project, Edit Project
- Screens:
  - ![Login](<docs/Login%20(Desktop).png>)
  - ![Sign Up](<docs/Sign%20Up%20(Desktop).png>)
  - ![Forgot Password](<docs/Forgot%20Password%20(Desktop).png>)
  - ![Reset Password](<docs/Reset%20Password%20(Desktop).png>)
  - ![Add Project](<docs/Add%20New%20Project%20(Desktop).png>)
  - ![Edit Project](<docs/Edit%20Project%20(Desktop).png>)

### FormField

FormField should be treated as a shared primitive because it is a recurring input pattern for user entry across form-heavy screens. It supports consistent labels, required indicators, hints, and validation styling.

- Used in: Login, Register, Forgot Password, Reset Password, Add Project, Edit Project, Add New Task, Add New Epic
- Screens:
  - ![Login](<docs/Login%20(Desktop).png>)
  - ![Sign Up](<docs/Sign%20Up%20(Desktop).png>)
  - ![Forgot Password](<docs/Forgot%20Password%20(Desktop).png>)
  - ![Reset Password](<docs/Reset%20Password%20(Desktop).png>)
  - ![Add Project](<docs/Add%20New%20Project%20(Desktop).png>)
  - ![Edit Project](<docs/Edit%20Project%20(Desktop).png>)
  - ![Add New Task](<docs/Add%20New%20Task%20(Desktop).png>)
  - ![Add New Epic](<docs/Add%20New%20Epic%20(Desktop).png>)

### PasswordField

PasswordField is a specialized variant of the shared input pattern. It is reusable because it appears consistently on credential-related screens and includes the same visibility toggle and validation behavior.

- Used in: Login, Register, Reset Password
- Screens:
  - ![Login](<docs/Login%20(Desktop).png>)
  - ![Sign Up](<docs/Sign%20Up%20(Desktop).png>)
  - ![Reset Password](<docs/Reset%20Password%20(Desktop).png>)

### Button

Button is a foundational action component used wherever a primary action is required in a form. It appears repeatedly across authentication screens and should stay consistent in size, styling, and state behavior.

- Used in: Login, Register, Forgot Password, Reset Password
- Screens:
  - ![Login](<docs/Login%20(Desktop).png>)
  - ![Sign Up](<docs/Sign%20Up%20(Desktop).png>)
  - ![Forgot Password](<docs/Forgot%20Password%20(Desktop).png>)
  - ![Reset Password](<docs/Reset%20Password%20(Desktop).png>)

### FooterLink

FooterLink is a reusable secondary action component that helps users move between authentication states without duplicating copy or interaction behavior.

- Used in: Login, Register, Reset Password
- Screens:
  - ![Login](<docs/Login%20(Desktop).png>)
  - ![Sign Up](<docs/Sign%20Up%20(Desktop).png>)
  - ![Reset Password](<docs/Reset%20Password%20(Desktop).png>)

### AuthenticatedLayout

AuthenticatedLayout acts as the shared application shell for all protected pages. It groups the main navigation, layout spacing, and content container into a single reusable structure across project management screens.

- Used in: Projects, Add Project, Edit Project, Project Members, Project Epics, Project Tasks, Analytics
- Screens:
  - ![Projects List](<docs/Projects%20List%20(Desktop).png>)
  - ![Add Project](<docs/Add%20New%20Project%20(Desktop).png>)
  - ![Edit Project](<docs/Edit%20Project%20(Desktop).png>)
  - ![Project Members List](<docs/Project%20Members%20List%20(Desktop).png>)
  - ![Invite Member Popup](<docs/Invite%20Member%20Popup%20(Desktop).png>)
  - ![Project Epics List](<docs/Project%20Epics%20List%20(Desktop).png>)
  - ![Epic Details Popup](<docs/Epic%20Details%20Popup%20(Desktop).png>)
  - ![Add New Epic](<docs/Add%20New%20Epic%20(Desktop).png>)
  - ![Add New Task](<docs/Add%20New%20Task%20(Desktop).png>)
  - ![Project Tasks Board](<docs/Project%20Tasks%20Board%20(Desktop).png>)
  - ![Tasks Calendar and Project Analytics](<docs/Tasks%20Calendar%20%26%20Project%20Analytics%20(Desktop).png>)

### Navbar, Sidebar, MobileDrawer, BottomNav

These navigation components work together as a responsive authenticated shell. They are reusable because they provide the same core behavior across the app: navigation, project selection, and user context, while adapting by screen size.

- Navbar: all authenticated screens
- Sidebar: desktop authenticated screens
- MobileDrawer: mobile authenticated screens
- BottomNav: mobile authenticated screens

Reference screenshot:

![Projects List](<docs/Projects%20List%20(Desktop).png>)

### SidebarNavItem and ProjectAccordion

These are lower-level navigation building blocks. They are reusable because they appear as part of the same feature set: item styling, state management, and project grouping across desktop and mobile navigation.

- Used by: Sidebar, MobileDrawer
- Reference screenshot:

![Projects List](<docs/Projects%20List%20(Desktop).png>)

### PageHeader

PageHeader is a consistent document title block used by create and edit flows. It is reusable because project-related screens often share the same page-title rhythm, spacing, and hierarchy.

- Used in: Add Project, Edit Project
- Screens:
  - ![Add Project](<docs/Add%20New%20Project%20(Desktop).png>)
  - ![Edit Project](<docs/Edit%20Project%20(Desktop).png>)

### FormSectionHeader

FormSectionHeader is a reusable group heading used to separate longer forms into clear sections such as project information or details. It provides a consistent title, icon, and optional description layout.

- Used in: Add Project, Edit Project
- Screens:
  - ![Add Project](<docs/Add%20New%20Project%20(Desktop).png>)
  - ![Edit Project](<docs/Edit%20Project%20(Desktop).png>)

### TextAreaField

TextAreaField is a shared multiline input used for longer content like descriptions and notes. It is reusable in forms where the content is not limited to a single line and benefits from validation and counter behavior.

- Used in: Add Project, Edit Project, Add New Task, Add New Epic
- Screens:
  - ![Add Project](<docs/Add%20New%20Project%20(Desktop).png>)
  - ![Edit Project](<docs/Edit%20Project%20(Desktop).png>)
  - ![Add New Task](<docs/Add%20New%20Task%20(Desktop).png>)
  - ![Add New Epic](<docs/Add%20New%20Epic%20(Desktop).png>)

### FormActions

FormActions is a reusable action row for forms with confirm/cancel patterns. It is useful when multiple screens need the same final actions without duplicating layout or button behavior.

- Used in: Add Project, Edit Project
- Screens:
  - ![Add Project](<docs/Add%20New%20Project%20(Desktop).png>)
  - ![Edit Project](<docs/Edit%20Project%20(Desktop).png>)

### Pagination

Pagination is a shared list-control component used to move between pages of items. It is reusable because project lists and similar collections need the same pattern of previous/next navigation and page state.

- Used in: Projects
- Screens:
  - ![Projects List](<docs/Projects%20List%20(Desktop).png>)

## Conclusion

The shared components in this project are not only visually similar—they are reused because they carry consistent purpose and behavior across screens. The most important reusable patterns are the authentication form primitives and the authenticated navigation shell. Keeping these as shared components reduces duplication and ensures a more consistent user experience across the app.
