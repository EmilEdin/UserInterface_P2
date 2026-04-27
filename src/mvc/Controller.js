import { Model } from './Model.js';
import { View } from './View.js';
import { initCanvasBg } from '../canvas-fx.js';

export class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.model.subscribe((state) => this.update(state));
    this.update(this.model.state);
  }

  update(state) {
    this.view.render(state);
    this.bindEvents(state);

    if (state.page === 'home') {
      initCanvasBg('bg-canvas');
    }

    if (state.page === 'dashboard' && state.userRole === 'company' && state.tab === 'search') {
      // Logic for grid updates if needed
    }
  }

  bindEvents(state) {
    const langSelect = document.getElementById('lang-switch');
    if (langSelect) {
      langSelect.addEventListener('change', (e) => {
        this.model.setLang(e.target.value);
      });
    }

    document.getElementById('btn-for-company')?.addEventListener('click', () => {
      this.model.setPage('dashboard', 'company');
    });
    
    document.getElementById('btn-for-student')?.addEventListener('click', () => {
      this.model.setPage('dashboard', 'student');
    });

    document.getElementById('logout-btn')?.addEventListener('click', () => {
      this.model.logout();
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        if (tab) this.model.setTab(tab);
      });
    });

    document.querySelectorAll('.expand-profile-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.dataset.id);
        this.model.toggleProfileExpand(id);
      });
    });

    document.querySelectorAll('.expand-gig-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.dataset.id);
        this.model.toggleGigExpand(id);
      });
    });

    document.getElementById('go-to-create-gig-btn')?.addEventListener('click', () => {
      this.model.setTab('createGig');
    });

    document.getElementById('cancel-create-gig')?.addEventListener('click', () => {
      this.model.setTab('myGigs');
    });

    document.getElementById('create-new-profile-btn')?.addEventListener('click', () => {
      this.model.setTab('createProfile');
    });

    document.getElementById('cancel-create-profile')?.addEventListener('click', () => {
      this.model.setTab('profiles');
    });

    document.querySelectorAll('.delete-profile-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.dataset.id);
        if(confirm("Are you sure you want to delete this profile?")) {
           this.model.deleteProfile(id);
        }
      });
    });

    document.querySelectorAll('.select-profile-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.select-profile-btn').forEach(b => {
           b.textContent = 'Select';
        });
        e.currentTarget.textContent = 'Selected ✓';
      });
    });

    document.querySelectorAll('.send-offer-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.dataset.id);
        const select = document.getElementById(`gig-select-${id}`);
        this.model.sendOffer(id, select.value);
      });
    });

    document.querySelectorAll('.accept-offer-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.dataset.id);
        this.model.acceptOffer(id);
      });
    });

    document.querySelectorAll('.decline-offer-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.dataset.id);
        this.model.declineOffer(id);
      });
    });

    const studentForm = document.getElementById('student-profile-form');
    if (studentForm) {
      studentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(studentForm);
        const data = Object.fromEntries(formData.entries());
        this.model.saveProfile(data);
      });
    }
  }
}
