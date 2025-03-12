// Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Firebase Config
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

// ✅ Function to Fetch User Orders
async function fetchOrders(userEmail) {
    const q = query(collection(db, "orders"), where("userEmail", "==", userEmail));
    const querySnapshot = await getDocs(q);

    const ordersList = document.getElementById("ordersList");
    ordersList.innerHTML = ""; // Clear previous data

    if (querySnapshot.empty) {
        ordersList.innerHTML = "<p>No orders found.</p>";
        return;
    }

    querySnapshot.forEach((doc) => {
        const data = doc.data();

        // ✅ Fix field names (use "title" instead of "bookName" and "pdf" instead of "pdfURL")
        const bookTitle = data.title || "Unknown Title";
        const pdfURL = data.pdf || "#";
        const orderDate = data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleString() : "Unknown Date";

        const orderElement = document.createElement("div");
        orderElement.classList.add("order-item");

        orderElement.innerHTML = `
            <h3>${bookTitle}</h3>
            <p>Downloaded on: ${orderDate}</p>
            <a href="${pdfURL}" target="_blank">📖 Open Book</a>
        `;

        ordersList.appendChild(orderElement);
    });
}

// ✅ Check if User is Logged In & Fetch Orders
onAuthStateChanged(auth, (user) => {
    if (user) {
        fetchOrders(user.email);
    } else {
        alert("You need to log in first!");
        window.location.href = "profile.html";
    }
});
