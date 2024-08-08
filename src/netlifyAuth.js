import netlifyIdentity from 'netlify-identity-widget';

const netlifyAuth = {
  isAuthenticated: false,
  user: null,
  initialize(callback) {
    window.netlifyIdentity = netlifyIdentity;
    netlifyIdentity.on('init', (user) => {
      callback(user);
    });
    netlifyIdentity.init();
  },
  authenticate(callback) {
    this.isAuthenticated = true;
    netlifyIdentity.open();
    netlifyIdentity.on('login', (user) => {
      this.user = user;
      callback(user);
      netlifyIdentity.close();
    });
  },
  signout(callback) {
    this.isAuthenticated = false;
    netlifyIdentity.logout();
    netlifyIdentity.on('logout', () => {
      this.user = null;
      callback();
    });
  },
  on(event, callback) {
    netlifyIdentity.on(event, callback);
  },
};

// const netlifyAuth = {
//   isAuthenticated: true, // Mock as always authenticated
//   user: {
//     user_metadata: {
//       full_name: 'Test User',
//     },
//   },
//   events: {},
//   initialize(callback) {
//     callback(this.user);
//   },
//   authenticate(callback) {
//     callback(this.user);
//     this.trigger('login', this.user);
//   },
//   signout(callback) {
//     callback();
//     this.trigger('logout');
//   },
//   on(event, callback) {
//     if (!this.events[event]) {
//       this.events[event] = [];
//     }
//     this.events[event].push(callback);
//   },
//   trigger(event, data) {
//     if (this.events[event]) {
//       this.events[event].forEach(callback => callback(data));
//     }
//   },
// };

export default netlifyAuth;