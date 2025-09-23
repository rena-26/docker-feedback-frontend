// Category → Apps mapping
const categoryToApps = {
  food: ["Zomato", "Swiggy"],
  clothing: ["Amazon", "Flipkart", "Meesho", "Myntra"],
  electronics: ["Flipkart", "Amazon"],
  ridesharing: ["Rapido", "Uber", "Ola"],
  beauty: ["Purplle", "Nykaa", "Smytten"]
};

const categorySelect = document.getElementById("categorySelect");
const appSelect = document.getElementById("appSelect");
const panel = document.getElementById("panel");
const selectionPanel = document.getElementById("selectionPanel");

// Redirect if not logged in
if (!localStorage.getItem("loggedIn")) {
  window.location.href = "index.html";
}

// Populate app dropdown
if (categorySelect) {
  categorySelect.addEventListener("change", function () {
    const selectedCategory = this.value;
    appSelect.innerHTML = '<option value="">--Select App--</option>';
    if (categoryToApps[selectedCategory]) {
      categoryToApps[selectedCategory].forEach(app => {
        const option = document.createElement("option");
        option.value = app.toLowerCase();
        option.textContent = app;
        appSelect.appendChild(option);
      });
      appSelect.disabled = false;
    } else {
      appSelect.disabled = true;
    }
  });
}

// Proceed to feedback
function proceedToFeedback() {
  const category = categorySelect.value;
  const app = appSelect.value;
  if (!category || !app) {
    alert("Please select both category and app.");
    return;
  }
  sessionStorage.setItem("selectedApp", app);
  if (selectionPanel) selectionPanel.style.display = "none";
  if (panel) panel.style.display = "block";

  const appHeading = document.getElementById("appHeading");
  if (appHeading) {
    appHeading.innerHTML = `How satisfied are you with <br /> <span style="color: #333;">${app}</span>'s performance?`;
  }
}

// Logout function
function logout() {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("username");
  sessionStorage.removeItem("selectedApp");
  window.location.href = "index.html";
}

// Feedback logic
if (panel) {
  const ratings = document.querySelectorAll(".rating");
  const ratingsContainer = document.querySelector(".ratings-container");
  const sendButton = document.getElementById("send");
  const viewHistoryButton = document.getElementById("viewHistory");
  const feedbackList = document.getElementById("feedbackList");
  const historySection = document.getElementById("historySection");
  let selectedRating = "Satisfied";

  const removeActive = () => ratings.forEach(r => r.classList.remove("active"));

  // Rating click
  ratingsContainer.addEventListener("click", (e) => {
    if (e.target.closest(".rating")) {
      removeActive();
      const ratingDiv = e.target.closest(".rating");
      ratingDiv.classList.add("active");
      selectedRating = ratingDiv.querySelector("small").innerText;
    }
  });

  // Send feedback
  sendButton.addEventListener("click", () => {
    const feedbackText = document.getElementById("feedbackText").value.trim();
    const selectedApp = sessionStorage.getItem("selectedApp");
    if (!selectedApp) return alert("No app selected!");

    const feedback = {
      app: selectedApp,
      rating: selectedRating,
      comment: feedbackText || "No additional comments provided.",
      timestamp: new Date().toLocaleString()
    };

    let feedbackHistory = JSON.parse(localStorage.getItem("feedbackHistory")) || [];
    feedbackHistory.push(feedback);
    localStorage.setItem("feedbackHistory", JSON.stringify(feedbackHistory));

    panel.innerHTML = `
      <i class="fas fa-heart"></i>
      <strong>Thank You!</strong><br>
      <strong>App: ${feedback.app}</strong><br/>
      <strong>Feedback: ${feedback.rating}</strong>
      <p>Your Comment: ${feedback.comment}</p>
      <p>We'll use your feedback to improve our services.</p>
      <button onclick="window.location.reload()">Go Back</button>
    `;
  });

  // View history (only last 2 feedbacks)
  viewHistoryButton.addEventListener("click", () => {
    historySection.style.display = "block";
    feedbackList.innerHTML = "";

    let history = JSON.parse(localStorage.getItem("feedbackHistory")) || [];

    // Keep only last 2 feedbacks
    if (history.length > 2) {
      history = history.slice(-2);
      localStorage.setItem("feedbackHistory", JSON.stringify(history));
    }

    if (!history.length) {
      feedbackList.innerHTML = "<li>No past feedback found.</li>";
      return;
    }

    history.forEach(item => {
      feedbackList.innerHTML += `
        <li>
          <strong>${item.timestamp}</strong><br/>
          App: ${item.app}<br/>
          Rating: ${item.rating}<br/>
          Comment: ${item.comment}
        </li>
      `;
    });
  });
}
