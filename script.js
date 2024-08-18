// Import functions from Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDII00dFmMfzfmZ4k_F4YUdM62_QJvc6H4",
    authDomain: "time-capsule-creator.firebaseapp.com",
    projectId: "time-capsule-creator",
    storageBucket: "time-capsule-creator.appspot.com",
    messagingSenderId: "1024766528542",
    appId: "1:1024766528542:web:83e74c7c3424825462f20f",
    measurementId: "G-E402EYXBG1"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to generate a unique identifier
function generateUniqueId() {
    return 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, function () {
        return (Math.random() * 16 | 0).toString(16);
    });
}

// Create a Time Capsule
async function createTimeCapsule(message, mediaUrl, openDate) {
    const uniqueId = generateUniqueId();
    await addDoc(collection(db, "timeCapsules"), {
        message,
        mediaUrl,
        openDate,
        uniqueId
    });
    return uniqueId; // Return the unique ID for the created time capsule
}

// Retrieve Time Capsules
async function getTimeCapsule(uniqueId) {
    const q = query(collection(db, "timeCapsules"), where("uniqueId", "==", uniqueId));
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        startCountdown(data.openDate, data.message, data.mediaUrl); // Pass the message and media URL to the countdown
    });
}

// Start Countdown Timer
function startCountdown(openDate, message, mediaUrl) {
    const countdownDisplay = document.getElementById("countdown");
    const openTime = new Date(openDate).getTime();

    const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = openTime - now;

        // Calculate time components
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result
        countdownDisplay.innerHTML = `Countdown to open: ${days}d ${hours}h ${minutes}m ${seconds}s`;

        // If the countdown is over, display the message and clear the interval
        if (distance < 0) {
            clearInterval(countdownInterval);
            countdownDisplay.innerHTML = "Time Capsule is now open!";
            displayTimeCapsuleMessage(message, mediaUrl); // Show message only after countdown ends
        }
    }, 1000);
}

// Display Time Capsule Message
function displayTimeCapsuleMessage(message, mediaUrl) {
    const messageDisplay = document.getElementById("messageDisplay");
    messageDisplay.innerHTML = `Message: ${message} <br> Media: ${mediaUrl ? `<a href="${mediaUrl}" target="_blank">View Media</a>` : "No media provided."}`;
}

// Event listener for form submission to create a time capsule
document.getElementById("timeCapsuleForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent default form submission

    const message = document.getElementById("messageInput").value;
    const mediaUrl = document.getElementById("mediaInput").value;
    const openDate = new Date(document.getElementById("openDateInput").value).getTime();

    const uniqueId = await createTimeCapsule(message, mediaUrl, openDate);
    alert(`Time capsule created! Your unique ID is: ${uniqueId}`);
});

// Event listener for form submission to retrieve a time capsule
document.getElementById("retrieveForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent default form submission
    const uniqueId = document.getElementById("uniqueIdInput").value;
    await getTimeCapsule(uniqueId);
});
