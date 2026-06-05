import { translations } from '../i18n.js';

/**
 * The View class handles the presentation layer of the application.
 * It is purely reactive and generates dynamic HTML based on the state passed to it.
 */
export class View {
  /**
   * Initializes the View and mounts it to the root element.
   */
  constructor() {
    this.app = document.getElementById('root');
  }

  /**
   * Helper function for Internationalization (i18n).
   * Retrieves translated strings based on the current state language.
   * @param {Object} state - The current application state.
   * @param {string} key - The dictionary key for the requested text.
   * @returns {string} The translated string.
   */
  t(state, key) {
    return translations[state.lang]?.[key] || key;
  }

  /**
   * Main rendering function. Determines which major UI view to draw based on state.
   * @param {Object} state - The current application state.
   */
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
    const { industry, availability, education, minPay, languages, city } = state.filter;
    
    // Filter the students dynamically
    const filteredStudents = state.students.filter(student => {
      if (industry && student.title && !student.title.toLowerCase().includes(industry.toLowerCase())) return false;
      if (availability && student.availability && !student.availability.toLowerCase().includes(availability.toLowerCase())) return false;
      if (education && student.education && !student.education.toLowerCase().includes(education.toLowerCase())) return false;
      if (minPay && parseInt(student.minPay) < parseInt(minPay)) return false;
      if (city && student.city && !student.city.toLowerCase().includes(city.toLowerCase())) return false;
      
      if (languages && student.languages) {
        const searchLangs = languages.split(',').map(l => l.trim().toLowerCase());
        const studentLangs = student.languages.map(l => l.toLowerCase());
        if (!searchLangs.some(l => studentLangs.includes(l))) return false;
      }
      return true;
    });

    return `
      <form id="company-filter-form" class="filters-sidebar">
        <h3>${this.t(state, 'filters')}</h3>
        <div class="filter-group">
          <label>${this.t(state, 'industry')}</label>
          <select name="industry" aria-label="${this.t(state, 'industry')}">
            <option value="" ${!industry ? 'selected' : ''}>All Industries</option>
            <option value="Waiter" ${industry === 'Waiter' ? 'selected' : ''}>Hospitality/Waiter</option>
            <option value="Bartender" ${industry === 'Bartender' ? 'selected' : ''}>Hospitality/Bartender</option>
          </select>
        </div>
        <div class="filter-group">
          <label>${this.t(state, 'availability')}</label>
          <input type="text" name="availability" value="${availability || ''}" placeholder="e.g. Weekends" aria-label="${this.t(state, 'availability')}">
        </div>
        <div class="filter-group">
          <label>${this.t(state, 'education')}</label>
          <input type="text" name="education" value="${education || ''}" placeholder="e.g. University" aria-label="${this.t(state, 'education')}">
        </div>
        <div class="filter-group">
          <label>${this.t(state, 'minPay')}</label>
          <input type="number" name="minPay" value="${minPay || ''}" placeholder="100" aria-label="${this.t(state, 'minPay')}">
        </div>
        <div class="filter-group">
          <label>${this.t(state, 'languages')}</label>
          <input type="text" name="languages" value="${languages || ''}" placeholder="e.g. EN, SV" aria-label="${this.t(state, 'languages')}">
        </div>
        <div class="filter-group">
          <label>${this.t(state, 'city')}</label>
          <input type="text" name="city" value="${city || ''}" placeholder="e.g. Stockholm" aria-label="${this.t(state, 'city')}">
        </div>
        <button type="submit" class="btn primary apply-filters-btn">${this.t(state, 'apply')}</button>
      </form>
      <div class="main-panel">
        ${filteredStudents.length > 0 
          ? filteredStudents.map((student) => this.renderStudentCard(state, student)).join('') 
          : '<p class="empty-list">No candidates found matching your filters.</p>'}
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
            <p><strong>${student.title}</strong> | ${student.availability} ${student.city ? `| ${student.city}` : ''} | <strong>${this.t(state, 'minPay')}:</strong> ${student.minPay || 'N/A'}</p>
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
    const ongoingGigs = state.companyGigs.filter(g => g.status === 'ongoing');
    
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

        <div class="gigs-section" style="margin-top: 2rem;">
          <h3>${this.t(state, 'ongoingGigs')}</h3>
          <div class="gigs-list">
             ${ongoingGigs.length ? ongoingGigs.map(g => this.renderCompanyGigCard(state, g)).join('') : `<p class="empty-list">No ongoing gigs</p>`}
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
              <p class="text-sm text-slate-500">${this.t(state, 'date')}: ${gig.startDate} to ${gig.endDate} | ${this.t(state, 'duration')}: ${gig.duration} | ${this.t(state, 'salary')}: ${gig.salary}</p>
              ${gig.sentTo ? `<p class="text-sm text-slate-500 mt-1">Sent to: <strong>${gig.sentTo}</strong></p>` : ''}
           </div>
           <div style="display: flex; gap: 0.5rem; align-items: center;">
              ${gig.status === 'ready' ? `<button class="btn outline edit-gig-btn" data-id="${gig.id}">${this.t(state, 'edit')}</button>` : ''}
              ${gig.status === 'ready' ? `<button class="btn outline delete-gig-btn" data-id="${gig.id}" style="color: #ef4444; border-color: #ef4444;">Delete</button>` : ''}
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
    const editGig = state.editingGigId ? state.companyGigs.find(g => g.id === state.editingGigId) : null;
    
    return `
      <section class="create-gig-form">
        <h3>${editGig ? 'Edit Gig' : this.t(state, 'createGigBtn')}</h3>
        <form id="create-gig-form" class="student-form">
          <fieldset>
             <legend>Gig Basics</legend>
             <div class="form-grid" style="align-items: flex-end;">
               <input type="text" name="title" placeholder="Gig Title" value="${editGig?.title || ''}" required>
               <input type="text" name="salary" placeholder="${this.t(state, 'salary')} (e.g. 150 SEK/h)" value="${editGig?.salary || ''}" required>
               <div>
                  <label style="display: block; font-size: 0.75rem; font-weight: 600; color: var(--text-muted); margin-bottom: 0.25rem;">Start Date</label>
                  <input type="date" name="startDate" aria-label="Start Date" value="${editGig?.startDate || ''}" required>
               </div>
               <div>
                  <label style="display: block; font-size: 0.75rem; font-weight: 600; color: var(--text-muted); margin-bottom: 0.25rem;">End Date</label>
                  <input type="date" name="endDate" aria-label="End Date" value="${editGig?.endDate || ''}" required>
               </div>
               <input type="text" name="duration" placeholder="${this.t(state, 'duration')} (e.g. 1 evening)" value="${editGig?.duration || ''}" required>
             </div>
          </fieldset>
          <fieldset>
             <legend>${this.t(state, 'fullDescription')}</legend>
             <textarea name="description" rows="4" placeholder="Describe the job role and expectations...">${editGig?.description || ''}</textarea>
          </fieldset>
          <fieldset>
             <legend>Requirements</legend>
             <div class="form-grid">
               <input type="text" name="dresscode" placeholder="${this.t(state, 'dresscode')}" value="${editGig?.dresscode || ''}">
               <input type="text" name="language" placeholder="${this.t(state, 'languages')}" value="${editGig?.language || ''}">
             </div>
          </fieldset>
          <fieldset>
             <legend>Logistics</legend>
             <div class="form-grid" style="align-items: flex-end;">
               <input type="text" name="contactInfo" placeholder="${this.t(state, 'contactInfo')}" value="${editGig?.contactInfo || ''}">
               <div>
                  <label style="display: block; font-size: 0.75rem; font-weight: 600; color: var(--text-muted); margin-bottom: 0.25rem;">Application Deadline</label>
                  <input type="date" name="deadline" aria-label="Deadline" value="${editGig?.deadline || ''}">
               </div>
               ${!editGig ? `
                  <div>
                     <label style="display: block; font-size: 0.75rem; font-weight: 600; color: var(--text-muted); margin-bottom: 0.25rem;">Number of Copies</label>
                     <input type="number" name="copies" min="1" max="10" value="1" title="How many copies of this gig to create">
                  </div>
               ` : ''}
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
                     <button class="btn outline delete-profile-btn" data-id="${p.id}" style="color: #ef4444; border-color: #ef4444;">Delete</button>
                   </div>
                </div>
             `).join('') : '<p class="empty-list">You have no profiles yet. Create one to apply to gigs!</p>'}
          </div>
       </section>
     `;
  }

  renderStudentForm(state) {
    const editProfile = state.editingProfileId ? state.studentProfiles.find(p => p.id === state.editingProfileId) : null;
    
    return `
      <section class="create-gig-form">
        <h3>${editProfile ? 'Edit Profile' : 'Create Profile'}</h3>
        <form id="student-profile-form" class="student-form">
          <fieldset>
             <legend>Profile Settings</legend>
             <input type="text" name="title" placeholder="Profile Title (e.g. Waiter Profile)" aria-label="Profile Title" value="${editProfile?.title || ''}" required>
          </fieldset>
          <fieldset>
             <legend>${this.t(state, 'personalInfo')}</legend>
             <div class="form-grid">
               <input type="text" name="fullName" placeholder="Full Name" aria-label="Full Name" value="${editProfile?.fullName || ''}" required>
               <input type="email" name="email" placeholder="Email" aria-label="Email" value="${editProfile?.email || ''}" required>
               <input type="tel" name="phone" placeholder="Phone" aria-label="Phone" value="${editProfile?.phone || ''}">
             </div>
             <div style="margin-top: 1rem;">
               <label style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-muted);">${this.t(state, 'profilePicture')}</label>
               <input type="file" name="profilePicture" aria-label="${this.t(state, 'profilePicture')}">
             </div>
          </fieldset>
          <fieldset>
             <legend>${this.t(state, 'housingInfo')}</legend>
             <div class="form-grid">
               <input type="text" name="address" placeholder="Address" aria-label="Address" value="${editProfile?.address || ''}">
               <input type="text" name="city" placeholder="City" aria-label="City" value="${editProfile?.city || ''}">
             </div>
          </fieldset>
          <fieldset>
             <legend>${this.t(state, 'bankInfo')}</legend>
             <input type="text" name="bankAccount" placeholder="Bank Account Number" aria-label="Bank Account Number" value="${editProfile?.bankAccount || ''}">
          </fieldset>
          <fieldset>
             <legend>${this.t(state, 'aboutMe')}</legend>
             <textarea name="about" rows="3" placeholder="Short bio..." aria-label="Bio">${editProfile?.about || ''}</textarea>
          </fieldset>
          <fieldset>
             <legend>${this.t(state, 'education')}</legend>
             <input type="text" name="education" placeholder="University/School" aria-label="Education" value="${editProfile?.education || ''}">
          </fieldset>
          <fieldset>
             <legend>${this.t(state, 'skills')} & ${this.t(state, 'languages')}</legend>
             <div class="form-grid">
               <input type="text" name="skills" placeholder="Skills (comma separated)" aria-label="Skills" value="${editProfile?.skills || ''}">
               <input type="text" name="languages" placeholder="Languages (comma separated)" aria-label="Languages" value="${editProfile?.languages || ''}">
             </div>
          </fieldset>
          <fieldset>
             <legend>${this.t(state, 'availability')} & ${this.t(state, 'minPay')}</legend>
             <div class="form-grid">
               <input type="text" name="availability" placeholder="e.g. Weekends" aria-label="Availability" value="${editProfile?.availability || ''}">
               <input type="number" name="minPay" placeholder="Hourly Pay (Min)" aria-label="Minimum hourly pay" value="${editProfile?.minPay || ''}">
             </div>
          </fieldset>
          <fieldset>
             <legend>${this.t(state, 'additionalInfo')}</legend>
             <textarea name="additionalInfo" rows="2" placeholder="Any extra info..." aria-label="Additional Info">${editProfile?.additionalInfo || ''}</textarea>
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
               <p class="text-sm text-slate-500">${this.t(state, 'date')}: ${gig.startDate} to ${gig.endDate} | ${this.t(state, 'salary')}: ${gig.salary} | ${this.t(state, 'duration')}: ${gig.duration}</p>
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
