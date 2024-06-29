import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";
import {
  getAuth,
  signInWithEmailAndPassword,
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
const db = getDatabase(app);

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault(); 
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try { 
      const userCredential = await signInWithEmailAndPassword(auth, email, password); 
      const user = userCredential.user;
      console.log("User signed in:", user.email);
      alert("Login successful! ");
      localStorage.setItem("type", "mentors")
      window.location.href = '../home.html'; 
    } catch (error) { 
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error signing in:", errorCode, errorMessage);
      alert("Something Went Wrong. Please try again!");
    }
  });
  });