let netlifyIdentity;

if (typeof window !== 'undefined') {
  netlifyIdentity = require('netlify-identity-widget');
  netlifyIdentity.init();
  console.log('netlifyIdentity initialized:', netlifyIdentity);
}

const netlifyAuth = {
  isAuthenticated: false,
  user: null,
  initialize(callback) {
    if (netlifyIdentity) {
      console.log('netlifyIdentity.on:', netlifyIdentity.on);
      netlifyIdentity.on('init', user => {
        this.user = user;
        this.isAuthenticated = !!user;
        callback(user);
      });
    }
  },
  authenticate(callback) {
    if (netlifyIdentity) {
      netlifyIdentity.open();
      console.log('netlifyIdentity.on:', netlifyIdentity.on);
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
      console.log('netlifyIdentity.on:', netlifyIdentity.on);
      netlifyIdentity.on('logout', () => {
        this.user = null;
        this.isAuthenticated = false;
        callback();
      });
    }
  }
};

export default netlifyAuth;