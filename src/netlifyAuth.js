let netlifyIdentity;

if (typeof window !== 'undefined') {
  netlifyIdentity = require('netlify-identity-widget');
}

const netlifyAuth = {
  isAuthenticated: false,
  user: null,
  initialize(callback) {
    if (netlifyIdentity) {
      netlifyIdentity.on('init', user => {
        this.user = user;
        this.isAuthenticated = !!user;
        callback(user);
      });
      netlifyIdentity.init();
    }
  },
  authenticate(callback) {
    if (netlifyIdentity) {
      netlifyIdentity.open();
      netlifyIdentity.on('login', user => {
        this.user = user;
        this.isAuthenticated = true;
        callback(user);
        netlifyIdentity.close();
      });
    }
  },
  signout(callback) {
    if (netlifyIdentity) {
      netlifyIdentity.logout();
      netlifyIdentity.on('logout', () => {
        this.user = null;
        this.isAuthenticated = false;
        callback();
      });
    }
  }
};

export default netlifyAuth;