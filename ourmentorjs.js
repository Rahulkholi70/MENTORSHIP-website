import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCOBszRefXYAFRCywzQ6ac-RcSJr7XgHfI",
  authDomain: "mentorshala-web.firebaseapp.com",
  databaseURL: "https://mentorshala-web-default-rtdb.firebaseio.com",
  projectId: "mentorshala-web",
  storageBucket: "mentorshala-web.appspot.com",
  messagingSenderId: "794994820774",
  appId: "1:794994820774:web:6b9f0b12d9e5fa08bf1667",
  measurementId: "G-7LMYBSX7D3",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function handleClick(mentorUser) {
  localStorage.setItem("uid", mentorUser)
}
function createMentorCard(mentor) {
  const card = document.createElement("div");
  card.classList.add("col-md-4");

  card.innerHTML = `
  <div class="card">
    <img src="${mentor.profilePicture || 'useravatar.png'}" class="card-img-top" alt="${mentor.fullName || 'Mentor Image'}">
    <div class="card-body">
      <h5 class="card-title">${mentor.fullName || 'Unknown Mentor'}</h5>
      <p class="card-text">Expertise: ${mentor.expertise || 'Not specified'}</p>
      <p class="card-text">Bio: ${mentor.bio || 'No bio available'}</p>
      <button class="btn btn-primary btn-block apply-btn">Request</button>
    </div>
  </div>
`;

    const applyButton = card.querySelector('.apply-btn');
    applyButton.addEventListener('click', function() {
      handleClick(mentor.user);
    });
  return card;
} 
function fetchMentorData() {
  const mentorContainer = document.getElementById("mentorContainer");
  const mentorsRef = ref(database, "mentors");

  onValue(mentorsRef, (snapshot) => {
    mentorContainer.innerHTML = ""; // Clear existing mentor cards
    snapshot.forEach((childSnapshot) => {
      const mentor = childSnapshot.val();
      const mentorCard = createMentorCard(mentor);
      mentorContainer.appendChild(mentorCard);
    });

    // Add event listener to each Apply button
    const applyButtons = document.querySelectorAll(".apply-btn");
    applyButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Redirect to mentor application form page
        window.location.href = "mentordetails.html";
      });
    });
  });
}


document.addEventListener("DOMContentLoaded", fetchMentorData);
