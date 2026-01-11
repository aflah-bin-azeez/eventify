/* ============================================
   MODERN PORTFOLIO WEBSITE - COMPLETE JAVASCRIPT
   Interactive Features:
   1. Dark/Light Mode Toggle
   2. Image Carousel/Slider
   3. Gallery Filter & Sort
   4. Contact Form Validation
   5. Scroll Animations
   6. Mobile Navigation
   7. FAQ Accordion
   8. Stats Counter
   ============================================ */

// ========== WAIT FOR DOM TO LOAD ==========
document.addEventListener('DOMContentLoaded', function() {
  
  // Initialize all features
  initThemeToggle();
  initNavigation();
  initCarousel();
  initGalleryFilter();
  initContactForm();
  initScrollAnimations();
  initFAQ();
  initStatsCounter();
  initSkillProgress();
  
});

// ========== 1. DARK/LIGHT MODE TOGGLE ==========
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  
  // Check for saved theme preference or default to 'light'
  const currentTheme = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', currentTheme);
  
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const theme = html.getAttribute('data-theme');
      const newTheme = theme === 'light' ? 'dark' : 'light';
      
      // Smooth transition
      html.style.transition = 'all 0.3s ease';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      // Add animation effect
      this.style.transform = 'rotate(360deg)';
      setTimeout(() => {
        this.style.transform = '';
      }, 300);
    });
  }
}

// ========== 2. MOBILE NAVIGATION ==========
function initNavigation() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const navbar = document.getElementById('navbar');
  
  // Toggle mobile menu
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() {
      this.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }
  
  // Navbar scroll effect
  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && document.querySelector(href)) {
        e.preventDefault();
        const target = document.querySelector(href);
        const offset = 80; // Navbar height
        const targetPosition = target.offsetTop - offset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ========== 3. IMAGE CAROUSEL/SLIDER ==========
function initCarousel() {
  const track = document.getElementById('carouselTrack');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const indicators = document.querySelectorAll('.indicator');
  
  if (!track || slides.length === 0) return;
  
  let currentSlide = 0;
  const totalSlides = slides.length;
  
  // Auto play interval
  let autoPlayInterval;
  const autoPlayDelay = 5000; // 5 seconds
  
  function updateSlide(index) {
    // Remove active class from all slides
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Add active class to current slide
    slides[index].classList.add('active');
    if (indicators[index]) {
      indicators[index].classList.add('active');
    }
    
    // Move track
    const offset = -index * 100;
    track.style.transform = `translateX(${offset}%)`;
  }
  
  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlide(currentSlide);
  }
  
  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlide(currentSlide);
  }
  
  function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
  }
  
  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }
  
  // Event listeners
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      stopAutoPlay();
      nextSlide();
      startAutoPlay();
    });
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      stopAutoPlay();
      prevSlide();
      startAutoPlay();
    });
  }
  
  // Indicator clicks
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      stopAutoPlay();
      currentSlide = index;
      updateSlide(currentSlide);
      startAutoPlay();
    });
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      stopAutoPlay();
      prevSlide();
      startAutoPlay();
    } else if (e.key === 'ArrowRight') {
      stopAutoPlay();
      nextSlide();
      startAutoPlay();
    }
  });
  
  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoPlay();
  });
  
  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    startAutoPlay();
  });
  
  function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
      nextSlide();
    }
    if (touchEndX > touchStartX + 50) {
      prevSlide();
    }
  }
  
  // Start auto play
  startAutoPlay();
  
  // Pause on hover
  track.addEventListener('mouseenter', stopAutoPlay);
  track.addEventListener('mouseleave', startAutoPlay);
}

// ========== 4. GALLERY FILTER & SORT ==========
function initGalleryFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const sortSelect = document.getElementById('sortSelect');
  
  if (filterButtons.length === 0 || galleryItems.length === 0) return;
  
  // Filter functionality
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Get filter value
      const filterValue = this.getAttribute('data-filter');
      
      // Filter items with animation
      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
          item.classList.remove('hide');
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.classList.add('hide');
          }, 300);
        }
      });
    });
  });
  
  // Sort functionality
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      const sortValue = this.value;
      const galleryGrid = document.getElementById('galleryGrid');
      const items = Array.from(galleryItems);
      
      // Sort items
      items.sort((a, b) => {
        if (sortValue === 'name') {
          const nameA = a.getAttribute('data-name').toLowerCase();
          const nameB = b.getAttribute('data-name').toLowerCase();
          return nameA.localeCompare(nameB);
        } else if (sortValue === 'date') {
          const dateA = a.getAttribute('data-date');
          const dateB = b.getAttribute('data-date');
          return dateB.localeCompare(dateA); // Newest first
        }
        return 0;
      });
      
      // Reorder DOM elements
      items.forEach(item => {
        galleryGrid.appendChild(item);
      });
    });
  }
}

// ========== MODAL FOR GALLERY ==========
window.openModal = function(index) {
  const modal = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalBody');
  
  const projects = [
    {
      title: 'Restaurant Website',
      description: 'A modern restaurant booking system with online menu and reservation features.',
      tech: ['HTML', 'CSS', 'JavaScript'],
      image: 'images/gallery1.jpg'
    },
    {
      title: 'Fitness Tracker',
      description: 'Health and workout monitoring application with progress tracking.',
      tech: ['React', 'Chart.js', 'Firebase'],
      image: 'images/gallery2.jpg'
    },
    {
      title: 'Dashboard UI',
      description: 'Clean and intuitive admin panel interface for data visualization.',
      tech: ['Vue.js', 'Tailwind', 'D3.js'],
      image: 'images/gallery3.jpg'
    },
    {
      title: 'Portfolio Website',
      description: 'Creative portfolio showcase with smooth animations and transitions.',
      tech: ['HTML', 'CSS', 'GSAP'],
      image: 'images/gallery4.jpg'
    },
    {
      title: 'Chat Application',
      description: 'Real-time messaging platform with WebSocket integration.',
      tech: ['Node.js', 'Socket.io', 'MongoDB'],
      image: 'images/gallery5.jpg'
    },
    {
      title: 'Mobile Banking UI',
      description: 'Secure and user-friendly mobile banking interface.',
      tech: ['React Native', 'Redux', 'AWS'],
      image: 'images/gallery6.jpg'
    }
  ];
  
  const project = projects[index];
  
  modalBody.innerHTML = `
    <img src="${project.image}" alt="${project.title}" style="width: 100%; border-radius: 10px; margin-bottom: 1.5rem;" onerror="this.src='images/placeholder.jpg'">
    <h2 style="font-size: 2rem; margin-bottom: 1rem;">${project.title}</h2>
    <p style="color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.8;">${project.description}</p>
    <h4 style="margin-bottom: 0.75rem;">Technologies Used:</h4>
    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
      ${project.tech.map(tech => `<span style="padding: 0.5rem 1rem; background: var(--bg-accent); border-radius: 20px; font-size: 0.875rem;">${tech}</span>`).join('')}
    </div>
  `;
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeModal = function() {
  const modal = document.getElementById('projectModal');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
};

// Close modal on background click
document.addEventListener('click', function(e) {
  const modal = document.getElementById('projectModal');
  if (e.target === modal) {
    closeModal();
  }
});

// ========== 5. CONTACT FORM VALIDATION ==========
function initContactForm() {
  const form = document.getElementById('contactForm');
  const successMessage = document.getElementById('formSuccess');
  
  if (!form) return;
  
  // Real-time validation
  const inputs = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    subject: document.getElementById('subject'),
    message: document.getElementById('message'),
    agreement: document.getElementById('agreement')
  };
  
  const errors = {
    name: document.getElementById('nameError'),
    email: document.getElementById('emailError'),
    phone: document.getElementById('phoneError'),
    subject: document.getElementById('subjectError'),
    message: document.getElementById('messageError'),
    agreement: document.getElementById('agreementError')
  };
  
  // Character counter
  const messageInput = inputs.message;
  const charCount = document.getElementById('charCount');
  
  if (messageInput && charCount) {
    messageInput.addEventListener('input', function() {
      const count = this.value.length;
      charCount.textContent = count;
      
      if (count > 500) {
        this.value = this.value.substring(0, 500);
        charCount.textContent = 500;
      }
    });
  }
  
  // Validation functions
  function validateName(value) {
    if (value.length < 3) {
      return 'Name must be at least 3 characters long';
    }
    if (!/^[a-zA-Z\s]+$/.test(value)) {
      return 'Name can only contain letters and spaces';
    }
    return '';
  }
  
  function validateEmail(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return '';
  }
  
  function validatePhone(value) {
    if (value && !/^[0-9+\-\s()]+$/.test(value)) {
      return 'Please enter a valid phone number';
    }
    return '';
  }
  
  function validateMessage(value) {
    if (value.length < 10) {
      return 'Message must be at least 10 characters long';
    }
    return '';
  }
  
  function showError(input, errorElement, message) {
    input.classList.add('error');
    errorElement.textContent = message;
  }
  
  function clearError(input, errorElement) {
    input.classList.remove('error');
    errorElement.textContent = '';
  }
  
  // Real-time validation
  if (inputs.name) {
    inputs.name.addEventListener('blur', function() {
      const error = validateName(this.value.trim());
      if (error) {
        showError(this, errors.name, error);
      } else {
        clearError(this, errors.name);
      }
    });
  }
  
  if (inputs.email) {
    inputs.email.addEventListener('blur', function() {
      const error = validateEmail(this.value.trim());
      if (error) {
        showError(this, errors.email, error);
      } else {
        clearError(this, errors.email);
      }
    });
  }
  
  if (inputs.phone) {
    inputs.phone.addEventListener('blur', function() {
      const error = validatePhone(this.value.trim());
      if (error) {
        showError(this, errors.phone, error);
      } else {
        clearError(this, errors.phone);
      }
    });
  }
  
  if (inputs.message) {
    inputs.message.addEventListener('blur', function() {
      const error = validateMessage(this.value.trim());
      if (error) {
        showError(this, errors.message, error);
      } else {
        clearError(this, errors.message);
      }
    });
  }
  
  // Form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let isValid = true;
    
    // Validate all fields
    const nameError = validateName(inputs.name.value.trim());
    if (nameError) {
      showError(inputs.name, errors.name, nameError);
      isValid = false;
    } else {
      clearError(inputs.name, errors.name);
    }
    
    const emailError = validateEmail(inputs.email.value.trim());
    if (emailError) {
      showError(inputs.email, errors.email, emailError);
      isValid = false;
    } else {
      clearError(inputs.email, errors.email);
    }
    
    const phoneError = validatePhone(inputs.phone.value.trim());
    if (phoneError) {
      showError(inputs.phone, errors.phone, phoneError);
      isValid = false;
    } else {
      clearError(inputs.phone, errors.phone);
    }
    
    if (!inputs.subject.value) {
      showError(inputs.subject, errors.subject, 'Please select a subject');
      isValid = false;
    } else {
      clearError(inputs.subject, errors.subject);
    }
    
    const messageError = validateMessage(inputs.message.value.trim());
    if (messageError) {
      showError(inputs.message, errors.message, messageError);
      isValid = false;
    } else {
      clearError(inputs.message, errors.message);
    }
    
    if (!inputs.agreement.checked) {
      showError(inputs.agreement, errors.agreement, 'You must agree to continue');
      isValid = false;
    } else {
      clearError(inputs.agreement, errors.agreement);
    }
    
    if (isValid) {
      // Show loading state
      const submitBtn = form.querySelector('.btn-submit');
      submitBtn.classList.add('loading');
      
      // Simulate form submission (replace with actual API call)
      setTimeout(() => {
        submitBtn.classList.remove('loading');
        form.style.display = 'none';
        successMessage.classList.add('active');
        
        // Log form data (in production, send to server)
        console.log('Form submitted:', {
          name: inputs.name.value,
          email: inputs.email.value,
          phone: inputs.phone.value,
          subject: inputs.subject.value,
          message: inputs.message.value
        });
      }, 1500);
    }
  });
}

window.resetForm = function() {
  const form = document.getElementById('contactForm');
  const successMessage = document.getElementById('formSuccess');
  
  form.reset();
  form.style.display = 'block';
  successMessage.classList.remove('active');
  
  // Clear all error states
  document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
  document.getElementById('charCount').textContent = '0';
};

// ========== 6. SCROLL ANIMATIONS ==========
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-aos]');
  
  if (animatedElements.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-aos-delay') || 0;
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, delay);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });
  
  animatedElements.forEach(el => observer.observe(el));
}

// ========== 7. FAQ ACCORDION ==========
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    if (question) {
      question.addEventListener('click', function() {
        // Close all other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });
        
        // Toggle current item
        item.classList.toggle('active');
      });
    }
  });
}

// ========== 8. STATS COUNTER ANIMATION ==========
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  if (statNumbers.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const finalValue = parseInt(target.getAttribute('data-target'));
        animateCounter(target, finalValue);
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.5 });
  
  statNumbers.forEach(stat => observer.observe(stat));
  
  function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const duration = 2000;
    const stepTime = duration / 50;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target + '+';
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, stepTime);
  }
}

// ========== 9. SKILL PROGRESS BARS ==========
function initSkillProgress() {
  const progressBars = document.querySelectorAll('.progress-fill');
  
  if (progressBars.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBar = entry.target;
        const targetWidth = progressBar.getAttribute('data-progress');
        
        setTimeout(() => {
          progressBar.style.width = targetWidth + '%';
        }, 200);
        
        observer.unobserve(progressBar);
      }
    });
  }, { threshold: 0.5 });
  
  progressBars.forEach(bar => observer.observe(bar));
}

// ========== UTILITY: SCROLL TO TOP ==========
window.addEventListener('scroll', function() {
  // Add any scroll-based features here
  
  // Example: Show/hide scroll-to-top button
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  // You can add a scroll-to-top button and control its visibility
});

// ========== LOG SUCCESSFUL INITIALIZATION ==========
console.log('✨ Portfolio website initialized successfully!');
console.log('Features loaded:');
console.log('- Theme Toggle');
console.log('- Responsive Navigation');
console.log('- Image Carousel');
console.log('- Gallery Filter & Sort');
console.log('- Form Validation');
console.log('- Scroll Animations');
console.log('- FAQ Accordion');
console.log('- Stats Counter');