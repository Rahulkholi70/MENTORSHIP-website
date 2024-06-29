
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword, 
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
const firebaseConfig = {
    apiKey: "AIzaSyCOBszRefXYAFRCywzQ6ac-RcSJr7XgHfI",
    authDomain: "mentorshala-web.firebaseapp.com",
    projectId: "mentorshala-web",
    storageBucket: "mentorshala-web.appspot.com",
    messagingSenderId: "794994820774",
    appId: "1:794994820774:web:6b9f0b12d9e5fa08bf1667",
    measurementId: "G-7LMYBSX7D3"
  };
  const app = initializeApp(firebaseConfig); 
    const database = getDatabase();
    const auth = getAuth(app); 
    document.getElementById('menteeRegistrationForm').addEventListener('submit', function (event) {
      event.preventDefault();   
      const fullName = document.getElementById('menteeFullName').value;
      const email = document.getElementById('menteeEmail').value;
      const password = document.getElementById('menteePassword').value;
      const field = document.getElementById('menteeField').value;
      const aboutMe = document.getElementById('aboutMe').value;
      const education = document.getElementById('menteeEducation').value; 
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user; 
          return set(ref(database, 'mentees/' + user.uid), {
            user:user.uid,
            fullName: fullName,
            email: email,
            field: field,
            aboutMe: aboutMe,
            education: education 
          });
        })
        .then(() => {
          alert('Mentee registered successfully!');
          document.getElementById('menteeRegistrationForm').reset();
          window.location.href = '/Loginpage/mentee_login.html';
        })
        .catch((error) => {
          if (error.code === 'auth/email-already-in-use') {
            alert('The email address is already in use by another email.');
          } else {
            console.error('Error creating new user in Firebase Authentication', error);
          }
        });
    });