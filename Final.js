// Hamburger Menu Toggle
const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".nav-list ul");
const menuItems = document.querySelectorAll(".nav-list ul li a");
const header = document.querySelector(".header.container");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  mobileMenu.classList.toggle("active");
});

menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    hamburger.classList.remove("active");
    mobileMenu.classList.remove("active");
  });
});

// Hero Video Playback Handling
document.addEventListener("DOMContentLoaded", () => {
  const video = document.querySelector("#hero video");

  const enableVideoPlayback = () => {
    if (video) {
      video.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    }
    document.removeEventListener("click", enableVideoPlayback);
    document.removeEventListener("keydown", enableVideoPlayback);
  };

  document.addEventListener("click", enableVideoPlayback);
  document.addEventListener("keydown", enableVideoPlayback);
});

// Header Background Change on Scroll
document.addEventListener("scroll", () => {
  const scrollPosition = window.scrollY;
  header.style.backgroundColor = scrollPosition > 250 ? "#29323c" : "transparent";
});
function initLoader() {
    console.log('Initializing loader...');
    document.body.classList.add('loaded');
  }
  
// Chatbot Functionality
const chatbotIcon = document.getElementById("chatbot-icon");
const chatbotWindow = document.getElementById("chatbot-window");
const sendButton = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const messagesContainer = document.getElementById("messages");

chatbotIcon?.addEventListener("click", () => {
  chatbotWindow.style.display = chatbotWindow.style.display === "block" ? "none" : "block";
});

const getBotResponse = async (userMessage) => {
  try {
    const response = await fetch('http://localhost:3000/api/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await response.json();

    if (data.error) {
      console.error('OpenAI API error:', data.error);
      throw new Error('Error fetching OpenAI response');
    }

    return data.reply;
  } catch (error) {
    console.error('Error fetching chatbot response:', error);
    throw new Error('Failed to process your request');
  }
};

const sendMessage = async () => {
  const message = userInput.value.trim();

  if (message) {
    const userMessage = document.createElement("div");
    userMessage.classList.add("message");
    userMessage.textContent = `You: ${message}`;
    messagesContainer.appendChild(userMessage);

    userInput.value = "";

    try {
      const botResponse = await getBotResponse(message);

      const botMessage = document.createElement("div");
      botMessage.classList.add("message");
      botMessage.textContent = `Bot: ${botResponse}`;
      messagesContainer.appendChild(botMessage);

      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } catch (error) {
      const botError = document.createElement("div");
      botError.classList.add("message");
      botError.textContent = "Bot: Sorry, I couldn't understand that.";
      messagesContainer.appendChild(botError);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }
};

sendButton?.addEventListener("click", sendMessage);
userInput?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

// Data Store for Contact Form
document.querySelector('.form-container').addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent form reload

  const fullName = document.querySelector('.form-field[placeholder="Full Name"]').value;
  const email = document.querySelector('.form-field[placeholder="Email"]').value;
  const message = document.querySelector('.form-field[placeholder="Type your message..."]').value;

  const formData = { name: fullName, email, message };

  try {
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    if (response.ok) {
      const responseData = await response.json();
      alert('Your message has been sent successfully!');
      document.querySelector('.form-container').reset();
    } else {
      const error = await response.text();
      alert(`Error: ${error}`);
    }
  } catch (error) {
    console.error('Error submitting the form:', error);
    alert('An error occurred. Please try again later.');
  }
});



// Projects Slider Functionality
document.getElementById("next-btn")?.addEventListener("click", () => {
  const container = document.querySelector(".projects-slider-container");
  container.scrollBy({ left: 320, behavior: "smooth" });
});

document.getElementById("prev-btn")?.addEventListener("click", () => {
  const container = document.querySelector(".projects-slider-container");
  container.scrollBy({ left: -320, behavior: "smooth" });
});

// Loader Functionality
document.addEventListener("DOMContentLoaded", () => {
    // Wait for all images to load
    const images = document.querySelectorAll("img");
    const totalImages = images.length;
    let loadedImages = 1;

    images.forEach((img) => {
        img.addEventListener("load", () => {
            loadedImages++;
            const loadProgress = (loadedImages / totalImages) * 4000;

            // Update the loader progress bar
            const loaderProgress = document.querySelector(".loader-progress");

            if (loaderProgress) {
              loaderProgress.style.width = `${loadProgress}%`;
            }

            // Hide loader once all images are loaded
            if (loadedImages === totalImages) {
                document.body.classList.add("loaded");
            }
        });

        // Fallback for cached images
        if (img.complete) {
            img.dispatchEvent(new Event("load"));
        }
    });

    // Fallback timeout if images fail to load
    setTimeout(() => {
        document.body.classList.add("loaded");
    }, 5000); // Maximum wait time of 5 seconds
});

// Slider Functionality
const buttons = {
  prev: document.querySelector(".btn--left"),
  next: document.querySelector(".btn--right"),
};
const cards = document.querySelectorAll(".card");
let currentIndex = 0;

function updateCards() {
  cards.forEach((card, index) => {
    card.classList.remove("current--card", "next--card", "previous--card");

    if (index === currentIndex) {
      card.classList.add("current--card");
    } else if (index === (currentIndex + 1) % cards.length) {
      card.classList.add("next--card");
    } else if (index === (currentIndex - 1 + cards.length) % cards.length) {
      card.classList.add("previous--card");
    }
  });
}

buttons.next?.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % cards.length;
  updateCards();
});

buttons.prev?.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + cards.length) % cards.length;
  updateCards();
});

function initSlider() {
  updateCards();
}

document.addEventListener("DOMContentLoaded", () => {
  initLoader();
});


// Data Store for Contact Form
document.querySelector('.form-container').addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent form reload

  const fullName = document.querySelector('.form-field[placeholder="Full Name"]').value;
  const email = document.querySelector('.form-field[placeholder="Email"]').value;
  const message = document.querySelector('.form-field[placeholder="Type your message..."]').value;

  const formData = { name: fullName, email, message };

  try {
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    if (response.ok) {
      // Try parsing JSON if response is successful
      const responseData = await response.json();
      alert('Your message has been sent successfully!');
      document.querySelector('.form-container').reset();
    } else {
      // Handle failed response
      const error = await response.text(); // Use text() to capture the raw response if JSON parsing fails
      alert(`Error: ${error}`);
    }
    
  } catch (error) {
    console.error('Error submitting the form:', error);
    alert('An error occurred. Please try again later.');
  }
});
