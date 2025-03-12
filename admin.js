import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

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
const db = getFirestore(app);
const auth = getAuth();


// 🔹 **Track User Traffic**
async function trackUserTraffic() {
    await addDoc(collection(db, "traffic"), {
        timestamp: new Date().toISOString()
    });
}

// 🔹 **Fetch Total Visits**
async function fetchUserTraffic() {
    const trafficSnapshot = await getDocs(collection(db, "traffic"));
    document.getElementById("total-visits").textContent = trafficSnapshot.size;
}

async function fetchUsers() {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const usersList = document.getElementById("users-list");

    usersList.innerHTML = ""; // Clear previous data

    usersSnapshot.forEach((doc) => {
        const user = doc.data();
        const lastLogin = user.lastLogin ? new Date(user.lastLogin.seconds * 1000).toLocaleString() : "Unknown";

        usersList.innerHTML += `
            <tr onclick="showUserDetails('${user.name}', '${user.email}', '${user.profilePic}', '${lastLogin}')">
                <td><img src="${user.profilePic}" alt="User" width="40" height="40" style="border-radius:50%"></td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${lastLogin}</td>
            </tr>
        `;
    });
}

// Show user details in a popup
window.showUserDetails = function(name, email, profilePic, lastLogin) {
    document.getElementById("user-modal").innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <img src="${profilePic}" alt="User" width="80" height="80" style="border-radius:50%">
            <h2>${name}</h2>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Last Login:</strong> ${lastLogin}</p>
        </div>
    `;
    document.getElementById("user-modal").style.display = "block";
};

// Close modal
window.closeModal = function() {
    document.getElementById("user-modal").style.display = "none";
};

// Load Users
fetchUsers();

// 🔹 **Fetch Orders Data**
async function fetchOrders() {
    const ordersList = document.getElementById("orders-list");
    ordersList.innerHTML = "";

    const ordersSnapshot = await getDocs(collection(db, "orders"));
    document.getElementById("total-downloads").textContent = ordersSnapshot.size;

    ordersSnapshot.forEach((doc) => {
        const order = doc.data();
        ordersList.innerHTML += `
            <tr>
                <td>${order.email}</td>
                <td>${order.bookName}</td>
                <td>${order.date}</td>
            </tr>
        `;
    });
}

// 🔹 **Fetch Books**
// Fetch and display books
async function fetchBooks() {
    const booksSnapshot = await getDocs(collection(db, "books"));
    const booksList = document.getElementById("books-list");

    booksList.innerHTML = ""; // Clear previous data

    booksSnapshot.forEach((doc) => {
        const book = doc.data();

        booksList.innerHTML += `
            <tr>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td><a href="${book.pdfURL}" target="_blank">View PDF</a></td>
                <td><button onclick="deleteBook('${doc.id}')">Delete</button></td>
            </tr>
        `;
    });
}

// Delete a book
window.deleteBook = async function (bookId) {
    if (confirm("Are you sure you want to delete this book?")) {
        await deleteDoc(doc(db, "books", bookId));
        alert("Book deleted successfully!");
        fetchBooks(); // Refresh book list
    }
};

// Load Books
fetchBooks();
// 🔹 **Add New Book**
document.getElementById("add-book-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("book-title").value;
    const author = document.getElementById("book-author").value;
    const pdfURL = document.getElementById("book-pdf").value;
    const thumbnailURL = document.getElementById("book-thumbnail").value; // New Thumbnail Input

    if (!title || !author || !pdfURL || !thumbnailURL) {
        alert("Please fill all fields!");
        return;
    }

    await addDoc(collection(db, "books"), { title, author, pdfURL, thumbnailURL }); // Save to Firestore
    alert("Book Added Successfully!");
    document.getElementById("add-book-form").reset();
});

// 🔹 **Track Visits and Load Data**
trackUserTraffic();
fetchUserTraffic();

fetchOrders();

