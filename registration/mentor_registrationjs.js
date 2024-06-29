
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCOBszRefXYAFRCywzQ6ac-RcSJr7XgHfI",
    authDomain: "mentorshala-web.firebaseapp.com",
    databaseURL: "https://mentorshala-web-default-rtdb.firebaseio.com",
    projectId: "mentorshala-web",
    storageBucket: "mentorshala-web.appspot.com",
    messagingSenderId: "794994820774",
    appId: "1:794994820774:web:6b9f0b12d9e5fa08bf1667",
    measurementId: "G-7LMYBSX7D3"
}; 
const app = initializeApp(firebaseConfig);
const database = getDatabase();  
const auth = getAuth(app); 
function registerMentor(event) {
    event.preventDefault(); 
 
    const fullName = document.getElementById('mentorFullName').value;
    const email = document.getElementById('mentorEmail').value;
    const password = document.getElementById('mentorPassword').value;
    const contact = document.getElementById('mentorPnumber').value;
    const expertise = document.getElementById('mentorExpertise').value;
    const experience = document.getElementById('mentorExperience').value;
    const bio = document.getElementById('mentorBio').value;
    const availability = document.getElementById('mentorAvailability').value;
    const qualifications = document.getElementById('mentorQualifications').value;
    const motivation = document.getElementById('mentorMotivation').value;
 
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => { 
            const user = userCredential.user; 
            set(ref(database, 'mentors/' + user.uid), {
                user:user.uid,
                fullName: fullName,
                email: email,
                password : password,
                contact : contact,
                expertise: expertise,
                experience: experience,
                bio: bio,
                availability: availability,
                qualifications: qualifications, 
                motivation: motivation
            }).then(() => { 
                alert('Mentor registration successful!');
                document.getElementById('mentorRegistrationForm').reset();  
                window.location.href = '/Loginpage/mentor_login.html';
            }).catch((error) => { 
                console.error('Error registering mentor: ', error);
                alert('Mentor registration failed. Please try again.');
            });
        })
        .catch((error) => { 
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Error registering mentor: ', errorMessage);
            alert('Mentor registration failed. Please try again.');
        });
}  
document.getElementById('mentorRegistrationForm').addEventListener('submit', registerMentor);
