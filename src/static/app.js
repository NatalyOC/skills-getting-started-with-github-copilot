document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";
      activitySelect.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const spotsLeft = details.max_participants - details.participants.length;

        const participantsList = details.participants.length > 0 
          ? (() => {
              const ul = document.createElement("ul");
              ul.className = "participants-list";
              details.participants.forEach(email => {
                const li = document.createElement("li");
                li.className = "participant-item";
                li.textContent = email;
                const span = document.createElement("span");
                span.className = "remove-participant";
                span.textContent = "×";
                span.addEventListener("click", () => unregister(name, email));
                li.appendChild(span);
                ul.appendChild(li);
              });
              return ul;
            })()
          : (() => {
              const p = document.createElement("p");
              p.className = "no-participants";
              p.textContent = "No participants yet.";
              return p;
            })();

        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const h4 = document.createElement("h4");
        h4.textContent = name;
        activityCard.appendChild(h4);

        const descP = document.createElement("p");
        descP.textContent = details.description;
        activityCard.appendChild(descP);

        const scheduleP = document.createElement("p");
        const scheduleStrong = document.createElement("strong");
        scheduleStrong.textContent = "Schedule: ";
        scheduleP.appendChild(scheduleStrong);
        scheduleP.appendChild(document.createTextNode(details.schedule));
        activityCard.appendChild(scheduleP);

        const availabilityP = document.createElement("p");
        const availStrong = document.createElement("strong");
        availStrong.textContent = "Availability: ";
        availabilityP.appendChild(availStrong);
        availabilityP.appendChild(document.createTextNode(`${spotsLeft} spots left`));
        activityCard.appendChild(availabilityP);

        const participantsP = document.createElement("p");
        const partStrong = document.createElement("strong");
        partStrong.className = "participants-title";
        partStrong.textContent = "Participants:";
        participantsP.appendChild(partStrong);

        const participantsSection = document.createElement("div");
        participantsSection.className = "participants-section";
        participantsSection.appendChild(participantsP);
        participantsSection.appendChild(participantsList);

        activityCard.appendChild(participantsSection);

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Function to unregister a participant
  async function unregister(activityName, email) {
    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activityName)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Refresh activities to show updated participants
        fetchActivities();
      } else {
        const result = await response.json();
        alert(result.detail || "Failed to unregister");
      }
    } catch (error) {
      alert("Failed to unregister. Please try again.");
      console.error("Error unregistering:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
        // Refresh activities to show updated participants
        fetchActivities();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
