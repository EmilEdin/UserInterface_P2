export class Model {
  constructor() {
    this.state = {
      lang: 'en',
      page: 'home', // home, dashboard
      userRole: null, // null, 'company', 'student'
      tab: 'search', // 'search', 'create', 'history', 'profiles', 'createProfile', 'myGigs'
      expandedProfiles: {},
      expandedGigs: {},
      filter: {
        industry: '',
        availability: '',
        minRating: 0,
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
          photo: 'https://ui-avatars.com/api/?name=John+Doe&background=10B981&color=fff'
        }
      ],
      studentProfiles: [
        { id: 1, title: 'Waiter Profile', fullName: 'Emil Edin', email: 'emil@example.com', about: 'Good at serving.', availability: 'Weekends' }
      ],
      companyGigs: [
        { id: 1, title: 'Waiter for weekend', status: 'ready', date: '2026-05-15', duration: '2 days', salary: '$20/h', description: 'Weekend waiter needed for busy shift. Black and white uniform.', dresscode: 'Black and white formal', language: 'Swedish/English', contactInfo: 'hr@restaurant.com' },
        { id: 2, title: 'Barista needed', status: 'ready', date: '2026-05-16', duration: '1 day', salary: '$18/h', description: 'Experienced barista for morning rush.', dresscode: 'Casual black', language: 'Swedish/English', contactInfo: 'cafe@coffee.com' },
        { id: 3, title: 'Bartender for corporate event', status: 'sent', sentTo: 'John Doe', date: '2026-05-20', duration: '5 hours', salary: '$25/h', description: 'Mixing drinks for a corporate party. High pace.', dresscode: 'Smart casual', language: 'English', contactInfo: 'events@corp.com' }
      ],
      historyGigs: [
        { id: 4, title: 'Event Staff', status: 'finished', date: '2026-04-10', duration: '3 days', salary: '$15/h', info: 'Successfully completed, rating 5/5', description: 'General event setup and takedown.', dresscode: 'Provided T-shirt', language: 'Swedish/English', contactInfo: 'staffing@events.com' }
      ],
      studentGigs: {
        offers: [
          { id: 10, title: 'Waiter at Grand Hotel', company: 'The Grand Hotel', date: '2026-05-15', description: 'Wait tables for a prestigious wedding event. You will be serving a 3-course meal to 100+ guests. High standards of service expected.', dresscode: 'Black suit, white shirt, black tie', language: 'Swedish / English', contactInfo: 'hr@grandhotel.com', deadline: '2026-05-10', duration: '1 evening', salary: '250 SEK/h' }
        ],
        ongoing: [
          { id: 11, title: 'Barista', company: 'Cafe Nero', date: '2026-05-16', description: 'Morning shift barista for the busy downtown location. Handling espresso machines and serving pastries.', dresscode: 'Black shirt, apron provided', language: 'Swedish', contactInfo: 'manager@cafenero.com', duration: 'All weekend', salary: '160 SEK/h' }
        ],
        finished: [
          { id: 12, title: 'Bartender', company: 'Night Club X', date: '2026-04-12', description: 'Mix drinks in a high-volume night club environment.', dresscode: 'Casual black', language: 'English', contactInfo: 'boss@clubx.com', duration: 'Friday night', salary: '200 SEK/h' }
        ],
        declined: [
          { id: 13, title: 'Dishwasher', company: 'Restaurant Y', date: '2026-04-15', description: 'Washing dishes and kitchen prep.', dresscode: 'Provided', language: 'Any', contactInfo: 'kitchen@resty.com', duration: '4 hours', salary: '150 SEK/h' }
        ]
      }
    };
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify() {
    this.listeners.forEach(l => l({ ...this.state }));
  }

  setLang(l) {
    this.state.lang = l;
    this.notify();
  }

  setPage(page, role) {
    this.state.page = page;
    if (role) this.state.userRole = role;
    if (page === 'dashboard') {
      this.state.tab = this.state.userRole === 'company' ? 'search' : 'profiles';
    }
    this.notify();
  }

  setTab(tab) {
    this.state.tab = tab;
    this.notify();
  }

  toggleProfileExpand(id) {
    this.state.expandedProfiles[id] = !this.state.expandedProfiles[id];
    this.notify();
  }

  toggleGigExpand(id) {
    this.state.expandedGigs[id] = !this.state.expandedGigs[id];
    this.notify();
  }

  logout() {
    this.state.page = 'home';
    this.state.userRole = null;
    this.notify();
  }

  sendOffer(studentId, gigId) {
    alert(`Offer sent to student ${studentId} for gig ${gigId}`);
  }

  saveProfile(data) {
    data.id = Date.now();
    data.title = data.title || "New Profile";
    this.state.studentProfiles.push(data);
    this.state.tab = 'profiles';
    this.notify();
  }

  deleteProfile(id) {
    this.state.studentProfiles = this.state.studentProfiles.filter(p => p.id !== id);
    this.notify();
  }

  acceptOffer(gigId) {
    const gigIndex = this.state.studentGigs.offers.findIndex(g => g.id === gigId);
    if (gigIndex > -1) {
      const gig = this.state.studentGigs.offers.splice(gigIndex, 1)[0];
      this.state.studentGigs.ongoing.push(gig);
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
