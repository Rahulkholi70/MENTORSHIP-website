import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import {
  getDatabase,
  ref as databaseRef,
  get,
  update,
  remove,
  push,
  set,
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-storage.js"; 
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
const storage = getStorage(app);

let userID = "";
const mentors = localStorage.getItem("type");

onAuthStateChanged(auth, (user) => {
  if (user) {
    userID = user.uid;
    fetchUserData(userID);
    fetchUserEvents(userID);
  } else {
    console.log("No user signed in.");
  }
}); 
document.getElementById("editBtn").addEventListener("click", handleEditSave);
document.getElementById("createEventBtn").addEventListener("click", createEvent);

function fetchUserData(userID) {
  const userRef = databaseRef(database, `${mentors}/${userID}`);
  get(userRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        populateUserProfile(userData);
        handleRequests(userData.requests);
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
    });
} 
function populateUserProfile(userData) {
  document.getElementById("fullName").innerText = userData.fullName;
  document.getElementById("UID").innerText = "UID: " + userID;
  document.getElementById("bio").innerText = userData.bio;
  document.getElementById("contact").innerText = userData.contact;
  document.getElementById("email").innerText = userData.email;
  document.getElementById("experience").innerText = userData.experience;
  document.getElementById("expertise").innerText = userData.expertise;
  document.getElementById("availability").innerText = userData.availability;
  document.getElementById("qualifications").innerText = userData.qualifications;
  document.getElementById("imga").src = userData.profilePicture || "default.png";
}
let mente = "";
function handleRequests(requests) {
  const requestList = document.getElementById("requestList");
  requestList.innerHTML = ""; 
  if (requests) {
    Object.keys(requests).forEach((requestID) => {
      const request = requests[requestID];
      const email = request.email;
      const date = request.date;
      const time = request.time;
       mente = request.userId;
      if (email && date && time && mente) {
        const requestElement = createRequestElement(requestID, email, date, time ,mente);
        requestList.appendChild(requestElement);
      }
    });
  } else {
    requestList.innerText = "No requests available";
  }
} 
function createRequestElement(requestID, email, date, time ,mente ) {
  const requestElement = document.createElement("div");
  requestElement.classList.add("request-btn");
  requestElement.innerHTML = `
    <span class="request-text">${email} scheduled at ${date}, ${time} ,${mente }</span>
    <span class="request-actions">
      <button class="btn btn-success accept-btn" data-request-id="${requestID}"  data-user-id="${mente}">✔</button>
      <button class="btn btn-danger delete-btn" data-request-id="${requestID}">✘</button>
    </span>
  `;
  requestElement.querySelector(".accept-btn").addEventListener("click", () => {
    acceptRequest(userID, requestID, email , mente ); 
  });
  requestElement.querySelector(".delete-btn").addEventListener("click", () => {
    deleteRequest(userID, requestID);
  });   
  return requestElement;
} 
function handleEditSave() {
  const fields = [
    "fullName",
    "bio",
    "email",
    "contact",
    "experience",
    "expertise",
    "availability",
    "qualifications",
  ];
  const fileInput = document.getElementById("fileInput");  
  if (this.innerText === "Edit") {
    enableEditing(fields, fileInput);
    this.innerText = "Save";
    this.classList.remove("btn-primary");
    this.classList.add("btn-success");
  } else {
    const updateData = gatherUpdatedData(fields);
    if (fileInput.files.length > 0) {
      uploadProfilePicture(fileInput.files[0], updateData);
    } else {
      updateUserProfile(updateData);
    }
    this.innerText = "Edit";
    this.classList.remove("btn-success");
    this.classList.add("btn-primary");
  }
} 
function enableEditing(fields, fileInput) {
  fields.forEach((field) => {
    const element = document.getElementById(field);
    const currentValue = element.innerText.trim();
    const input = document.createElement("input");
    input.type = "text";
    input.value = currentValue;
    input.classList.add("form-control");
    element.innerHTML = "";
    element.appendChild(input);
  });
  fileInput.style.display = "block";
} 
function gatherUpdatedData(fields) {
  const updateData = {};
  fields.forEach((field) => {
    const newValue = document.getElementById(field).querySelector("input").value;
    updateData[field] = newValue;
  });
  return updateData;
} 
function uploadProfilePicture(file, updateData) {
  const storageReference = storageRef(storage, `${mentors}/${userID}/profilePicture/${file.name}`);
  const uploadTask = uploadBytesResumable(storageReference, file); 
  uploadTask.on(
    "state_changed",
    (snapshot) => { 
    },
    (error) => {
      console.error("Error uploading file:", error);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref)
        .then((downloadURL) => {
          updateData.profilePicture = downloadURL;
          updateUserProfile(updateData);
        })
        .catch((error) => {
          console.error("Error getting download URL:", error);
        });
    }
  );
} 
function updateUserProfile(updateData) {
  const userRef = databaseRef(database, `${mentors}/${userID}`);
  update(userRef, updateData)
    .then(() => {
      console.log("Data updated successfully");
      alert("Profile Updated");
      location.reload();
    })
    .catch((error) => {
      console.error("Error updating data:", error);
    });
} 
function acceptRequest(userID, requestID, email, menteeID) {
  const mentorRequestRef = databaseRef(database, `${mentors}/${userID}/requests/${requestID}`);
  const menteeRequestRef = databaseRef(database, `mentees/${menteeID}/acceptedRequests/${requestID}`);
 
  get(mentorRequestRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const requestData = snapshot.val(); 
        const acceptedRequestRef = databaseRef(database, `${mentors}/${userID}/acceptedRequests/${requestID}`);
        return set(acceptedRequestRef, requestData);
      } else {
        console.log("Request data not found in mentor's requests.");
      }
    })
    .then(() => { 
      return remove(mentorRequestRef);
    })
    .then(() => {
      const userRef = databaseRef(database, `mentees/${menteeID}`);
      return get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            const acceptedRequests = userData.acceptedRequests || {};
            acceptedRequests[requestID] = {
              mentorID: userID,
              email: email,
            };
            return update(userRef, {
              acceptedRequests: acceptedRequests,
            });
          } else {
            console.log("Mentee data not found");
          }
        });
    })
    .then(() => {
      console.log(`Request from ${email} accepted.`);
      alert(`Request from ${email} accepted.`);
      fetchAcceptedRequests(userID); 
    })
    .catch((error) => {
      console.error("Error accepting request:", error);
    });
} 
function fetchAcceptedRequests(userID) {
  const acceptedRequestsRef = databaseRef(database, `${mentors}/${userID}/acceptedRequests`);
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
  const acceptedRequestList = document.getElementById("acceptedRequestList");
  acceptedRequestList.innerHTML = "";

  Object.keys(acceptedRequests).forEach((requestID) => {
    const request = acceptedRequests[requestID];
    const email = request.email;  
    const menteeID = request.userId;
     console.log(menteeID + "hello")

    const requestElement = createAcceptedRequestElement(requestID, email, menteeID);
    acceptedRequestList.appendChild(requestElement);
  });
}
function createAcceptedRequestElement(requestID, email, menteeID ) {
  const requestElement = document.createElement("div");
  requestElement.classList.add("accepted-request-item");
  requestElement.innerHTML = `
    <span class="accepted-request-text">${email} , ${menteeID}</span>
    <span class="accepted-request-actions">
      <button class="btn btn-primary join-call-btn" data-mentee-id="${menteeID}">join waiting room</button>
      <button class="btn btn-danger cancel-accept-btn" data-request-id="${requestID}">Cancel</button>
    </span>
  `;
  requestElement.querySelector(".join-call-btn").addEventListener("click", () => {
    joinVideoCall(menteeID);
  });
  requestElement.querySelector(".cancel-accept-btn").addEventListener("click", () => {
    cancelAcceptRequest(userID, requestID);
  });

  return requestElement;
}
function joinVideoCall(mentee) {
  localStorage.setItem('menteeID', mentee); 
  window.location.href = "video-call.html";
}
function displayNoAcceptedRequestsMessage() {
  const acceptedRequestList = document.getElementById("acceptedRequestList");
  acceptedRequestList.innerHTML = "<p>No accepted requests available.</p>";
}

function deleteRequest(userID, requestID) {
  const requestRef = databaseRef(database, `${mentors}/${userID}/requests/${requestID}`);
  remove(requestRef)
    .then(() => {
      alert("Request deleted.");
      // location.reload();
    })
    .catch((error) => {
      console.error("Error deleting request:", error);
    });
} 
function fetchUserEvents(userID) {
  const eventsRef = databaseRef(database, `${mentors}/${userID}/events`);
  get(eventsRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const events = snapshot.val();
        displayEvents(events);
      } else {
        console.log("No events available");
      }
    })
    .catch((error) => {
      console.error("Error fetching events:", error);
    });
} 
function displayEvents(events) {
  const eventList = document.getElementById("eventList");
  eventList.innerHTML = "";

  Object.keys(events).forEach((eventID) => {
    const event = events[eventID];
    const eventElement = createEventElement(eventID, event);
    eventList.appendChild(eventElement);
  });
} 
function createEventElement(eventID, event) {
  const eventElement = document.createElement("div");
  eventElement.classList.add("event-item");
  eventElement.innerHTML = `
    <span class="event-text">${event.Eventtitle} on ${event.date} at ${event.time}</span>
    <span class="event-actions">
    <button class="btn btn-primary join-event-btn" data-event-id="${eventID}">Join</button>
    </span>
    `;
    // <button class="btn btn-danger delete-event-btn" data-event-id="${eventID}">✘</button> use for deleteing join rqt
  eventElement.querySelector(".delete-event-btn").addEventListener("click", () => {
    deleteEvent(userID, eventID);
  });
  eventElement.querySelector(".join-event-btn").addEventListener("click", () => {
    joinEvent(userID, eventID);
  });
  return eventElement;
}  
function createEvent() {
  const eventName = document.getElementById("eventName").value;
  const eventDate = document.getElementById("eventDate").value;
  const eventTime = document.getElementById("eventTime").value; 
  if (eventName && eventDate && eventTime) {
    const eventsRef = databaseRef(database, `${mentors}/${userID}/events`);
    const newEventRef = push(eventsRef);
    set(newEventRef, {
      Eventtitle: eventName,
      date: eventDate,
      time: eventTime,
    })
      .then(() => {
        alert("Event created successfully");
        location.reload();
      })
      .catch((error) => {
        console.error("Error creating event:", error);
      });
  } else {
    alert("Please fill out all event fields.");
  }
} 
function deleteEvent(userID, eventID) {
  const eventRef = databaseRef(database, `${mentors}/${userID}/events/${eventID}`);
  remove(eventRef)
    .then(() => {
      alert("Event deleted.");
      location.reload();
    })
    .catch((error) => {
      console.error("Error deleting event:", error);
    });
} 
function joinEvent(userID, eventID) {
  const eventRef = databaseRef(database, `${mentors}/${userID}/events/${eventID}/attendees`);
  const newAttendeeRef = push(eventRef);
  set(newAttendeeRef, {
    userID: auth.currentUser.uid,
  })
    .then(() => {
      alert("Joined event successfully.");
    })
    .catch((error) => {
      console.error("Error joining event:", error);
    });
}
