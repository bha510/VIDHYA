// Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDR03GN7WvKDQ0youlww9kYus3o82gwGHI",
    authDomain: "education-453c9.firebaseapp.com",
    projectId: "education-453c9",
    storageBucket: "education-453c9.firebasestorage.app",
    messagingSenderId: "740963960614",
    appId: "1:740963960614:web:46d7332943736cd0d623e7",
    
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Google Authentication Provider
const provider = new GoogleAuthProvider();

// Select Elements
const loginBtn = document.getElementById("googleLogin");
const logoutBtn = document.getElementById("logout");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");

// Function to Sign In with Google
const signIn = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Store user details in Firestore
        await setDoc(doc(db, "users", user.uid), {
            name: user.displayName,
            email: user.email,
            profilePic: user.photoURL,
            lastLogin: new Date()
        }, { merge: true });

        // Save user session in localStorage
        localStorage.setItem("loggedIn", "true");

        // Update UI
        updateUserUI(user);

        // Redirect to previous page if coming from books.html
        const prevPage = localStorage.getItem("prevPage");
        if (prevPage) {
            localStorage.removeItem("prevPage");
            window.location.href = prevPage;
        }

    } catch (error) {
        console.error("Login Failed:", error.message);
    }
};

// Function to Logout
const logout = () => {
    signOut(auth).then(() => {
        localStorage.removeItem("loggedIn");
        updateUserUI(null);
    }).catch(error => {
        console.error("Logout Failed:", error.message);
    });
};

// Function to Update UI
const updateUserUI = (user) => {
    if (user) {
        userName.innerText = user.displayName;
        userEmail.innerText = user.email;
        loginBtn.style.display = "none";
        logoutBtn.style.display = "block";
    } else {
        userName.innerText = "Guest";
        userEmail.innerText = "guest@example.com";
        loginBtn.style.display = "block";
        logoutBtn.style.display = "none";
    }
};

// Check Authentication State
auth.onAuthStateChanged(user => {
    updateUserUI(user);
});

// Event Listeners
if (loginBtn) loginBtn.addEventListener("click", signIn);
if (logoutBtn) logoutBtn.addEventListener("click", logout);
