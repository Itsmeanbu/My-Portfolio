let menuToggle = document.getElementById("menu-toggle");

let closeSidebar = document.getElementById("toggle-close");

let header = document.getElementById("header");

let isSlide = true;

let openSidebar = () => {

  header.style.transform = "translateX(0px)";

  isSlide = false;

};

let closeSidebarFn = () => {

  header.style.transform = "translateX(-300px)";

  isSlide = true;

};

let sideBar = () => {

  if (isSlide) {

    openSidebar();

  } else {

    closeSidebarFn();

  }

};

menuToggle.addEventListener("click", sideBar);

closeSidebar.addEventListener("click", closeSidebarFn);

const sideBar2 = () => {

  if (window.innerWidth >= 768) {

    header.style.transform = "translateX(0px)";

  } else if (window.innerWidth <= 768) {

    header.style.transform = "translateX(-300px)";

  }

};

window.onresize = sideBar2;

sideBar2();

// const formHandle = (e) => {

//     e.preventDefault();

//     let name = document.getElementById("name").value;

//     console.log("Name:", name);

    

//     let email = document.getElementById("email").value;

//     console.log("Email:", email);

//     let message = document.getElementById("message").value;

//     console.log("Message:", message);

//     if (name === "" || email === "" || message === "") {

//         alert("Please fill out all fields")

//     } else {

//         alert("Enquiry submitted successfully !")

//     }

// };

document.addEventListener('DOMContentLoaded', function() {

    emailjs.init('xIzA1UmZ_M3sxdoNG');

    document.getElementById('contact-form').addEventListener('submit', function(event) {

        event.preventDefault();

        emailjs.sendForm('service_avnyqzq', 'template_yys8jug', this)

            .then(function(response) {

                alert('Email sent successfully!');

                document.getElementById('contact-form').reset();

            }, function(error) {

                alert('Failed to send email. Please try again later.');

                console.error('EmailJS error:', error);

            });

    });

});