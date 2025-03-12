import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

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
const db = getFirestore(app);
const auth = getAuth(app);

// ✅ Function to Load Books from Firestore
async function loadBooks() {
    const booksContainer = document.getElementById("booksContainer");
    booksContainer.innerHTML = "<p>Loading books...</p>";

    try {
        const booksSnapshot = await getDocs(collection(db, "books"));
        booksContainer.innerHTML = ""; // Clear loading message

        booksSnapshot.forEach((doc) => {
            const book = doc.data();
            console.log("📚 Book Data:", book);

            const title = book.title || "Unknown Title";
            const author = book.author || "Unknown Author";
            const thumbnail = book.thumbnail || book.thumbnailURL || "";
            const pdf = book.pdf || book.pdfURL || "";

            if (!pdf || !thumbnail) {
                console.error("🚨 Missing book data:", book);
                return;
            }

            // 📌 Create Book Card
            const bookCard = document.createElement("div");
            bookCard.className = "book-card";
            bookCard.innerHTML = `
                <img src="${thumbnail}" alt="${title}" class="book-thumbnail">
                <h3>${title}</h3>
                <p>Author: ${author}</p>
                <button onclick="downloadBook('${title}', '${author}', '${pdf}')">📖 Download</button>
            `;

            booksContainer.appendChild(bookCard);
        });
    } catch (error) {
        console.error("❌ Error loading books:", error);
        booksContainer.innerHTML = "<p>Error loading books. Please try again.</p>";
    }
}

// ✅ Function to Handle Book Download
function downloadBook(title, author, pdfURL) {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            // If user is not logged in, redirect to profile.html
            window.location.href = "profile.html";
        } else {
            const userEmail = user.email;
            console.log(`✅ User ${userEmail} is downloading: ${title}`);

            // ✅ Save Downloaded Book Info to Firestore under User's Email
            try {
                await addDoc(collection(db, `users/${userEmail}/downloads`), {
                    title: title,
                    author: author,
                    pdf: pdfURL,
                    timestamp: new Date()
                });

                // ✅ Save to Orders Collection (for `orders.html`)
                await addDoc(collection(db, "orders"), {
                    userEmail: userEmail,
                    title: title,
                    author: author,
                    pdf: pdfURL,
                    timestamp: new Date()
                });

                // ✅ Proceed with Download
                window.open(pdfURL, "_blank");
            } catch (error) {
                console.error("❌ Error saving download record:", error);
            }
        }
    });
}

// Attach downloadBook function to window to make it accessible globally
window.downloadBook = downloadBook;

// 📌 Load Books when Page Loads
loadBooks();

