// Firebase sign-in + per-user progress document (GitHub Pages build only).
// Loads only when docs/firebase-config.js sets window.FIREBASE_CONFIG.
const cfg = window.FIREBASE_CONFIG;
if (cfg && cfg.apiKey) {
  const V = '10.12.2';
  const [{ initializeApp }, A, F] = await Promise.all([
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`),
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-auth.js`),
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore.js`),
  ]);
  const app = initializeApp(cfg);
  const auth = A.getAuth(app);
  const db = F.getFirestore(app);
  window.RGAuth = {
    signIn: (email, pass) => A.signInWithEmailAndPassword(auth, email, pass),
    signUp: (email, pass) => A.createUserWithEmailAndPassword(auth, email, pass),
    google: () => A.signInWithPopup(auth, new A.GoogleAuthProvider()),
    reset: (email) => A.sendPasswordResetEmail(auth, email),
    signOut: () => A.signOut(auth),
    // sign-in methods on the current account, e.g. ['google.com'] or ['google.com', 'password']
    providers: () => (auth.currentUser ? auth.currentUser.providerData.map((p) => p.providerId) : []),
    // add an email + password to an account made with Google, so it can sign in anywhere
    addPassword: async (pass) => {
      const u = auth.currentUser;
      const cred = A.EmailAuthProvider.credential(u.email, pass);
      try { return await A.linkWithCredential(u, cred); }
      catch (e) {
        if (e && e.code === 'auth/requires-recent-login') {
          await A.reauthenticateWithPopup(u, new A.GoogleAuthProvider());
          return A.linkWithCredential(u, cred);
        }
        throw e;
      }
    },
    onChange: (cb) => A.onAuthStateChanged(auth, cb),
    // One document per user: users/{uid} = { s: <progress JSON>, at: <last edit time> }
    backend: (uid) => {
      const ref = F.doc(db, 'users', uid);
      return {
        uid,
        load: async () => { const snap = await F.getDoc(ref); return snap.exists() ? snap.data() : null; },
        save: (data) => F.setDoc(ref, data),
        watch: (cb, err) => F.onSnapshot(ref, (snap) => { if (snap.exists() && !snap.metadata.hasPendingWrites) cb(snap.data()); }, err),
      };
    },
  };
  window.dispatchEvent(new Event('rgauth-ready'));
}
