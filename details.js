import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getDatabase, ref, onValue, push, get } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";

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
const db = getDatabase(app);
const auth = getAuth(app);

function fetchMentorDetails() {
  const mentorId = localStorage.getItem("uid");
  if (!mentorId) {
    console.log("No mentor ID found in local storage");
    return;
  }
  const mentorRef = ref(db, 'mentors/' + mentorId);
  onValue(mentorRef, (snapshot) => {
    const mentor = snapshot.val();
    if (mentor) {
      displayMentorDetails(mentor);
    } else {
      console.log("Mentor not found");
    }
  });
} 
function displayMentorDetails(mentor) {
  document.getElementById('fullName').textContent = mentor.fullName;
  document.getElementById('expertise').textContent = "Expertise: " + mentor.expertise;
  document.getElementById('bio').textContent = "Bio: " + mentor.bio;
  document.getElementById('contact').textContent = "Contact: " + mentor.contact;
  document.getElementById('email').textContent = "Email: " + mentor.email;
  document.getElementById('experience').textContent = "Experience: " + mentor.experience;
  document.getElementById('motivation').textContent = "Motivation: " + mentor.motivation;
  document.getElementById('qualifications').textContent = "Qualifications: " + mentor.qualifications;

  const mentorImage = document.getElementById('mentorImage');
  mentorImage.src = mentor.profilePicture || 'useravatar.png';
} 

async function sendRequest() {
  const mentorId = localStorage.getItem("uid");
  const currentUser = auth.currentUser;
  if (!currentUser) {
    console.log("User not logged in");
    alert("You are not logged in. Please log in to send request to mentor.");
    return;
  }
  const userEmail = currentUser.email;
  const userId = currentUser.uid;

  if (!mentorId) {
    console.log("No mentor ID found in local storage");
    return;
  }
  if (!userEmail) {
    console.log("User email not found");
    return;
  }

  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value; 
  
  if (!date || !time) {
    alert('Please select both date and time');
    return;
  }
  const mentorRef = ref(db, 'users/' + userId);
  const mentorSnapshot = await get(mentorRef);
  const mentorData = mentorSnapshot.val();
  const mentorFullName = mentorData?.fullName|| 'Unknown';

  const requestsRef = ref(db, 'mentors/' + mentorId + '/requests');
  const menteeRequestsRef = ref(db, 'mentees/' + userId + '/requests'); 

  const requestData = {
    userId: userId,
    email: userEmail,
    mentorFullName : mentorFullName,
    date: date,
    time: time
  };

  push(requestsRef, requestData).then(() => {
    return push(menteeRequestsRef, { ...requestData, mentorId: mentorId });
  }).then(() => {
    alert('Request sent and meeting scheduled successfully!');
    location.reload();
  }).catch(error => {
    console.error('Error sending request or scheduling meeting:', error);
  });
} 

document.addEventListener("DOMContentLoaded", () => {
  fetchMentorDetails();
  const requestBtn = document.getElementById('requestBtn');
  requestBtn.addEventListener('click', sendRequest);
});
