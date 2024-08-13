import GoTrue from 'gotrue-js';

const auth = new GoTrue({
  APIUrl: `${window.location.origin}/.netlify/identity`,
  audience: '',
  setCookie: true,
});

const netlifyAuth = {
  isInitialized: false,
  user: null,

  initialize(callback) {
    this.isInitialized = true;
    const user = this.getUser();
    callback(user);
  },

  getUser() {
    const user = auth.currentUser();
    this.user = user;
    return user;
  },

  authenticate(callback) {
    auth.login('', '', true); // This will open the login modal
    window.addEventListener('message', (event) => {
      if (event.data && event.data.includes('authorization')) {
        const user = this.getUser();
        callback(user);
      }
    });
  },

  signout(callback) {
    const user = auth.currentUser();
    if (user) {
      user.logout().then(() => {
        this.user = null;
        callback();
      });
    }
  },

  on(event, callback) {
    window.addEventListener(event, callback);
  },

  off(event, callback) {
    window.removeEventListener(event, callback);
  },
};

export default netlifyAuth;