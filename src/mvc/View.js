import { translations } from '../i18n.js';

export class View {
  constructor() {
    this.app = document.getElementById('root');
  }

  t(state, key) {
    return translations[state.lang]?.[key] || key;
  }

  render(state) {
    if (!this.app) return;
    if (state.page === 'home') {
      this.app.innerHTML = this.renderHome(state);
    } else if (state.page === 'dashboard') {
      if (state.userRole === 'company') {
        this.app.innerHTML = this.renderCompanyDashboard(state);
      } else {
        this.app.innerHTML = this.renderStudentDashboard(state);
      }
    }
  }

  renderHeader(state) {
     return `
      <header class="app-header">
        <h1 class="logo">RecruitApp</h1>
        <div class="header-actions">
           <select id="lang-switch" aria-label="Language selector">
              <option value="en" ${state.lang === 'en' ? 'selected' : ''}>EN</option>
              <option value="sv" ${state.lang === 'sv' ? 'selected' : ''}>SV</option>
           </select>
           ${state.userRole ? `<button id="logout-btn" class="btn outline">${this.t(state, 'logout')}</button>` : ''}
        </div>
      </header>
     `;
  }

  renderHome(state) {
    return `
      ${this.renderHeader(state)}
      <main class="home-container" id="home-main">
        <canvas id="bg-canvas" aria-hidden="true"></canvas>
        <div class="hero-content">
          <h2 class="hero-title">${this.t(state, 'tired')}</h2>
          <div class="hero-buttons">
            <button id="btn-for-company" class="btn primary large">${this.t(state, 'forCompany')}</button>
            <button id="btn-for-student" class="btn outline large">${this.t(state, 'forStudent')}</button>
          </div>
        </div>
      </main>
    `;
  }

  renderCompanyDashboard(state) {
    return `
      ${this.renderHeader(state)}
      <div class="dashboard">
        <nav class="dashboard-nav">
          <button class="tab-btn ${state.tab === 'search' ? 'active' : ''}" data-tab="search">${this.t(state, 'searchPool')}</button>
          <button class="tab-btn ${state.tab === 'myGigs' ? 'active' : ''}" data-tab="myGigs">${this.t(state, 'myGigs')}</button>
          <button class="tab-btn ${state.tab === 'history' ? 'active' : ''}" data-tab="history">${this.t(state, 'history')}</button>
        </nav>
        <div class="dashboard-content">
          ${state.tab === 'search' ? this.renderCompanySearch(state) : ''}
          ${state.tab === 'myGigs' ? this.renderCompanyGigs(state) : ''}
          ${state.tab === 'history' ? this.renderCompanyHistory(state) : ''}
          ${state.tab === 'createGig' ? this.renderCreateGigForm(state) : ''}
        </div>
      </div>
    `;
  }

  renderCompanySearch(state) {
    return `
      <aside class="filters-sidebar">
        <h3>${this.t(state, 'filters')}</h3>
        <div class="filter-group">
          <label>${this.t(state, 'industry')}</label>
          <select aria-label="${this.t(state, 'industry')}">
            <option value="">All Industries</option>
            <option value="Administration">Administration</option>
            <option value="Construction">Construction</option>
            <option value="Education">Education</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Hospitality">Hospitality</option>
            <option value="IT">IT</option>
            <option value="Sales">Sales</option>
          </select>
        </div>
        <div class="filter-group">
          <label>${this.t(state, 'availability')}</label>
          <input type="text" placeholder="e.g. Weekends" aria-label="${this.t(state, 'availability')}">
        </div>
        <div class="filter-group">
          <label>${this.t(state, 'education')}</label>
          <input type="text" placeholder="e.g. University" aria-label="${this.t(state, 'education')}">
        </div>
        <div class="filter-group">
          <label>${this.t(state, 'minRating')}</label>
          <input type="number" min="0" max="10" placeholder="0-10" aria-label="${this.t(state, 'minRating')}">
        </div>
        <div class="filter-group">
          <label>${this.t(state, 'minPay')}</label>
          <input type="number" placeholder="100" aria-label="${this.t(state, 'minPay')}">
        </div>
        <div class="filter-group">
          <label>${this.t(state, 'languages')}</label>
          <input type="text" placeholder="e.g. EN, SV" aria-label="${this.t(state, 'languages')}">
        </div>
        <div class="filter-group">
          <label>${this.t(state, 'city')}</label>
          <input type="text" placeholder="e.g. Stockholm" aria-label="${this.t(state, 'city')}">
        </div>
        <button class="btn primary apply-filters-btn">${this.t(state, 'apply')}</button>
      </aside>
      <div class="main-panel">
        ${state.students.map((student) => this.renderStudentCard(state, student)).join('')}
      </div>
    `;
  }

  renderStudentCard(state, student) {
    const isExpanded = state.expandedProfiles[student.id];
    return `
      <article class="profile-card" tabindex="0">
        <div class="profile-min">
          <img src="${student.photo}" alt="${student.name}" class="profile-photo"/>
          <div class="profile-info">
            <h3>${student.name}</h3>
            <p><strong>${student.title}</strong> | ${student.availability} | <strong>${this.t(state, 'minPay')}:</strong> ${student.minPay || 'N/A'}</p>
            <p>${student.bio}</p>
          </div>
          <button class="expand-profile-btn" data-id="${student.id}" aria-expanded="${!!isExpanded}" aria-label="${isExpanded ? this.t(state, 'showLess') : this.t(state, 'showMore')}">
            ${isExpanded ? '▲' : '▼'}
          </button>
        </div>
        ${isExpanded ? `
          <div class="profile-expanded">
            <p><strong>${this.t(state, 'aboutMe')}:</strong> ${student.aboutMe || student.bio}</p>
            <p><strong>${this.t(state, 'workExperience')}:</strong> ${student.workExperience || 'N/A'}</p>
            <p><strong>${this.t(state, 'education')}:</strong> ${student.education || 'N/A'}</p>
            <p><strong>${this.t(state, 'languages')}:</strong> ${student.languages?.join(', ') || 'N/A'}</p>
            <p><strong>${this.t(state, 'minPay')}:</strong> ${student.minPay || 'N/A'}</p>
            <p><strong>${this.t(state, 'additionalInfo')}:</strong> ${student.additionalInfo || 'N/A'}</p>
            <br>
            <p><strong>${this.t(state, 'skills')}:</strong></p>
            <div class="skills-keywords">
              ${student.skills?.map((s) => `<span class="skill-pill">${s}</span>`).join('') || ''}
            </div>
            <br>
            <a href="#" class="btn outline" aria-label="${this.t(state, 'downloadCV')}">📄 ${this.t(state, 'downloadCV')}</a>
            
            <div class="offer-section">
              <select id="gig-select-${student.id}" aria-label="${this.t(state, 'selectGig')}">
                ${state.companyGigs.filter((g) => g.status === 'ready').map((g) => `<option value="${g.id}">${g.title}</option>`).join('')}
              </select>
              <button class="btn primary send-offer-btn" data-id="${student.id}">${this.t(state, 'sendOffer')}</button>
            </div>
          </div>
        ` : ''}
      </article>
    `;
  }

  renderCompanyGigs(state) {
    const readyGigs = state.companyGigs.filter(g => g.status === 'ready');
    const sentGigs = state.companyGigs.filter(g => g.status === 'sent');
    
    return `
      <section class="gigs-panel" style="width: 100%; max-width: 900px; margin: 0 auto;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 2rem; align-items: center;">
          <h2>${this.t(state, 'myGigs')}</h2>
          <button class="btn primary" id="go-to-create-gig-btn">${this.t(state, 'createGigBtn')}</button>
        </div>
        
        <div class="gigs-section">
          <h3>${this.t(state, 'readyGigs')}</h3>
          <div class="gigs-list">
             ${readyGigs.length ? readyGigs.map(g => this.renderCompanyGigCard(state, g)).join('') : `<p class="empty-list">No ready gigs</p>`}
          </div>
        </div>

        <div class="gigs-section" style="margin-top: 2rem;">
          <h3>${this.t(state, 'sentGigs')}</h3>
          <div class="gigs-list">
             ${sentGigs.length ? sentGigs.map(g => this.renderCompanyGigCard(state, g)).join('') : `<p class="empty-list">No sent gigs</p>`}
          </div>
        </div>
      </section>
    `;
  }

  renderCompanyGigCard(state, gig) {
    const isExpanded = state.expandedGigs[gig.id];
    return `
      <div class="gig-card items-center" style="flex-direction: column;">
         <div class="gig-min">
           <div style="flex: 1;">
              <h4>${gig.title}</h4>
              <p class="text-sm text-slate-500">${this.t(state, 'date')}: ${gig.date} | ${this.t(state, 'duration')}: ${gig.duration} | ${this.t(state, 'salary')}: ${gig.salary}</p>
              ${gig.sentTo ? `<p class="text-sm text-slate-500 mt-1">Sent to: <strong>${gig.sentTo}</strong></p>` : ''}
           </div>
           <div style="display: flex; gap: 0.5rem; align-items: center;">
              <button class="btn outline">${this.t(state, 'edit')}</button>
              <button class="expand-gig-btn" data-id="${gig.id}" aria-label="Expand">
                ${isExpanded ? '▲' : '▼'}
              </button>
           </div>
         </div>
         ${isExpanded ? `
         <div class="gig-expanded">
            <h5 style="margin-bottom: 0.5rem; color: var(--primary);">${this.t(state, 'jobAd')}</h5>
            <div class="gig-ad-content text-sm">
                <p style="margin-bottom: 1rem; font-size: 1rem;">${gig.description}</p>
                <div class="gig-ad-grid">
                    <div><strong>${this.t(state, 'dresscode')}:</strong><br>${gig.dresscode}</div>
                    <div><strong>${this.t(state, 'languages')}:</strong><br>${gig.language}</div>
                    <div><strong>${this.t(state, 'contactInfo')}:</strong><br>${gig.contactInfo}</div>
                </div>
            </div>
         </div>
         ` : ''}
      </div>
    `;
  }

  renderCreateGigForm(state) {
    return `
      <section class="create-gig-form">
        <h3>${this.t(state, 'createGigBtn')}</h3>
        <form class="student-form">
          <fieldset>
             <legend>Gig Basics</legend>
             <div class="form-grid">
               <input type="text" placeholder="Gig Title" required>
               <input type="text" placeholder="${this.t(state, 'salary')} (e.g. 150 SEK/h)" required>
               <input type="text" placeholder="${this.t(state, 'date')} (e.g. 2026-05-15)" required>
               <input type="text" placeholder="${this.t(state, 'duration')} (e.g. 1 evening)" required>
             </div>
          </fieldset>
          <fieldset>
             <legend>${this.t(state, 'fullDescription')}</legend>
             <textarea rows="4" placeholder="Describe the job role and expectations..."></textarea>
          </fieldset>
          <fieldset>
             <legend>Requirements</legend>
             <div class="form-grid">
               <input type="text" placeholder="${this.t(state, 'dresscode')}">
               <input type="text" placeholder="${this.t(state, 'languages')}">
             </div>
          </fieldset>
          <fieldset>
             <legend>Logistics</legend>
             <div class="form-grid">
               <input type="text" placeholder="${this.t(state, 'contactInfo')}">
               <input type="date" placeholder="${this.t(state, 'deadline')}">
             </div>
          </fieldset>
          <div style="display: flex; justify-content: flex-end; gap: 1rem;">
             <button type="button" class="btn outline" id="cancel-create-gig">Cancel</button>
             <button type="submit" class="btn primary">Save Gig</button>
          </div>
        </form>
      </section>
    `;
  }

  renderCompanyHistory(state) {
    const finishedGigs = state.historyGigs || [];
    return `
      <section class="gigs-panel" style="width: 100%; max-width: 900px; margin: 0 auto;">
        <h2 style="margin-bottom: 2rem;">${this.t(state, 'history')}</h2>
        
        <div class="gigs-list">
             ${finishedGigs.length ? finishedGigs.map(g => this.renderCompanyGigCard(state, g)).join('') : `<p class="empty-list">No finished gigs</p>`}
        </div>
      </section>
    `;
  }

  renderStudentDashboard(state) {
    return `
      ${this.renderHeader(state)}
      <div class="dashboard">
        <nav class="dashboard-nav">
          <button class="tab-btn ${state.tab === 'profiles' || state.tab === 'createProfile' ? 'active' : ''}" data-tab="profiles">${this.t(state, 'profiles')}</button>
          <button class="tab-btn ${state.tab === 'myGigs' ? 'active' : ''}" data-tab="myGigs">${this.t(state, 'myGigs')}</button>
          <button class="tab-btn ${state.tab === 'history' ? 'active' : ''}" data-tab="history">${this.t(state, 'history')}</button>
        </nav>
        <div class="dashboard-content justify-center">
          ${state.tab === 'profiles' ? this.renderStudentProfilesList(state) : ''}
          ${state.tab === 'createProfile' ? this.renderStudentForm(state) : ''}
          ${state.tab === 'myGigs' ? this.renderStudentGigs(state) : ''}
          ${state.tab === 'history' ? this.renderStudentHistory(state) : ''}
        </div>
      </div>
    `;
  }

  renderStudentProfilesList(state) {
     return `
       <section class="gigs-panel" style="width: 100%; max-width: 900px; margin: 0 auto;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <h2>Your Profiles</h2>
            <button class="btn primary" id="create-new-profile-btn">Create New Profile</button>
          </div>
          <div class="gigs-list">
             ${state.studentProfiles.length > 0 ? state.studentProfiles.map(p => `
                <div class="gig-card items-center" style="align-items: center;">
                   <div>
                     <h4 style="margin:0">${p.title}</h4>
                     <p class="text-sm text-slate-500 mt-1">${p.fullName} | ${p.availability || ''}</p>
                   </div>
                   <div style="display: flex; gap: 0.5rem;">
                     <button class="btn outline edit-profile-btn" data-id="${p.id}">Edit</button>
                     <button class="btn outline select-profile-btn" data-id="${p.id}" style="color: var(--primary); border-color: var(--primary);">Select</button>
                     <button class="btn outline delete-profile-btn" data-id="${p.id}" style="color: #ef4444; border-color: #ef4444;">Delete</button>
                   </div>
                </div>
             `).join('') : '<p class="empty-list">You have no profiles yet. Create one to apply to gigs!</p>'}
          </div>
       </section>
     `;
  }

  renderStudentForm(state) {
    return `
      <section class="create-gig-form">
        <h3>Create Profile</h3>
        <form id="student-profile-form" class="student-form">
          <fieldset>
             <legend>Profile Settings</legend>
             <input type="text" name="title" placeholder="Profile Title (e.g. Waiter Profile)" aria-label="Profile Title" required>
          </fieldset>
          <fieldset>
             <legend>${this.t(state, 'personalInfo')}</legend>
             <div class="form-grid">
               <input type="text" name="fullName" placeholder="Full Name" aria-label="Full Name" required>
               <input type="email" name="email" placeholder="Email" aria-label="Email" required>
               <input type="tel" name="phone" placeholder="Phone" aria-label="Phone">
             </div>
             <div style="margin-top: 1rem;">
               <label style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-muted);">${this.t(state, 'profilePicture')}</label>
               <input type="file" name="profilePicture" aria-label="${this.t(state, 'profilePicture')}">
             </div>
          </fieldset>
          <fieldset>
             <legend>${this.t(state, 'housingInfo')}</legend>
             <input type="text" name="address" placeholder="Address" aria-label="Address">
          </fieldset>
          <fieldset>
             <legend>${this.t(state, 'bankInfo')}</legend>
             <input type="text" name="bankAccount" placeholder="Bank Account Number" aria-label="Bank Account Number">
          </fieldset>
          <fieldset>
             <legend>${this.t(state, 'aboutMe')}</legend>
             <textarea name="about" rows="3" placeholder="Short bio..." aria-label="Bio"></textarea>
          </fieldset>
          <fieldset>
             <legend>${this.t(state, 'education')}</legend>
             <input type="text" name="education" placeholder="University/School" aria-label="Education">
          </fieldset>
          <fieldset>
             <legend>${this.t(state, 'skills')} & ${this.t(state, 'languages')}</legend>
             <div class="form-grid">
               <input type="text" name="skills" placeholder="Skills (comma separated)" aria-label="Skills">
               <input type="text" name="languages" placeholder="Languages (comma separated)" aria-label="Languages">
             </div>
          </fieldset>
          <fieldset>
             <legend>${this.t(state, 'availability')} & ${this.t(state, 'minPay')}</legend>
             <div class="form-grid">
               <input type="text" name="availability" placeholder="e.g. Weekends" aria-label="Availability">
               <input type="number" name="minPay" placeholder="Hourly Pay (Min)" aria-label="Minimum hourly pay">
             </div>
          </fieldset>
          <fieldset>
             <legend>${this.t(state, 'additionalInfo')}</legend>
             <textarea name="additionalInfo" rows="2" placeholder="Any extra info..." aria-label="Additional Info"></textarea>
          </fieldset>
          <fieldset>
             <legend>CV</legend>
             <input type="file" name="cv" aria-label="Upload CV">
          </fieldset>
          <div style="display: flex; justify-content: flex-end; gap: 1rem;">
             <button type="button" class="btn outline" id="cancel-create-profile">Cancel</button>
             <button type="submit" class="btn primary">Save Profile</button>
          </div>
        </form>
      </section>
    `;
  }

  renderStudentGigs(state) {
     return `
      <section class="gigs-panel" style="width: 100%; max-width: 900px; margin: 0 auto;">
        <div style="margin-bottom: 2rem;">
          <h2>${this.t(state, 'myGigs')}</h2>
        </div>
        
        <div class="gigs-section">
          <h3>${this.t(state, 'offers')}</h3>
          <div class="gigs-list">
             ${state.studentGigs.offers.length ? state.studentGigs.offers.map(g => this.renderStudentGigCard(state, g, true)).join('') : `<p class="empty-list">No offers right now</p>`}
          </div>
        </div>

        <div class="gigs-section" style="margin-top: 2rem;">
          <h3>${this.t(state, 'ongoingGigs')}</h3>
          <div class="gigs-list">
             ${state.studentGigs.ongoing.length ? state.studentGigs.ongoing.map(g => this.renderStudentGigCard(state, g, false)).join('') : `<p class="empty-list">No ongoing gigs</p>`}
          </div>
        </div>
      </section>
     `;
  }

  renderStudentHistory(state) {
    return `
      <section class="gigs-panel" style="width: 100%; max-width: 900px; margin: 0 auto;">
        <div style="margin-bottom: 2rem;">
          <h2>${this.t(state, 'history')}</h2>
        </div>
        
        <div class="gigs-section">
          <h3>${this.t(state, 'finishedGigs')}</h3>
          <div class="gigs-list">
             ${state.studentGigs.finished.length ? state.studentGigs.finished.map(g => this.renderStudentGigCard(state, g, false)).join('') : `<p class="empty-list">No finished gigs</p>`}
          </div>
        </div>

        <div class="gigs-section" style="margin-top: 2rem;">
          <h3>${this.t(state, 'declinedGigs')}</h3>
          <div class="gigs-list">
             ${state.studentGigs.declined.length ? state.studentGigs.declined.map(g => this.renderStudentGigCard(state, g, false)).join('') : `<p class="empty-list">No declined gigs</p>`}
          </div>
        </div>
      </section>
    `;
  }

  renderStudentGigCard(state, gig, isOffer) {
    const isExpanded = state.expandedGigs[gig.id];
    return `
      <div class="gig-card flex-col gap-3" style="flex-direction: column; width: 100%;">
         <div class="gig-min" style="width: 100%; display: flex; justify-content: space-between; align-items: start;">
             <div style="flex: 1;">
               <h4>${gig.title}</h4>
               <p class="text-sm" style="font-weight: 600; color: var(--primary); margin-bottom: 0.25rem;">${gig.company}</p>
               <p class="text-sm text-slate-500">${this.t(state, 'date')}: ${gig.date} | ${this.t(state, 'salary')}: ${gig.salary} | ${this.t(state, 'duration')}: ${gig.duration}</p>
            </div>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
               ${isOffer ? `
               <button class="btn outline decline-offer-btn" data-id="${gig.id}">${this.t(state, 'decline')}</button>
               <button class="btn primary accept-offer-btn" data-id="${gig.id}">${this.t(state, 'accept')}</button>
               ` : ''}
               <button class="expand-gig-btn" data-id="${gig.id}" aria-label="Expand">
                 ${isExpanded ? '▲' : '▼'}
               </button>
            </div>
         </div>
         ${isExpanded ? `
         <div class="gig-expanded">
            <h5 style="margin-bottom: 0.5rem; color: var(--primary);">${this.t(state, 'jobAd')}</h5>
            <div class="gig-ad-content text-sm text-slate-300">
               <p style="margin-bottom: 1rem; font-size: 1rem; color: inherit;">${gig.description}</p>
               <div class="gig-ad-grid" style="color: inherit;">
                  <div><strong>${this.t(state, 'dresscode')}:</strong><br>${gig.dresscode}</div>
                  <div><strong>${this.t(state, 'languages')}:</strong><br>${gig.language}</div>
                  <div><strong>${this.t(state, 'contactInfo')}:</strong><br>${gig.contactInfo}</div>
                  ${isOffer && gig.deadline ? `<div><strong>${this.t(state, 'deadline')}:</strong><br><span style="color: #ef4444; font-weight: 600;">${gig.deadline}</span></div>` : ''}
               </div>
            </div>
         </div>
         ` : ''}
      </div>
    `;
  }
}

