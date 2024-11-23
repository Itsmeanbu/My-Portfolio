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

const chatbotContainer = document.getElementById('chatbot-container');
const chatbotMessages = document.getElementById('chatbot-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// Toggle Chatbot Visibility
function toggleChatbot() {
    if (chatbotContainer.style.display === 'none' || !chatbotContainer.style.display) {
        chatbotContainer.style.display = 'flex'; // Show
    } else {
        chatbotContainer.style.display = 'none'; // Hide
    }
}

// Send Message
sendButton.addEventListener('click', () => {
    const userMessage = userInput.value.trim();
    if (userMessage) {
        appendMessage(userMessage, 'user');
        setTimeout(() => {
            appendMessage(getBotReply(userMessage), 'bot');
        }, 500);
        userInput.value = '';
    }
});
// Toggle Chatbot Visibility
function toggleChatbot() {
  const chatbotContainer = document.getElementById('chatbot-container');
  const displayStyle = chatbotContainer.style.display;

  chatbotContainer.style.display = displayStyle === 'block' ? 'none' : 'block';
}

// Send User Message and Generate Chatbot Reply
function sendMessage() {
  const userInput = document.getElementById('user-input').value.trim();
  const messagesContainer = document.getElementById('chatbot-messages');

  if (userInput === '') return;

  // Add User Message
  const userMessage = document.createElement('div');
  userMessage.style.textAlign = 'right';
  userMessage.style.marginBottom = '10px';
  userMessage.innerHTML = `<span style="background: #37517e; color: white; padding: 5px 10px; border-radius: 10px;">${userInput}</span>`;
  messagesContainer.appendChild(userMessage);

  // Generate Chatbot Reply
  const botReply = getChatbotReply(userInput);
  const botMessage = document.createElement('div');
  botMessage.style.textAlign = 'left';
  botMessage.style.marginBottom = '10px';
  botMessage.innerHTML = `<span style="background: #ddd; padding: 5px 10px; border-radius: 10px;">${botReply}</span>`;
  messagesContainer.appendChild(botMessage);

  // Clear Input
  document.getElementById('user-input').value = '';

  // Scroll to the Bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Generate Intelligent Replies
function getChatbotReply(message) {
  message = message.toLowerCase();

  // Example intelligent responses
  if (message.includes('your name')) {
      return 'Hi! I’m your friendly portfolio assistant. 😊';
  } else if (message.includes('projects')) {
      return 'You can check out my awesome projects in the portfolio section above! 🚀';
  } else if (message.includes('contact')) {
      return 'Feel free to reach out via the contact form or my email. 📧';
  } else if (message.includes('skills')) {
      return 'I specialize in front-end development, Python, and cybersecurity. 💻';
  } else {
      return "I'm here to assist! Ask me anything about this portfolio. 😄";
  }
      }
