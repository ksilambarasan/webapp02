document.addEventListener('DOMContentLoaded', () => {
  // 1. Header Scrolled Class Toggle
  const header = document.querySelector('header');
  const checkScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Run once in case user loads page scrolled down

  // 2. Mobile Nav Drawer Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle('open');
      
      // Transform hamburger to X
      const spans = mobileToggle.querySelectorAll('span');
      if (mobileMenu.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && e.target !== mobileToggle) {
        mobileMenu.classList.remove('open');
        const spans = mobileToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  }

  // Mobile Dropdown Toggles (e.g. Internships Menu)
  const mobileDropdowns = document.querySelectorAll('.mobile-dropdown');
  mobileDropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.mobile-dropdown-toggle');
    if (toggle) {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        dropdown.classList.toggle('open');
        const menu = dropdown.querySelector('.mobile-dropdown-menu');
        if (dropdown.classList.contains('open')) {
          menu.style.maxHeight = menu.scrollHeight + 'px';
        } else {
          menu.style.maxHeight = null;
        }
      });
    }
  });

  // 3. Scroll Triggered Fade-in Animation (Intersection Observer)
  const fadeElements = document.querySelectorAll('.scroll-fade');
  if (fadeElements.length > 0) {
    const observerOptions = {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target); // Trigger only once
        }
      });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));
  }

  // 4. FAQ Accordion Toggle
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const answer = item.querySelector('.faq-answer');
      const isActive = item.classList.contains('active');

      // Close all other FAQs
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // 5. Product and Training Category Filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const filterItems = document.querySelectorAll('.filter-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Set active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      filterItems.forEach(item => {
        if (filterValue === 'all') {
          item.style.display = 'block';
          // Force a slight delay to trigger entry transition if needed
          setTimeout(() => item.style.opacity = '1', 50);
        } else {
          const categories = item.getAttribute('data-category').split(' ');
          if (categories.includes(filterValue)) {
            item.style.display = 'block';
            setTimeout(() => item.style.opacity = '1', 50);
          } else {
            item.style.opacity = '0';
            item.style.display = 'none';
          }
        }
      });
    });
  });

  // 6. Contact Form Validation and Mock Submit
  const contactForm = document.getElementById('tanuvin-contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const subject = document.getElementById('form-subject').value.trim();
      const message = document.getElementById('form-message').value.trim();

      // Simple email validation regex
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !subject || !message) {
        formStatus.textContent = 'Please fill in all required fields.';
        formStatus.className = 'form-status error';
        return;
      }

      if (!emailPattern.test(email)) {
        formStatus.textContent = 'Please enter a valid email address.';
        formStatus.className = 'form-status error';
        return;
      }

      // If valid, show success
      formStatus.textContent = 'Thank you for your message! Our team at Tanuvin Technologies LLP will get back to you shortly.';
      formStatus.className = 'form-status success';
      contactForm.reset();

      // Scroll to status message
      formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // 7. Auto-highlight current navigation link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Highlight dropdown parents if a child link is active
  const activeSubLinks = document.querySelectorAll('.nav-dropdown-menu a, .mobile-dropdown-menu a');
  activeSubLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath) {
      link.classList.add('active');
      
      // Highlight Desktop Parent Toggle
      const parentDropdown = link.closest('.nav-dropdown');
      if (parentDropdown) {
        const toggle = parentDropdown.querySelector('.nav-dropdown-toggle');
        if (toggle) toggle.classList.add('active');
      }

      // Highlight Mobile Parent Toggle
      const parentMobileDropdown = link.closest('.mobile-dropdown');
      if (parentMobileDropdown) {
        const toggle = parentMobileDropdown.querySelector('.mobile-dropdown-toggle');
        if (toggle) toggle.classList.add('active');
      }
    }
  });

  // 8. Live Demo Interactive Network Simulation (Home Page)
  const sensors = document.querySelectorAll('.demo-sensor');
  const statusDisplay = document.getElementById('network-status-text');

  if (sensors.length > 0 && statusDisplay) {
    sensors.forEach(sensor => {
      sensor.addEventListener('click', () => {
        // Toggle active class on this sensor
        sensor.classList.toggle('active');
        
        // Count active edge sensors (excluding cloud)
        const edgeSensors = Array.from(sensors).filter(s => !s.classList.contains('sensor-cloud'));
        const activeEdgeCount = edgeSensors.filter(s => s.classList.contains('active')).length;
        
        // Dynamic status updates
        if (sensor.classList.contains('sensor-cloud')) {
          if (sensor.classList.contains('active')) {
            statusDisplay.innerHTML = 'Cloud Platform: <span style="color: #00f2fe;">CONNECTED</span>. Centralized analytics running.';
          } else {
            statusDisplay.innerHTML = 'Cloud Platform: <span style="color: #ef4444;">DISCONNECTED</span>. Edge devices running in offline/cache mode.';
          }
        } else {
          statusDisplay.innerHTML = `Active Edge Nodes: <span style="color: #00f2fe;">${activeEdgeCount} / ${edgeSensors.length}</span> online. Real-time inference latency: <span style="color: #7f00ff;">${(Math.random() * 4 + 2).toFixed(1)}ms</span>.`;
        }
      });
    });
  }
});
