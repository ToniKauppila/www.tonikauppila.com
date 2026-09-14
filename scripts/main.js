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

  // --- Recommendations carousel ---
  const recScroller = document.getElementById('recommendations-scroller');
  if (recScroller) {
    const prevBtn = document.querySelector('.rec-nav-btn[data-rec-dir="prev"]');
    const nextBtn = document.querySelector('.rec-nav-btn[data-rec-dir="next"]');
    const fade = document.querySelector('.recommendations-fade');

    // Cards snap via JS rather than native CSS scroll-snap: with an 80%-wide
    // card, "mandatory" snapping requires dragging past 50% of the viewport
    // to advance, which feels stuck/unresponsive. This uses a much smaller
    // distance threshold, plus flick velocity, like a real touch carousel.
    const cardStep = () => {
      const card = recScroller.querySelector('.recommendation-card');
      return (card ? card.getBoundingClientRect().width : 300) + 20; // 20 = gap
    };

    const maxIndex = () => Math.round((recScroller.scrollWidth - recScroller.clientWidth) / cardStep());

    const snapToIndex = (index) => {
      const clamped = Math.max(0, Math.min(index, maxIndex()));
      recScroller.scrollTo({ left: clamped * cardStep(), behavior: 'smooth' });
    };

    const nearestIndex = () => Math.round(recScroller.scrollLeft / cardStep());

    if (prevBtn) prevBtn.addEventListener('click', () => snapToIndex(nearestIndex() - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => snapToIndex(nearestIndex() + 1));

    const updateNavButtons = () => {
      const maxScroll = recScroller.scrollWidth - recScroller.clientWidth;
      if (prevBtn) prevBtn.disabled = recScroller.scrollLeft <= 1;
      if (nextBtn) nextBtn.disabled = recScroller.scrollLeft >= maxScroll - 1;
      if (fade) fade.style.opacity = recScroller.scrollLeft >= maxScroll - 1 ? '0' : '1';
    };

    // Free wheel/trackpad scrolling is intentionally left un-snapped — only
    // an explicit drag (below) or a nav-button click snaps to a card.
    let isDragging = false;
    recScroller.addEventListener('scroll', updateNavButtons, { passive: true });

    window.addEventListener('resize', updateNavButtons);
    updateNavButtons();

    // --- Click-and-drag scrolling (mouse only; touch/trackpad already works natively) ---
    let dragMoved = false;
    let startX = 0;
    let startScrollLeft = 0;
    let lastX = 0;
    let lastT = 0;
    let velocity = 0; // px/ms, positive = dragging left (content moving right-to-left)

    // Links/images are natively draggable in most browsers, which fights our
    // own drag with a ghost drag-image and stutters the scroll. Kill it at
    // the source rather than fighting it after the fact.
    recScroller.addEventListener('dragstart', (e) => e.preventDefault());

    recScroller.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = lastX = e.pageX;
      startScrollLeft = recScroller.scrollLeft;
      lastT = performance.now();
      velocity = 0;
      recScroller.classList.add('is-dragging');
      // Set inline (not just via the class) so scroll-snap is guaranteed to
      // be off before the very next mousemove — otherwise a mandatory snap
      // can fight a programmatic scrollLeft write and yank it back.
      recScroller.style.scrollSnapType = 'none';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const delta = e.pageX - startX;
      recScroller.scrollLeft = startScrollLeft - delta;

      const now = performance.now();
      const dt = now - lastT;
      if (dt > 0) velocity = (lastX - e.pageX) / dt;
      lastX = e.pageX;
      lastT = now;
    });

    const stopDragging = (e) => {
      if (!isDragging) return;
      isDragging = false;
      recScroller.classList.remove('is-dragging');
      recScroller.style.scrollSnapType = '';

      // Judge drag-vs-click by NET movement at release, not by whether any
      // single mousemove sample ever crossed a threshold — a plain click
      // (especially a trackpad click) can report a brief jitter spike mid
      // gesture and then settle right back, which would otherwise get the
      // whole gesture mislabeled as a drag and silently eat the link click.
      const finalX = e && typeof e.pageX === 'number' ? e.pageX : lastX;
      dragMoved = Math.abs(finalX - startX) > 10;

      const step = cardStep();
      const startIndex = Math.round(startScrollLeft / step);
      const draggedCards = (recScroller.scrollLeft - startScrollLeft) / step;
      const isFlick = Math.abs(velocity) > 0.7; // fast flick commits even on a short drag

      let targetIndex = startIndex;
      if (isFlick) {
        targetIndex = startIndex + (velocity > 0 ? 1 : -1);
      } else if (Math.abs(draggedCards) > 0.2) {
        // Once past the threshold, commit to at least one card — plain
        // Math.round() would need >50% to round up to 1, defeating the
        // whole point of a lower threshold.
        targetIndex = startIndex + Math.sign(draggedCards) * Math.max(1, Math.round(Math.abs(draggedCards)));
      }
      snapToIndex(targetIndex);
    };
    window.addEventListener('mouseup', stopDragging);

    // Prevent the drag from also triggering the LinkedIn link underneath it
    recScroller.addEventListener('click', (e) => {
      if (dragMoved) {
        e.preventDefault();
        dragMoved = false;
      }
    }, true);
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
