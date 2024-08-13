const netlifyAuth = {
  isInitialized: false,
  user: null,

  initialize(callback) {
    this.isInitialized = true;
    const user = this.getUser();
    callback(user);
  },

  getUser() {
    const user = JSON.parse(localStorage.getItem('gotrue.user'));
    this.user = user;
    return user;
  },

  authenticate(callback) {
    // Redirect to the Netlify Identity login page
    window.location.href = "/.netlify/identity/login";

    window.addEventListener('message', (event) => {
      if (event.data && event.data.includes('authorization')) {
        const user = this.getUser();
        callback(user);
      }
    });
  },

  signout(callback) {
    fetch('/.netlify/identity/logout', {
      method: 'POST',
    }).then(() => {
      localStorage.removeItem('gotrue.user');
      this.user = null;
      callback();
    });
  },

  on(event, callback) {
    window.addEventListener(event, callback);
  },

  off(event, callback) {
    window.removeEventListener(event, callback);
  },
};

export default netlifyAuth;