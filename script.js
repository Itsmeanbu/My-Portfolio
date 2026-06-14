/* ==========================================================================
   PORTFOLIO DYNAMIC INTERACTIVITY
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. CUSTOM LOADER SCREEN
     ========================================================================== */
  const loader = document.getElementById('loader');
  
  // Hide loader after transition finishes on load
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('fade-out');
    }, 500); // Small delay for visual completion
  });

  // Fallback if load event fires before DOMContentLoaded completes
  if (document.readyState === 'complete') {
    setTimeout(() => {
      loader.classList.add('fade-out');
    }, 500);
  }


  /* ==========================================================================
     2. THEME TOGGLE (DARK / LIGHT MODE)
     ========================================================================== */
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  
  // Load saved preference or default to dark theme
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  body.setAttribute('data-theme', savedTheme);
  
  themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    
    // Dynamically adjust particle settings if active
    if (window.updateParticleColors) {
      window.updateParticleColors(newTheme);
    }
  });


  /* ==========================================================================
     3. CUSTOM CURSOR LERPING
     ========================================================================== */
  const cursor = document.getElementById('custom-cursor');
  const cursorDot = document.getElementById('custom-cursor-dot');
  
  let mouseX = 0, mouseY = 0;     // Real mouse positions
  let cursorX = 0, cursorY = 0;   // Interpolated ring positions
  const speed = 0.15;             // Lerp factor
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Instantly translate the core dot
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });
  
  // Custom animation loop to interpolate cursor ring (lerp)
  function animateCursor() {
    cursorX += (mouseX - cursorX) * speed;
    cursorY += (mouseY - cursorY) * speed;
    
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
  
  // Scale up cursor ring on interactable elements
  const hoverElements = document.querySelectorAll('a, button, .btn, .filter-btn, .project-card, .social-link, .contact-card-item');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });


  /* ==========================================================================
     4. CANVAS PARTICLE SYSTEM
     ========================================================================== */
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  let particles = [];
  let particleCount = Math.min(60, Math.floor((width * height) / 20000));
  let particleColor = 'rgba(99, 102, 241, 0.4)'; // Indigo color representation
  let connectionColor = 'rgba(99, 102, 241, 0.08)';
  
  // Setup colors based on theme
  window.updateParticleColors = (theme) => {
    if (theme === 'light') {
      particleColor = 'rgba(99, 102, 241, 0.25)';
      connectionColor = 'rgba(99, 102, 241, 0.05)';
    } else {
      particleColor = 'rgba(99, 102, 241, 0.4)';
      connectionColor = 'rgba(99, 102, 241, 0.08)';
    }
  };
  window.updateParticleColors(savedTheme);
  
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 1.5;
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      // Boundary collision resets
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
      
      // Mouse interactions: gentle drift towards/away
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        // Subtle drift from mouse
        const forceX = dx / dist;
        const forceY = dy / dist;
        this.x -= forceX * 0.4;
        this.y -= forceY * 0.4;
      }
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = particleColor;
      ctx.fill();
    }
  }
  
  function initParticles() {
    particles = [];
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particleCount = Math.min(60, Math.floor((width * height) / 20000));
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }
  
  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = connectionColor;
          ctx.lineWidth = 0.8 * (1 - dist / 150);
          ctx.stroke();
        }
      }
    }
  }
  
  function loopParticles() {
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    
    connectParticles();
    requestAnimationFrame(loopParticles);
  }
  
  initParticles();
  loopParticles();
  
  window.addEventListener('resize', () => {
    initParticles();
  });


  /* ==========================================================================
     5. HERO TYPING ANIMATION
     ========================================================================== */
  const typingText = document.getElementById('hero-typing');
  const phrases = [
    "Designing Experiences.",
    "Building Modern Interfaces.",
    "Creating Digital Solutions."
  ];
  
  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typeSpeed = 90;
  
  function type() {
    const currentPhrase = phrases[phraseIdx];
    
    if (isDeleting) {
      typingText.textContent = currentPhrase.substring(0, charIdx - 1);
      charIdx--;
      typeSpeed = 40; // Deletes faster
    } else {
      typingText.textContent = currentPhrase.substring(0, charIdx + 1);
      charIdx++;
      typeSpeed = 90; // Standard typing speed
    }
    
    // Determine lifecycle states
    if (!isDeleting && charIdx === currentPhrase.length) {
      isDeleting = true;
      typeSpeed = 2000; // Pause at end of sentence
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typeSpeed = 500; // Brief pause before typing next
    }
    
    setTimeout(type, typeSpeed);
  }
  
  setTimeout(type, 1000);


  /* ==========================================================================
     6. MOBILE HAMBURGER & DROPDOWN NAV
     ========================================================================== */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const menuLinks = document.querySelectorAll('.nav-links a');
  
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });


  /* ==========================================================================
     7. SCROLL PROGRESS BAR, BACK-TO-TOP & NAVBAR SHADOWS
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('back-to-top');
  const scrollProgress = document.getElementById('scroll-progress');
  
  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const heightLimit = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // 1. Scroll progress
    const scrolled = heightLimit > 0 ? (winScroll / heightLimit) * 100 : 0;
    scrollProgress.style.width = scrolled + "%";
    
    // 2. Navbar shrink & background blur on scroll
    if (winScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // 3. Back to top button visibility
    if (winScroll > 400) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });
  
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });


  /* ==========================================================================
     8. ACTIVE NAVIGATION LINK INDICATOR (INTERSECTION OBSERVER)
     ========================================================================== */
  const sections = document.querySelectorAll('section, main > section');
  const navItems = document.querySelectorAll('.nav-links a');
  
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Target mid-screen viewports
    threshold: 0
  };
  
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);
  
  sections.forEach(section => {
    navObserver.observe(section);
  });


  /* ==========================================================================
     9. SCROLL REVEALS / AOS SIMULATOR
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve once revealed to optimize loop cycles
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => {
    revealObserver.observe(el);
  });


  /* ==========================================================================
     10. NUMERICAL INCREMENT COUNTERS (ABOUT SECTION)
     ========================================================================== */
  const counterElements = document.querySelectorAll('.counter-num');
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseFloat(entry.target.getAttribute('data-target'));
        const isDecimal = target % 1 !== 0;
        
        let start = 0;
        const duration = 2000; // Total count duration in ms
        const steps = 60;
        const increment = target / steps;
        const stepTime = duration / steps;
        
        let currentStep = 0;
        
        const counterInterval = setInterval(() => {
          currentStep++;
          start += increment;
          
          if (currentStep >= steps) {
            entry.target.textContent = isDecimal ? target.toFixed(1) : Math.round(target);
            clearInterval(counterInterval);
          } else {
            entry.target.textContent = isDecimal ? start.toFixed(1) : Math.round(start);
          }
        }, stepTime);
        
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  counterElements.forEach(c => counterObserver.observe(c));


  /* ==========================================================================
     11. SKILLS MATRIX FILTERING
     ========================================================================== */
  const skillFilters = document.querySelectorAll('[data-filter]');
  const skillCategories = document.querySelectorAll('.skill-category');
  
  skillFilters.forEach(filter => {
    filter.addEventListener('click', () => {
      // Toggle active states
      skillFilters.forEach(f => f.classList.remove('active'));
      filter.classList.add('active');
      
      const filterValue = filter.getAttribute('data-filter');
      
      skillCategories.forEach(category => {
        const catVal = category.getAttribute('data-category');
        if (filterValue === 'all' || catVal === filterValue) {
          category.style.display = 'flex';
          // Force layout recalculation and retrigger animate reveals
          setTimeout(() => {
            category.classList.add('active');
            category.style.opacity = '1';
            category.style.transform = 'scale(1)';
          }, 10);
        } else {
          category.style.opacity = '0';
          category.style.transform = 'scale(0.95)';
          category.style.display = 'none';
        }
      });
    });
  });


  /* ==========================================================================
     12. DYNAMIC 3D TILT EFFECT & SPOTLIGHT FOCUS
     ========================================================================== */
  const tiltCards = document.querySelectorAll('.project-card, .cert-card, .about-info-panel .info-card');
  
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x coordinate inside the card
      const y = e.clientY - rect.top;  // y coordinate inside the card
      
      // Update custom variables for CSS mouse-spotlight shaders
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      
      // Perform 3D calculations if it is a project card or cert card (not inner info-card)
      if (card.classList.contains('project-card') || card.classList.contains('cert-card')) {
        const width = rect.width;
        const height = rect.height;
        
        const rotateX = ((y / height) - 0.5) * -15; // Max 15 deg tilt
        const rotateY = ((x / width) - 0.5) * 15;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
      }
    });
    
    card.addEventListener('mouseleave', () => {
      // Soft reset back to defaults
      card.style.setProperty('--mouse-x', '0px');
      card.style.setProperty('--mouse-y', '0px');
      
      if (card.classList.contains('project-card') || card.classList.contains('cert-card')) {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      }
    });
  });


  /* ==========================================================================
     13. PORTFOLIO PROJECTS SHOWCASE FILTERING
     ========================================================================== */
  const projFilters = document.querySelectorAll('[data-proj-filter]');
  const projectCards = document.querySelectorAll('.project-card');
  
  projFilters.forEach(filter => {
    filter.addEventListener('click', () => {
      projFilters.forEach(f => f.classList.remove('active'));
      filter.classList.add('active');
      
      const filterValue = filter.getAttribute('data-proj-filter');
      
      projectCards.forEach(card => {
        const catVal = card.getAttribute('data-proj-cat');
        if (filterValue === 'all' || catVal === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.classList.add('active');
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          card.style.display = 'none';
        }
      });
    });
  });


  /* ==========================================================================
     14. DETAILED PROJECT PREVIEW LIGHTBOX / MODAL
     ========================================================================== */
  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const detailsBtns = document.querySelectorAll('.view-details-btn');
  
  // Projects dynamic data dictionary
  const projectsData = {
    'blog-app': {
      title: 'Firebase Blog Application',
      tags: ['React.js', 'Firebase', 'Firestore', 'Auth'],
      mediaIcon: 'fa-solid fa-blog',
      desc: 'This is a premium collaborative blogging web application built with a React.js front-end framework, integrated seamlessly with a serverless Google Firebase backend. It provides secure logins using Google Authentication, handles rapid text and content generation via custom Rich Text forms, and implements CRUD (Create, Read, Update, Delete) databases via Cloud Firestore with real-time listeners for instant comments, likes, and updates across devices.',
      features: [
        'Secure Firebase Auth using Google Sign-In',
        'Cloud Firestore database synchronization for instant feeds',
        'Intuitive Markdown editor for full post designs',
        'Optimized images and media loading structures',
        'Secure client-side and server-side validation rules'
      ],
      liveLink: 'https://github.com/anbuabdul'
    },
    'portfolio-website': {
      title: 'Personal Portfolio Website',
      tags: ['HTML5', 'CSS3', 'JavaScript', 'Design'],
      mediaIcon: 'fa-solid fa-user-tie',
      desc: 'My interactive premium designer portfolio built using standard web foundations. Employs advanced responsive grids, HSL design themes, persistent local-storage dark/light theme triggers, customized lerping cursor rings, canvas particle rendering, active layout intersection observers, project search index algorithms, and secure email form controls.',
      features: [
        'Premium glassmorphic dashboard aesthetic with fine custom borders',
        'Bespoke Canvas-based connecting nodes animation at 60fps',
        'Full light/dark stylesheet configurations with instant toggle storage',
        'Intersection Observer dynamic navigation indicator highlighting',
        'Zero layout shifts, optimal loading, and SEO optimizations'
      ],
      liveLink: 'https://github.com/anbuabdul'
    },
    'ai-chatbot': {
      title: 'AI Chatbot System',
      tags: ['Python', 'NLP Basics', 'CLI'],
      mediaIcon: 'fa-solid fa-brain',
      desc: 'An automated local conversational AI tool developed using Python. Integrates NLP (Natural Language Processing) text models, matching statements, resolving input structures, keeping chat histories, and providing highly formatted answers for common developer prompts and greetings.',
      features: [
        'Python dictionary text parsing rules for smart match logic',
        'Stateful chat context memory mapping for long sessions',
        'Custom clean command interface formatting structures',
        'Extendable plugin triggers for scheduling scripts or alerts',
        'Automated fallback logic for unknown phrases'
      ],
      liveLink: 'https://github.com/anbuabdul'
    },
    'weather-app': {
      title: 'Weather Forecasting App',
      tags: ['Python', 'API Integration', 'JSON'],
      mediaIcon: 'fa-solid fa-cloud-sun-rain',
      desc: 'Retrieves real-time geographical coordinates climate data by consuming Restful services from the OpenWeather Map API. Implements validation loops, units config options, wind speed scales, humidity ratios, temperature graphs, and clear status summaries.',
      features: [
        'Live weather queries with immediate response caching',
        'Automated query formatting for error handles and missing keys',
        'Visual status mapping matching rainy/sunny/cloudy details',
        'Responsive terminal or UI window displaying dynamic layouts',
        'Extended predictions for custom multi-day forecasts'
      ],
      liveLink: 'https://github.com/anbuabdul'
    },
    'password-gen': {
      title: 'Password Generator Tool',
      tags: ['Python', 'Cryptography', 'Security'],
      mediaIcon: 'fa-solid fa-key',
      desc: 'A secure encryption helper console program designed in Python. Leverages highly secure random seed libraries to compile complex cryptographic passwords that prevent cyber threats and dictionary attacks. Customizable options include number inclusions, custom length settings, and visual validation ratings.',
      features: [
        'FIPS/Cryptographic random index selecting functions',
        'Custom sliders or parameters for lowercase, uppercase, digits',
        'Entropy rating analyzer checks passwords and labels warning ratings',
        'Quick copy-to-clipboard functionality',
        'Encrypted text vault save capability'
      ],
      liveLink: 'https://github.com/anbuabdul'
    },
    'qr-gen': {
      title: 'QR Code Generator',
      tags: ['Python', 'qrcode Library', 'Image Export'],
      mediaIcon: 'fa-solid fa-qrcode',
      desc: 'Enables user input links, digital contact profiles, and raw text snippets to be instantly encoded into clear, high-contrast QR graphics. Uses standard vector libraries to construct PNG/SVG QR matrices with configurable borders, sizing scales, and color adjustments.',
      features: [
        'Encodes complex URLs, Wi-Fi networks, and contact files (VCF)',
        'Adjustable QR error correction flags (L, M, Q, H) for maximum scan integrity',
        'Custom icon merging option inside the center of the QR graphic',
        'Export formats include high resolution vector and raster types',
        'Fast local execution scripts with zero external server queries'
      ],
      liveLink: 'https://github.com/anbuabdul'
    }
  };
  
  function openProjectModal(projId) {
    const data = projectsData[projId];
    if (!data) return;
    
    // Set text contents
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-desc').textContent = data.desc;
    
    // Populate tag badges
    const tagsContainer = document.getElementById('modal-tags');
    tagsContainer.innerHTML = '';
    data.tags.forEach(t => {
      const span = document.createElement('span');
      span.className = 'tech-tag';
      span.textContent = t;
      tagsContainer.appendChild(span);
    });
    
    // Populate feature highlights
    const featuresList = document.getElementById('modal-features');
    featuresList.innerHTML = '';
    data.features.forEach(f => {
      const li = document.createElement('li');
      li.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${f}`;
      featuresList.appendChild(li);
    });
    
    // Set visual icon backdrop
    const mediaContainer = document.getElementById('modal-media-visual');
    mediaContainer.innerHTML = `<i class="${data.mediaIcon}"></i>`;
    
    // Update live demo button path
    const liveDemoBtn = document.getElementById('modal-live-demo-btn');
    liveDemoBtn.onclick = () => {
      window.open(data.liveLink, '_blank');
    };
    
    // Toggle modal visibility
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }
  
  function closeProjectModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }
  
  // Event mapping
  detailsBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projId = btn.getAttribute('data-project-id');
      openProjectModal(projId);
    });
  });
  
  modalClose.addEventListener('click', closeProjectModal);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeProjectModal();
    }
  });
  
  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeProjectModal();
    }
  });


  /* ==========================================================================
     15. CONTACT FORM VALIDATION & SUCCESS CONFETTI
     ========================================================================== */
  const contactForm = document.getElementById('portfolio-contact-form');
  const successOverlay = document.getElementById('form-success');
  const closeSuccessBtn = document.getElementById('close-success-btn');
  const submitBtn = document.getElementById('form-submit-btn');
  const statusIcon = document.getElementById('status-icon');
  const statusTitle = document.getElementById('status-title');
  const statusMessage = document.getElementById('status-message');
  
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simple visual validation
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    
    if (!name || !email || !subject || !message) {
      alert("Please fill out all fields correctly.");
      return;
    }
    
    // Add loading state while submitting
    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span>Sending Message...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>`;
    
    // Create FormData for Web3Forms API
    const formData = new FormData();
    formData.append("access_key", "3479a1dc-5db9-4cc6-9117-b3f4012cfe59");
    formData.append("name", name);
    formData.append("email", email);
    formData.append("subject", subject);
    formData.append("message", message);
    
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    })
    .then(async (response) => {
      let json = await response.json();
      if (response.status === 200 && json.success) {
        // Success state configuration
        statusIcon.innerHTML = `<i class="fa-solid fa-check" style="color: #10b981;"></i>`;
        statusIcon.style.borderColor = '#10b981';
        statusIcon.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
        statusTitle.textContent = "✅ Thank you! Your message has been sent successfully.";
        statusMessage.textContent = "Your details have been submitted. Anbu will respond shortly.";
        closeSuccessBtn.textContent = "Send Another Message";
        
        // Trigger premium confetti explosion
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981']
          });
          
          setTimeout(() => {
            confetti({
              particleCount: 50,
              angle: 60,
              spread: 55,
              origin: { x: 0 },
              colors: ['#6366f1', '#06b6d4']
            });
          }, 250);
          
          setTimeout(() => {
            confetti({
              particleCount: 50,
              angle: 120,
              spread: 55,
              origin: { x: 1 },
              colors: ['#8b5cf6', '#06b6d4']
            });
          }, 400);
        }
        
        contactForm.reset();
      } else {
        // Error state configuration
        throw new Error(json.message || "Failed to submit form");
      }
    })
    .catch(error => {
      // Error state configuration
      statusIcon.innerHTML = `<i class="fa-solid fa-xmark" style="color: #ef4444;"></i>`;
      statusIcon.style.borderColor = '#ef4444';
      statusIcon.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
      statusTitle.textContent = "❌ Something went wrong. Please try again.";
      statusMessage.textContent = error.message || "Unable to send your message at this time.";
      closeSuccessBtn.textContent = "Try Again";
    })
    .finally(() => {
      // Show success/error overlay screen
      successOverlay.classList.add('active');
      
      // Reset button loading state
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    });
  });
  
  closeSuccessBtn.addEventListener('click', () => {
    successOverlay.classList.remove('active');
  });

});
