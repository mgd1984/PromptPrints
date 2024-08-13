import GoTrue from 'gotrue-js';

const auth = typeof window !== 'undefined' ? new GoTrue({
  APIUrl: `${window.location.origin}/.netlify/identity`,
  audience: '',
  setCookie: true,
}) : null;

const netlifyAuth = {
  isInitialized: false,
  user: null,

  initialize(callback) {
    if (!auth) return;
    this.isInitialized = true;
    const user = this.getUser();
    callback(user);
  },

  getUser() {
    if (!auth) return null;
    const user = auth.currentUser();
    this.user = user;
    return user;
  },

  authenticate(callback) {
    if (!auth) return;
    auth.login('', '', true);
    window.addEventListener('message', (event) => {
      if (event.data && event.data.includes('authorization')) {
        const user = this.getUser();
        callback(user);
      }
    });
  },

  signout(callback) {
    if (!auth) return;
    const user = auth.currentUser();
    if (user) {
      user.logout().then(() => {
        this.user = null;
        callback();
      });
    }
  },

  on(event, callback) {
    if (!auth) return;
    window.addEventListener(event, callback);
  },

  off(event, callback) {
    if (!auth) return;
    window.removeEventListener(event, callback);
  },
};

export default netlifyAuth;