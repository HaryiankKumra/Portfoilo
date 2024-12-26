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

// Chatbot Functionality
const chatbotIcon = document.getElementById("chatbot-icon");
const chatbotWindow = document.getElementById("chatbot-window");
const sendButton = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const messagesContainer = document.getElementById("messages");

chatbotIcon?.addEventListener("click", () => {
  chatbotWindow.style.display = chatbotWindow.style.display === "block" ? "none" : "block";
});

async function sendMessage() {
  const message = userInput.value.trim();

  if (message) {
    // Display user message
    const userMessage = document.createElement("div");
    userMessage.classList.add("message");
    userMessage.textContent = `You: ${message}`;
    messagesContainer.appendChild(userMessage);

    userInput.value = "";

    // Get bot response
    const botResponse = await getBotResponse(message);

    // Display bot response
    const botMessage = document.createElement("div");
    botMessage.classList.add("message");
    botMessage.textContent = `Bot: ${botResponse}`;
    messagesContainer.appendChild(botMessage);

    // Scroll to latest message
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

sendButton?.addEventListener("click", sendMessage);
userInput?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

async function getBotResponse(userMessage) {
  const apiUrl = "https://api.openai.com/v1/chat/completions";
  const apiKey = "your_openai_api_key_here"; // Replace with your OpenAI API key

  const requestPayload = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: userMessage }],
    max_tokens: 150,
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestPayload),
    });

    const data = await response.json();

    if (data.error) {
      console.error("Error:", data.error);
      return "Sorry, there was an issue with the request.";
    }

    return data.choices?.[0]?.message?.content?.trim() || "Sorry, I didn\'t get that.";
  } catch (error) {
    console.error("Error fetching bot response:", error);
    return "Sorry, there was an error processing your request.";
  }
}

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
            const loaderProgress = document.querySelector(".loader-progress::before");
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


//data store
// Data store for contact form
document.querySelector('.form-container').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const fullName = document.querySelector('.form-field[placeholder="Full Name"]').value;
    const email = document.querySelector('.form-field[placeholder="Email"]').value;
    const message = document.querySelector('.form-field[placeholder="Type your message..."]').value;
  
    const formData = { name: fullName, email, message };
  
    try {
      const response = await fetch('https://portfoilo-bay.vercel.app/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        alert('Your message has been sent successfully!');
        document.querySelector('.form-container').reset();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
      alert('An error occurred. Please try again later.');
    }
  });
  
  