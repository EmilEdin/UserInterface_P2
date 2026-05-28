# RecruitApp

**Course:** 1MD046 - User Interfaces: Programming and Evaluation  
**Created by:** Emil, Hania, Abdur and Mirza

## About the Project
RecruitApp is a dual-sided web application designed to connect companies with students for short-term employment ("gigs").

The platform provides two distinct user experiences:
1. **For Companies:** Browse a searchable pool of candidates, dynamically filter by skills/availability/city, create multiple job listings, and send direct offers to students.
2. **For Students:** Create an interactive profile, receive and manage job offers (Accept/Decline), and track ongoing or finished gigs.

## System Architecture (MVC)
The application is built strictly using Vanilla JavaScript (ES6+), HTML, and CSS, adhering to the technical constraints of the course (no external frameworks like React or Vue). 

The codebase is structured around the **Model-View-Controller (MVC)** design pattern, utilizing an **Observer pattern** to handle state changes reactively:

*   **Model (`Model.js`):** Acts as the single source of truth. It holds the application state (users, gigs, filters, UI state). It implements a `subscribe` and `notify` mechanism so that whenever data is updated (e.g., saving a gig, applying a filter, accepting an offer), it broadcasts the new state to any listeners.
*   **View (`View.js`):** Handles all the UI presentation. It receives the state from the Controller and dynamically generates the HTML using JavaScript template literals. It handles conditional rendering (e.g., showing different dashboards based on `userRole`) and dynamic lists (e.g., rendering filtered `.map()` arrays).
*   **Controller (`Controller.js`):** The bridge between the View and the Model. It subscribes to the Model's state changes to trigger View re-renders. It also binds event listeners to the DOM (clicks, form submissions) and translates user interactions into Model method calls.

## Course Requirements Fulfilled

### 1. HCI Principles
*   **Feedback:** The system utilizes empty states (e.g., "No candidates found matching your filters", "No ongoing gigs") so the user is never left staring at a blank screen. System alerts confirm when offers are sent.
*   **Error Prevention:** Destructive actions, such as deleting a gig or a user profile, are protected by `confirm()` dialogs. HTML5 `required` attributes prevent incomplete forms from being submitted.
*   **Affordances:** Interactive elements are clearly styled. Buttons feature hover states and pointer cursors, while the navigation tabs visually indicate the currently active section.

### 2. Technical Implementation
*   **Computer Graphics:** The application integrates a custom HTML5 Canvas (`<canvas id="bg-canvas">`) on the home screen, initialized via JavaScript to provide an interactive/animated background.
*   **Internationalization (i18n):** The interface fully supports both English (EN) and Swedish (SV). A dropdown in the header allows users to toggle the language in real-time, pulling strings from a centralized `i18n.js` dictionary.
*   **Accessibility (a11y):** The interface is designed with accessibility in mind. Interactive elements include `aria-label` and `aria-expanded` attributes for screen readers. Profile cards utilize `tabindex="0"` and `:focus-within` CSS states to support keyboard-only navigation. Responsive CSS ensures readability across mobile and desktop devices.

## How to Run
1. Clone or download the repository.
2. Since the project uses ES6 Modules (`import`/`export`), it needs to be served via a local web server to avoid CORS issues.
3. You can use an extension like **Live Server** in VS Code, or run a simple Python server from the project directory:
   `python -m http.server 8000`
4. Open your browser and navigate to `http://localhost:8000`.
