import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  update,
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";

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
const auth = getAuth(app);
const database = getDatabase(app);

let userID = ""; // Variable to store current user's UID
const mentees = localStorage.getItem("type");

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    userID = user.uid;
    localStorage.setItem("mymenteuid",userID);
    fetchMenteeData(userID);
    fetchAcceptedRequests(userID);
  } else {
    console.log("No user signed in.");
  }
});
document.getElementById('editBtn').addEventListener('click', function () {
  const fields = ['fullName', 'aboutMe', 'contactInfo', 'education', 'skills', 'projects', 'activities'];
  if (this.innerText === 'Edit') {
    fields.forEach(field => {
      const element = document.getElementById(field);
      const currentValue = element.innerText.trim();
      const input = document.createElement('input');
      input.type = 'text';
      input.value = currentValue;
      input.classList.add('form-control');
      element.innerHTML = '';
      element.appendChild(input);
    });
    this.innerText = 'Save';
    this.classList.remove('btn-primary');
    this.classList.add('btn-success');
  } else {
    const updateData = {};
    fields.forEach(field => {
      const newValue = document.getElementById(field).querySelector('input').value;
      updateData[field] = newValue;
    });
    const userRef = ref(database, `${mentees}/${userID}`);
    update(userRef, updateData)
      .then(() => {
        console.log("Data updated successfully");
        alert("Profile Updated");
        location.reload();
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
    this.innerText = 'Edit';
    this.classList.remove('btn-success');
    this.classList.add('btn-primary');
  }
}); 
function fetchMenteeData(userID) {
  const userRef = ref(database, `${mentees}/${userID}`);
  get(userRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        document.getElementById("fullName").innerText = userData.fullName;
        document.getElementById("UID").innerText = "UID: " + userID;
        document.getElementById("aboutMe").innerText = userData.aboutMe;
        document.getElementById("contactInfo").innerText = userData.email;
        document.getElementById("education").innerText = userData.education;
        document.getElementById("skills").innerText = userData.skills;
        document.getElementById("projects").innerText = userData.projects;
        document.getElementById("activities").innerText = userData.activities;
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
    });
}

// Function to fetch accepted requests for the mentee
function fetchAcceptedRequests(userID) {
  const acceptedRequestsRef = ref(database, `mentees/${userID}/acceptedRequests`);
  get(acceptedRequestsRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const acceptedRequests = snapshot.val();
        displayAcceptedRequests(acceptedRequests);
      } else {
        console.log("No accepted requests available");
        displayNoAcceptedRequestsMessage();
      }
    })
    .catch((error) => {
      console.error("Error fetching accepted requests:", error);
    });
} 
function displayAcceptedRequests(acceptedRequests) {
  const requestList = document.getElementById("requestList");
  requestList.innerHTML = "";

  Object.keys(acceptedRequests).forEach((requestID) => {
    const request = acceptedRequests[requestID];
    const mentorID = request.mentorID; 
    const email = request.email; 
    const requestElement = createAcceptedRequestElement(requestID, email, mentorID);
    requestList.appendChild(requestElement);
  });
}
function createAcceptedRequestElement(requestID, email, mentorID) {
  const requestElement = document.createElement("div");
  requestElement.classList.add("accepted-request-item");
  requestElement.innerHTML = `
    <span class="accepted-request-text">${email}</span>
    <span class="accepted-request-actions">
      <button class="btn btn-primary join-call-btn" data-mentor-id="${mentorID}">Join Call</button>
      <button class="btn btn-danger cancel-accept-btn" data-request-id="${requestID}">Cancel</button>
    </span>
  `;
  requestElement.querySelector(".join-call-btn").addEventListener("click", () => {
    joinVideoCall(mentorID);
  });
  requestElement.querySelector(".cancel-accept-btn").addEventListener("click", () => {
    cancelAcceptRequest(userID, requestID);
  });

  return requestElement;
}
function joinVideoCall(mentorID) {
  const mentorRef = ref(database, `mentees/${localStorage.getItem('mymenteuid')}`);

  get(mentorRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const mentorData = snapshot.val();
        const roomID = mentorData.roomID;

        if (roomID) {
          window.location.href = `video-call.html?roomID=${roomID}`;
        } else {
          console.error("No roomID found for the mentor");
          alert("No room ID found for this mentor. <i> join 1 minute after given time let mentor join first<i>");
        }
      } else {
        console.error("No mentor data available");
        alert("No mentor data found.");
      }
    })
    .catch((error) => {
      console.error("Error fetching mentor data:", error);
      alert("Error fetching mentor data.");
    });
}
function displayNoAcceptedRequestsMessage() {
  const requestList = document.getElementById("requestList");
  requestList.innerHTML = "<p>No accepted requests available.</p>";
}
function cancelAcceptRequest(userID, requestID) {
  const requestRef = ref(database, `mentees/${userID}/acceptedRequests/${requestID}`);
  update(requestRef, null)
    .then(() => {
      alert("Accepted request canceled.");
      fetchAcceptedRequests(userID);
    })
    .catch((error) => {
      console.error("Error canceling accepted request:", error);
    });
}
