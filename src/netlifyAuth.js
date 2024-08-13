// netlifyAuth.js
import netlifyIdentity from 'netlify-identity-widget';

const netlifyAuth = {
  isInitialized: false,
  user: null,

  initialize(callback) {
    netlifyIdentity.init();
    netlifyIdentity.on('init', (user) => {
      this.user = user;
      this.isInitialized = true;
      callback(user);
    });
    netlifyIdentity.on('login', (user) => {
      this.user = user;
      callback(user);
    });
  },

  authenticate(callback) {
    netlifyIdentity.open();
    netlifyIdentity.on('login', (user) => {
      this.user = user;
      callback(user);
      netlifyIdentity.close();
    });
  },

  signout(callback) {
    netlifyIdentity.logout();
    netlifyIdentity.on('logout', () => {
      this.user = null;
      callback();
    });
  },

  on(event, callback) {
    netlifyIdentity.on(event, callback);
  },

  off(event, callback) {
    netlifyIdentity.off(event, callback);
  },
};

export default netlifyAuth;