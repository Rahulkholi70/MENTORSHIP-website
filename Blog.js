const select = document.querySelector('select');
let input = document.querySelector('input[type="text"]');
let options = document.querySelectorAll('option');

input.addEventListener('click',()=>{
    select.style.display = "block";
});

options.forEach((item) =>{
    console.log(item);
    item.addEventListener('click',()=>{
        input.value =item.text;
        select.style.display = "none";
    });
});

// handlings hamburger of course

const open_course = document.querySelector('.open_course');
const close_course = document.querySelector('.close_course');
let bob_2 = document.querySelector('.back-to-Blog2');


function checkMediaQuery() {
    if (window.matchMedia("(max-width: 974px)").matches) {
        // Media query matches, run your script here
        console.log("Media query matches. Running script...");
        // Your script goes here


open_course.addEventListener('click',()=>{
//   open_course.style.transform = "rotate(0deg)";
//   open_course.style.transition = "all ease-in-out 0.2s";
  const timeOut = bob_2.style.display = "flex";
  setTimeout(timeOut,1000);
  open_course.style.display = "none";
  close_course.style.display = "block";
    
});

close_course.addEventListener('click',()=>{
    // close_course.style.transform = "rotate(180deg)";
    // close_course.style.transition = "all ease-in-out 0.2s";
    const timeOut_2 = bob_2.style.display = "none";
    setTimeout(timeOut_2,1000);
    open_course.style.display = "block";
    close_course.style.display = "none";
});
    } else {
        // Media query doesn't match
        console.log("Media query doesn't match. Script not executed.");
        bob_2.style.display = "none";
    }
}

// Run checkMediaQuery on load and on resize
window.onload = checkMediaQuery;
window.addEventListener('resize', checkMediaQuery);


document.getElementById("searchButton").addEventListener("click", function() {
    var selectedOption = document.getElementById("selectOption").value;
    if (selectedOption) {
        window.location.href = selectedOption;
    } else {
        alert("Please select an option.");
    }
});

