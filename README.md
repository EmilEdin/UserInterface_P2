# RecruitApp

**Course:** 1MD046 - User Interfaces: Programming and Evaluation  
**Created by:** Emil, Hania, Abdur and Mirza

## About the Project
RecruitApp is a dual-sided web application designed to connect companies with students for short-term employment ("gigs").

The platform provides two distinct user experiences:
1. **For Companies:** Browse a searchable pool of candidates, dynamically filter by skills/availability/city, create multiple job listings, and send direct offers to students.
2. **For Students:** Create an interactive profile, receive and manage job offers (Accept/Decline), and track ongoing or finished gigs.

## System Architecture (MVC)
The application is built strictly using Vanilla JavaScript, HTML, and CSS, adhering to the technical constraints of the course (no external frameworks like React or Vue). 

The codebase is structured around the **Model-View-Controller (MVC)** design pattern

*   **Model (`Model.js`):** Acts as the single source of truth. It holds the application state (users, gigs, filters, UI state). It implements a `subscribe` and `notify` mechanism so that whenever data is updated (e.g., saving a gig, applying a filter, accepting an offer), it broadcasts the new state to any listeners.
*   **View (`View.js`):** Handles all the UI presentation. It receives the state from the Controller and dynamically generates the HTML using JavaScript template literals. It handles conditional rendering (e.g., showing different dashboards based on `userRole`) and dynamic lists (e.g., rendering filtered `.map()` arrays).
*   **Controller (`Controller.js`):** The bridge between the View and the Model. It subscribes to the Model's state changes to trigger View re-renders. It also binds event listeners to the DOM (clicks, form submissions) and translates user interactions into Model method calls.

## How to Run
1. Clone or download the repository.
2. Since the project uses ES6 Modules (`import`/`export`), it needs to be served via a local web server to avoid CORS issues.
3. You can use an extension like **Live Server** in VS Code!
