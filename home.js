document.addEventListener('DOMContentLoaded', function() {
  const type = localStorage.getItem('type');
  const isLoggedIn = type;

  document.querySelectorAll('#profile-button').forEach(button => {
    button.addEventListener('click', function() {
      if (isLoggedIn) {
        if (type === 'mentees') {
          window.location.href = '/dashboards/mentee_profile.html';
        } else if (type === 'mentors') {
          window.location.href = '/dashboards/mentor_profile.html';
        } else {
          alert('User type not recognized. Please log in again.');
        }
      } else {
        alert('You must be logged in to access your profile.');
      }
    });
  });
  document.querySelectorAll('#logout-button').forEach(button => {
    button.addEventListener('click', function() {
      localStorage.clear();
      window.location.href = '/registration/mentee_registration.html';
    });
  });
}); 
