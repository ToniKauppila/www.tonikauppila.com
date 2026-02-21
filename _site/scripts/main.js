document.addEventListener('DOMContentLoaded', () => {
  // --- AOS Initialization ---
  if (typeof AOS !== 'undefined') {
    AOS.init({
      startEvent: 'DOMContentLoaded',
      duration: 500
    });
  }

  // --- Rellax Initialization ---
  if (typeof Rellax !== 'undefined') {
    const rellax = new Rellax('.rellax', {
      horizontal: false
    });

    const destroyRellax = (x) => {
      if (x.matches) {
        rellax.destroy();
      }
    };

    const x = window.matchMedia("(max-width: 600px)");
    destroyRellax(x);
    x.addListener(destroyRellax);
  }

  // --- Navbar Scroll Logic (index only: show/hide bottom mobile nav) ---
  const mobileNav = document.getElementById("mobile-nav-fp");
  if (mobileNav) {
    window.addEventListener('scroll', () => {
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mobileNav.style.bottom = "0px";
      } else {
        mobileNav.style.bottom = "-70px";
      }
    });
  }

  // --- Navbar hide on scroll (desktop top nav) ---
  const navbar = document.getElementById("navbar");
  if (navbar) {
    let prevScrollPos = window.pageYOffset;
    window.addEventListener('scroll', () => {
      const currentScrollPos = window.pageYOffset;
      navbar.style.top = prevScrollPos > currentScrollPos ? "0" : "-80px";
      prevScrollPos = currentScrollPos;
    });
  }

  // --- Smooth Scrolling for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
        // Update URL hash without jumping
        history.pushState(null, null, targetId);
      }
    });
  });

  // --- Modal Logic ---
  const modal = document.getElementById("myModal");
  const modalBtns = document.querySelectorAll("#modalBtn, #modalBtnMobile");
  const closeSpan = document.querySelector(".modal .close");

  if (modal) {
    modalBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        modal.style.display = "block";
      });
    });

    if (closeSpan) {
      closeSpan.addEventListener('click', () => {
        modal.style.display = "none";
      });
    }

    window.addEventListener('click', (event) => {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    });
  }

  // --- Form Button Animation ---
  const formButtons = document.querySelectorAll(".form-button");
  formButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.add("active");
    });
  });

  // --- Tippy Initialization ---
  if (typeof tippy !== 'undefined') {
    tippy('[data-tippy-content]', {
      offset: [0, 16],
    });
  }
});


// --- Slideshow Logic (Exposed to global scope as HTML might use inline calls or just to be safe if we keep the structure) ---
// Actually, the original code had inline `onclick="plusSlides(-1)"`. We should attach listeners in JS instead if possible, 
// but to minimize HTML changes for now, we can expose these functions to window. 
// OR better, we rewrite the HTML to remove onclick handlers. 
// Let's expose them for now to ensure compatibility if I miss removing an onclick, but ideally I'll remove them.

let slideIndex = 1;

window.plusSlides = function (n) {
  showSlides(slideIndex += n);
}

window.currentSlide = function (n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  const slides = document.getElementsByClassName("mySlides");
  // The dots were in the original code logic but I don't see them in the HTML snippet I saw earlier (lines 153-184). 
  // Wait, line 391 `var dots = document.getElementsByClassName("dot");` in original script. 
  // I will include the logic for dots just in case they exist or will exist.
  const dots = document.getElementsByClassName("dot");

  if (slides.length === 0) return;

  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }

  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  if (slides[slideIndex - 1]) {
    slides[slideIndex - 1].style.display = "block";
  }
  if (dots.length > 0 && dots[slideIndex - 1]) {
    dots[slideIndex - 1].className += " active";
  }
}

// Initialize slides
window.addEventListener('DOMContentLoaded', () => {
  showSlides(slideIndex);
});
