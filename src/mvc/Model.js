/**
 * The Model class acts as the single source of truth for the application.
 * It holds all state (data, UI toggles, user roles) and implements the 
 * Observer pattern to notify subscribers (the Controller) when state changes occur.
 */
export class Model {
  /**
   * Initializes the default application state and mock database arrays.
   */
  constructor() {
    this.state = {
      lang: 'en',
      page: 'home', // home, dashboard
      userRole: null, // null, 'company', 'student'
      tab: 'search', // 'search', 'create', 'history', 'profiles', 'createProfile', 'myGigs'
      expandedProfiles: {},
      expandedGigs: {},
      editingGigId: null,
      editingProfileId: null,
      filter: {
        industry: '',
        availability: '',
        minPay: 0,
        city: '',
        languages: ''
      },
      students: [
        {
          id: 101,
          name: 'Anna Smith',
          title: 'Waiter',
          availability: 'Weekends',
          bio: 'Fast and reliable waiter with 2 years of experience.',
          aboutMe: 'Worked at The Grand Hotel and local cafes. High energy, good at handling stressful situations.',
          workExperience: '2 years as waiter at The Grand Hotel, 1 year at Cafe Nero.',
          additionalInfo: 'Can provide my own uniform. Available for night shifts.',
          education: 'Hospitality Management, Stockholm University',
          languages: ['English', 'Swedish'],
          skills: ['Service', 'Speed', 'Stress resistance', 'Flexibility'],
          minPay: '150 SEK/h',
          city: 'Stockholm',
          photo: 'https://ui-avatars.com/api/?name=Anna+Smith&background=0D8ABC&color=fff'
        },
        {
          id: 102,
          name: 'John Doe',
          title: 'Bartender',
          availability: 'Evenings',
          bio: 'Mixologist with a passion for creative drinks.',
          aboutMe: 'Specializes in cocktails. 3 years experience. Fun and outgoing.',
          workExperience: '3 years at Night Club X. Certified Mixologist.',
          additionalInfo: 'Can bring my own shaker set.',
          education: 'Bartending Academy, London',
          languages: ['English', 'Spanish'],
          skills: ['Mixing', 'Charisma', 'Creativity', 'Service'],
          minPay: '180 SEK/h',
          city: 'Gothenburg',
          photo: 'https://ui-avatars.com/api/?name=John+Doe&background=10B981&color=fff'
        }
      ],
      studentProfiles: [
        { id: 1, title: 'Waiter Profile', fullName: 'Elon Tusk', email: 'elon@example.com', about: 'Good at serving.', availability: 'Weekends' }
      ],
      companyGigs: [
        { id: 1, title: 'Waiter for weekend', status: 'ready', startDate: '2026-05-15', endDate: '2026-05-16', duration: '2 days', salary: '$20/h', description: 'Weekend waiter needed for busy shift. Black and white uniform.', dresscode: 'Black and white formal', language: 'Swedish/English', contactInfo: 'hr@restaurant.com' },
        { id: 2, title: 'Barista needed', status: 'ready', startDate: '2026-05-16', endDate: '2026-05-16', duration: '1 day', salary: '$18/h', description: 'Experienced barista for morning rush.', dresscode: 'Casual black', language: 'Swedish/English', contactInfo: 'cafe@coffee.com' },
        { id: 3, title: 'Bartender for corporate event', status: 'sent', sentTo: 'John Doe', startDate: '2026-05-20', endDate: '2026-05-20', duration: '5 hours', salary: '$25/h', description: 'Mixing drinks for a corporate party. High pace.', dresscode: 'Smart casual', language: 'English', contactInfo: 'events@corp.com' }
      ],
      historyGigs: [
        { id: 4, title: 'Event Staff', status: 'finished', startDate: '2026-04-10', endDate: '2026-04-12', duration: '3 days', salary: '$15/h', info: 'Successfully completed, rating 5/5', description: 'General event setup and takedown.', dresscode: 'Provided T-shirt', language: 'Swedish/English', contactInfo: 'staffing@events.com' }
      ],
      studentGigs: {
        offers: [
          { id: 10, title: 'Waiter at Grand Hotel', company: 'The Grand Hotel', startDate: '2026-05-15', endDate: '2026-05-15', description: 'Wait tables for a prestigious wedding event. You will be serving a 3-course meal to 100+ guests. High standards of service expected.', dresscode: 'Black suit, white shirt, black tie', language: 'Swedish / English', contactInfo: 'hr@grandhotel.com', deadline: '2026-05-10', duration: '1 evening', salary: '250 SEK/h' }
        ],
        ongoing: [
          { id: 11, title: 'Barista', company: 'Cafe Nero', startDate: '2026-05-16', endDate: '2026-05-17', description: 'Morning shift barista for the busy downtown location. Handling espresso machines and serving pastries.', dresscode: 'Black shirt, apron provided', language: 'Swedish', contactInfo: 'manager@cafenero.com', duration: 'All weekend', salary: '160 SEK/h' }
        ],
        finished: [
          { id: 12, title: 'Bartender', company: 'Night Club X', startDate: '2026-04-12', endDate: '2026-04-13', description: 'Mix drinks in a high-volume night club environment.', dresscode: 'Casual black', language: 'English', contactInfo: 'boss@clubx.com', duration: 'Friday night', salary: '200 SEK/h' }
        ],
        declined: [
          { id: 13, title: 'Dishwasher', company: 'Restaurant Y', startDate: '2026-04-15', endDate: '2026-04-15', description: 'Washing dishes and kitchen prep.', dresscode: 'Provided', language: 'Any', contactInfo: 'kitchen@resty.com', duration: '4 hours', salary: '150 SEK/h' }
        ]
      }
    };
    this.listeners = [];
  }

  /**
   * Registers a listener callback to be invoked upon any state changes.
   * @param {Function} listener - The callback function
   */
  subscribe(listener) {
    this.listeners.push(listener);
  }

  /**
   * Broadcasts a copy of the current state to all subscribed listeners.
   */
  notify() {
    this.listeners.forEach(l => l({ ...this.state }));
  }

  /**
   * Updates the active UI language.
   * @param {string} l - Language code (e.g., 'en', 'sv').
   */
  setLang(l) {
    this.state.lang = l;
    this.notify();
  }

  /**
   * Navigates to a different main page and updates the user role.
   * @param {string} page - The target page ('home', 'dashboard').
   * @param {string} [role] - The selected user role ('company', 'student').
   */
  setPage(page, role) {
    this.state.page = page;
    if (role) this.state.userRole = role;
    if (page === 'dashboard') {
      this.state.tab = this.state.userRole === 'company' ? 'search' : 'profiles';
    }
    this.notify();
  }

  /**
   * Switches the active tab inside the dashboard.
   * @param {string} tab - The tab identifier (e.g., 'search', 'myGigs').
   */
  setTab(tab) {
    this.state.tab = tab;
    this.notify();
  }

  /**
   * Toggles the visual expanded state of a student profile card.
   * @param {number|string} id - The ID of the student profile.
   */
  toggleProfileExpand(id) {
    this.state.expandedProfiles[id] = !this.state.expandedProfiles[id];
    this.notify();
  }

  /**
   * Toggles the visual expanded state of a gig card.
   * @param {number|string} id - The ID of the gig.
   */
  toggleGigExpand(id) {
    this.state.expandedGigs[id] = !this.state.expandedGigs[id];
    this.notify();
  }

  /**
   * Logs the current user out, clearing role state and returning to the home screen.
   */
  logout() {
    this.state.page = 'home';
    this.state.userRole = null;
    this.notify();
  }

  /**
   * Sends a gig offer from a company to a specific student.
   * @param {number|string} studentId - The ID of the student receiving the offer.
   * @param {number|string} gigId - The ID of the gig being offered.
   */
  sendOffer(studentId, gigId) {
    const gig = this.state.companyGigs.find(g => g.id === parseInt(gigId));
    const student = this.state.students.find(s => s.id === parseInt(studentId));
    
    if (gig && student) {
      gig.status = 'sent';
      gig.sentTo = student.name;
      
      // Avoid duplicates, then add to the student's offers
      const offerExists = this.state.studentGigs.offers.some(o => o.id === gig.id);
      if (!offerExists) {
        this.state.studentGigs.offers.push({
          ...gig,
          company: 'Your Company' // Mocked company name
        });
      }
      
      alert(`Offer for "${gig.title}" sent to ${student.name}!`);
      this.notify();
    }
  }

  /**
   * Applies new search filters to the company search dashboard.
   * @param {Object} filters - Key-value pairs of filtering criteria.
   */
  applyFilter(filters) {
    this.state.filter = { ...this.state.filter, ...filters };
    this.notify();
  }

  /**
   * Sets up the UI to edit an existing gig.
   * @param {number|string} id - The ID of the gig to edit.
   */
  editGig(id) {
    this.state.editingGigId = id;
    this.state.tab = 'createGig';
    this.notify();
  }

  cancelEditGig() {
    this.state.editingGigId = null;
    this.state.tab = 'myGigs';
    this.notify();
  }

  editProfile(id) {
    this.state.editingProfileId = id;
    this.state.tab = 'createProfile';
    this.notify();
  }

  cancelEditProfile() {
    this.state.editingProfileId = null;
    this.state.tab = 'profiles';
    this.notify();
  }

  /**
   * Saves a new gig or updates an existing gig being edited.
   * @param {Object} data - Form data containing the gig details.
   */
  saveGig(data) {
    if (this.state.editingGigId) {
      const index = this.state.companyGigs.findIndex(g => g.id === this.state.editingGigId);
      if (index > -1) {
        this.state.companyGigs[index] = { ...this.state.companyGigs[index], ...data };
      }
      this.state.editingGigId = null;
    } else {
      // Extract and remove copies before saving
      const copies = parseInt(data.copies, 10) || 1;
      delete data.copies;
      
      for (let i = 0; i < copies; i++) {
        const gigCopy = { ...data, id: Date.now() + i, status: 'ready' };
        this.state.companyGigs.push(gigCopy);
      }
    }
    this.state.tab = 'myGigs';
    this.notify();
  }

  /**
   * Deletes a specific gig from the company's list.
   * @param {number|string} id - The ID of the gig to delete.
   */
  deleteGig(id) {
    this.state.companyGigs = this.state.companyGigs.filter(g => g.id !== id);
    this.notify();
  }

  /**
   * Saves a new student profile or updates an existing profile being edited.
   * @param {Object} data - Form data containing the profile details.
   */
  saveProfile(data) {
    // Map the form data to the format expected by the Company view
    const newSearchableStudent = {
      name: data.fullName || 'Anonymous Student',
      title: data.title,
      availability: data.availability || 'Not specified',
      city: data.city || 'Not specified',
      bio: data.about || 'No bio provided.',
      aboutMe: data.about || '',
      workExperience: 'N/A', // Not in the current form
      additionalInfo: data.additionalInfo || '',
      education: data.education || '',
      languages: data.languages ? data.languages.split(',').map(s => s.trim()) : [],
      skills: data.skills ? data.skills.split(',').map(s => s.trim()) : [],
      minPay: data.minPay ? `${data.minPay} SEK/h` : 'N/A',
      photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.fullName || 'Student')}&background=random&color=fff`
    };
    
    if (this.state.editingProfileId) {
      data.id = this.state.editingProfileId;
      const pIndex = this.state.studentProfiles.findIndex(p => p.id === this.state.editingProfileId);
      if (pIndex > -1) this.state.studentProfiles[pIndex] = { ...this.state.studentProfiles[pIndex], ...data };

      const sIndex = this.state.students.findIndex(s => s.id === this.state.editingProfileId);
      if (sIndex > -1) {
        newSearchableStudent.id = this.state.editingProfileId;
        this.state.students[sIndex] = { ...this.state.students[sIndex], ...newSearchableStudent };
      }
      this.state.editingProfileId = null;
    } else {
      data.id = Date.now();
      data.title = data.title || "New Profile";
      this.state.studentProfiles.push(data);
      newSearchableStudent.id = data.id;
      this.state.students.push(newSearchableStudent);
    }
    
    this.state.tab = 'profiles';
    this.notify();
  }

  deleteProfile(id) {
    this.state.studentProfiles = this.state.studentProfiles.filter(p => p.id !== id);
    this.state.students = this.state.students.filter(s => s.id !== id);
    this.notify();
  }

  acceptOffer(gigId) {
    const gigIndex = this.state.studentGigs.offers.findIndex(g => g.id === gigId);
    if (gigIndex > -1) {
      const gig = this.state.studentGigs.offers.splice(gigIndex, 1)[0];
      this.state.studentGigs.ongoing.push(gig);
      
      // Also move the original company gig to 'ongoing'
      const companyGig = this.state.companyGigs.find(g => g.id === gigId);
      if (companyGig) {
        companyGig.status = 'ongoing';
      }
      this.notify();
    }
  }

  declineOffer(gigId) {
    const gigIndex = this.state.studentGigs.offers.findIndex(g => g.id === gigId);
    if (gigIndex > -1) {
      const gig = this.state.studentGigs.offers.splice(gigIndex, 1)[0];
      this.state.studentGigs.declined.push(gig);
      this.notify();
    }
  }
}
