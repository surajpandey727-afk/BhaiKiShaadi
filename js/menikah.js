// Get that hamburger menu cookin' //

// RSVP Configuration
const RSVP_ENDPOINT = "https://script.google.com/macros/s/AKfycbyhqnhsNT7RSKZINv7Y2jMUP5EBq6PLxYKVVVRc6TqQSVEs9GFcIsDdtJAliQ9Q2Morwg/exec";

document.addEventListener("DOMContentLoaded", function() {
  // ===== INVITATION POPUP MODAL =====
  var modal = document.getElementById("invitationModal");
  var openBtn = document.getElementById("openInvitation");
  var bgMusic = document.getElementById("bg-music");

  // Only process invitation modal if elements exist
  if (modal && openBtn) {
    // Ensure volume is set
    if (bgMusic) {
      bgMusic.volume = 0.5;
    }

    // Show modal on page load
    modal.classList.remove("hidden");
    
    // Close modal and play audio when "Open Invitation" is clicked
    openBtn.addEventListener("click", function() {
      modal.classList.add("hidden");
      
      // Play the audio
      if (bgMusic) {
        bgMusic.currentTime = 0;
        bgMusic.play().catch(function(error) {
          console.log("Audio playback failed: ", error);
        });
      }
    });
    
    // Close modal if user clicks outside the card
    modal.addEventListener("click", function(event) {
      if (event.target === modal) {
        modal.classList.add("hidden");

        if (bgMusic) {
          bgMusic.currentTime = 0;
          bgMusic.play().catch(function(error) {
            console.log("Audio playback failed: ", error);
          });
        }
      }
    });
  }
  // ===== END INVITATION POPUP MODAL =====
  
  // ===== RSVP MODAL =====
  var rsvpModal = document.getElementById("rsvpModal");
  var rsvpGroomBtn = document.getElementById("rsvpGroomBtn");
  var rsvpBrideBtn = document.getElementById("rsvpBrideBtn");
  var rsvpModalClose = document.getElementById("rsvpModalClose");
  var rsvpForm = document.getElementById("rsvpForm");
  var rsvpSideInput = document.getElementById("rsvpSide");
  
  // Only process RSVP modal if elements exist
  if (rsvpModal && rsvpForm) {
    // Open RSVP modal with side set
    function openRsvpModal(side) {
      resetRsvpForm();
      rsvpSideInput.value = side;
      rsvpModal.classList.remove("hidden");
      document.getElementById("rsvpFullName").focus();
    }
    
    // Close RSVP modal
    function closeRsvpModal() {
      rsvpModal.classList.add("hidden");
      resetRsvpForm();
    }
    
    // Reset form to initial state
    function resetRsvpForm() {
      rsvpForm.reset();
      document.querySelectorAll(".rsvp-error").forEach(function(el) {
        el.classList.remove("show");
        el.textContent = "";
      });
      document.getElementById("rsvpSuccess").classList.add("hidden");
      document.getElementById("rsvpErrorMsg").classList.add("hidden");
      document.getElementById("rsvpSubmitBtn").disabled = false;
      document.getElementById("rsvpSubmitBtn").textContent = "Submit RSVP";
    }
    
    // Validate form fields
    function validateRsvpForm() {
      let isValid = true;
      const fullName = document.getElementById("rsvpFullName").value.trim();
      const phone = document.getElementById("rsvpPhone").value.trim();
      const guests = document.getElementById("rsvpGuests").value.trim();
      
      // Clear previous errors
      document.querySelectorAll(".rsvp-error").forEach(function(el) {
        el.classList.remove("show");
        el.textContent = "";
      });
      
      // Validate Full Name
      if (!fullName) {
        document.getElementById("fullNameError").textContent = "Full name is required";
        document.getElementById("fullNameError").classList.add("show");
        isValid = false;
      }
      
      // Validate Phone
      if (!phone) {
        document.getElementById("phoneError").textContent = "Phone number is required";
        document.getElementById("phoneError").classList.add("show");
        isValid = false;
      } else if (!/^[\d\s+()-]{7,}$/.test(phone)) {
        document.getElementById("phoneError").textContent = "Please enter a valid phone number";
        document.getElementById("phoneError").classList.add("show");
        isValid = false;
      }
      
      // Validate Guests
      if (!guests) {
        document.getElementById("guestsError").textContent = "Number of guests is required";
        document.getElementById("guestsError").classList.add("show");
        isValid = false;
      } else if (parseInt(guests) < 1) {
        document.getElementById("guestsError").textContent = "At least 1 guest is required";
        document.getElementById("guestsError").classList.add("show");
        isValid = false;
      }
      
      return isValid;
    }
    
    // Handle form submission
    rsvpForm.addEventListener("submit", function(e) {
      e.preventDefault();
      
      // Validate
      if (!validateRsvpForm()) {
        return;
      }
      
      // Disable submit button
      var submitBtn = document.getElementById("rsvpSubmitBtn");
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting...";
      
      // Gather form data
      var formData = {
        fullName: document.getElementById("rsvpFullName").value.trim(),
        phone: document.getElementById("rsvpPhone").value.trim(),
        guests: parseInt(document.getElementById("rsvpGuests").value),
        side: document.getElementById("rsvpSide").value,
        message: document.getElementById("rsvpMessage").value.trim(),
        userAgent: navigator.userAgent,
        pageUrl: window.location.href
      };
      
      // Send to Apps Script
      fetch(RSVP_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(formData)
      })
      .then(function(response) {
        return response.text();
      })
      .then(function(text) {
        var data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.log("Invalid JSON response:", text);
          throw new Error("Invalid response from server");
        }

        submitBtn.textContent = "Submit RSVP";
        submitBtn.disabled = false;

        if (data.ok) {
          // Show success message
          document.getElementById("rsvpSuccess").classList.remove("hidden");

          // Close modal after 2 seconds
          setTimeout(function() {
            closeRsvpModal();
          }, 2000);
        } else {
          // Show error message
          document.getElementById("rsvpErrorMsg").classList.remove("hidden");
        }
      })
      .catch(function(error) {
        console.log("RSVP submission error:", error);
        document.getElementById("rsvpErrorMsg").classList.remove("hidden");
        submitBtn.textContent = "Submit RSVP";
        submitBtn.disabled = false;
      });
    });
    
    // Event listeners for RSVP buttons
    if (rsvpGroomBtn) {
      rsvpGroomBtn.addEventListener("click", function() {
        openRsvpModal("Groom");
      });
    }
    
    if (rsvpBrideBtn) {
      rsvpBrideBtn.addEventListener("click", function() {
        openRsvpModal("Bride");
      });
    }
    
    // Close modal button
    if (rsvpModalClose) {
      rsvpModalClose.addEventListener("click", function() {
        closeRsvpModal();
      });
    }
    
    // Close modal on overlay click
    rsvpModal.addEventListener("click", function(event) {
      if (event.target === rsvpModal || event.target.classList.contains("rsvp-modal-overlay")) {
        closeRsvpModal();
      }
    });
  }
  // ===== END RSVP MODAL =====
  
  // Get all "navbar-burger" elements
  var $navbarBurgers = Array.prototype.slice.call(
    document.querySelectorAll(".navbar-burger"),
    0
  );
  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {
    // Add a click event on each of them
    $navbarBurgers.forEach(function($el) {
      $el.addEventListener("click", function() {
        // Get the target from the "data-target" attribute
        var target = $el.dataset.target;
        var $target = document.getElementById(target);
        // Toggle the class on both the "navbar-burger" and the "navbar-menu"
        $el.classList.toggle("is-active");
        $target.classList.toggle("is-active");
      });
    });
  }
});

// Smooth Anchor Scrolling
$(document).on("click", 'a[href^="#"]', function(event) {
  event.preventDefault();
  $("html, body").animate(
    {
      scrollTop: $($.attr(this, "href")).offset().top
    },
    500
  );
});

// When the user scrolls down 20px from the top of the document, show the scroll up button
window.onscroll = function() {
  scrollFunction();
};

function scrollFunction() {
  const toTopBtn = document.getElementById("toTop");
  if (!toTopBtn) return; // Exit if element doesn't exist
  
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    toTopBtn.style.display = "block";
  } else {
    toTopBtn.style.display = "none";
  }
}

// Preloader - Hide on load, don't re-add
$(document).ready(function($) {
  $(".preloader-wrapper").fadeOut(500);
  $("body").removeClass("preloader-site");
});
