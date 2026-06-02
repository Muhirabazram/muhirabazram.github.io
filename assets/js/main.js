/**
* Template Name: iPortfolio
* Template URL: https://bootstrapmade.com/iportfolio-bootstrap-portfolio-websites-template/
* Updated: Jun 29 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  // Global variables to store data and components
  let rawPortfolioData = [];
  let portfolioData = [];
  let initIsotope = null;
  let currentSearchQuery = "";
  let currentCategoryFilter = "*";
  let currentSortFilter = "newest";
  const lang = document.documentElement.lang || 'en';

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector('.header-toggle');

  function headerToggle() {
    document.querySelector('#header').classList.toggle('header-show');
    headerToggleBtn.classList.toggle('bi-list');
    headerToggleBtn.classList.toggle('bi-x');
  }
  
  if (headerToggleBtn) {
    headerToggleBtn.addEventListener('click', headerToggle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.header-show')) {
        headerToggle();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Initiate Pure Counter
   */
  if (typeof PureCounter !== 'undefined') {
    new PureCounter();
  }

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Language Switcher Dropdown Handler
   */
  const languageSwitcher = document.getElementById('languageSwitcher');
  if (languageSwitcher) {
    languageSwitcher.addEventListener('change', function() {
      const selectedLang = this.value;
      if (selectedLang === 'en') {
        window.location.href = 'index.html';
      } else if (selectedLang === 'id') {
        window.location.href = 'index-id.html';
      }
    });
  }

  /**
   * Dark Mode State & Style Management
   */
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    const textEn = isDark ? '<i class="bi bi-sun-fill"></i> <span>Light Mode</span>' : '<i class="bi bi-moon-stars-fill"></i> <span>Dark Mode</span>';
    const textId = isDark ? '<i class="bi bi-sun-fill"></i> <span>Mode Terang</span>' : '<i class="bi bi-moon-stars-fill"></i> <span>Mode Gelap</span>';
    
    if (isDark) {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
    
    if (themeToggle) {
      themeToggle.innerHTML = lang === 'id' ? textId : textEn;
    }
  }

  // Initial Theme Check from Local Storage
  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentActiveTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
      localStorage.setItem('theme', currentActiveTheme);
      applyTheme(currentActiveTheme);
    });
  }

  /**
   * Integrated Contact Form via Web3Forms (AJAX)
   */
  const contactForm = document.getElementById('contactForm');
  const successAlert = document.getElementById('form-alert-success');
  const errorAlert = document.getElementById('form-alert-error');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      submitBtn.disabled = true;
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = lang === 'id' ? 'Mengirim...' : 'Sending...';
      
      successAlert.style.display = 'none';
      errorAlert.style.display = 'none';

      const formData = new FormData(contactForm);
      const formObject = Object.fromEntries(formData);
      const jsonPayload = JSON.stringify(formObject);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: jsonPayload
      })
      .then(async (response) => {
        let resData = await response.json();
        if (response.status === 200) {
          successAlert.style.display = 'block';
          contactForm.reset();
        } else {
          console.error(resData);
          errorAlert.textContent = resData.message || (lang === 'id' ? 'Terjadi kesalahan. Silakan coba kembali.' : 'Something went wrong. Please try again.');
          errorAlert.style.display = 'block';
        }
      })
      .catch(error => {
        console.error(error);
        errorAlert.style.display = 'block';
      })
      .then(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        // Auto hide alerts after 6 seconds
        setTimeout(() => {
          successAlert.style.display = 'none';
          errorAlert.style.display = 'none';
        }, 6000);
      });
    });
  }

  /**
   * Reusable Video Modal Listener (Fixed drive description newlines with innerHTML)
   */
  const videoModal = document.getElementById('videoModal');
  if (videoModal) {
    const videoIframe = document.getElementById('videoModalIframe');
    const videoTitle = document.getElementById('videoModalTitle');
    const videoDesc = document.getElementById('videoModalDesc');

    videoModal.addEventListener('show.bs.modal', function(event) {
      const button = event.relatedTarget;
      const src = button.getAttribute('data-video-src');
      const title = button.getAttribute('data-video-title');
      const desc = button.getAttribute('data-video-desc');

      videoIframe.src = src;
      videoTitle.textContent = title;
      videoDesc.innerHTML = desc; // Fixed: using innerHTML instead of textContent to handle <br> tags
    });

    videoModal.addEventListener('hidden.bs.modal', function() {
      videoIframe.src = "";
    });
  }

  /**
   * Combined Isotope Search & Filter Handler
   */
  function filterIsotope() {
    if (!initIsotope) return;
    
    initIsotope.arrange({
      filter: function(itemElem) {
        // 1. Check Category Match
        const matchesCategory = currentCategoryFilter === "*" || itemElem.classList.contains(currentCategoryFilter.replace('.', ''));
        
        // 2. Check Text Search Match
        if (!currentSearchQuery) {
          return matchesCategory;
        }
        
        const searchTarget = (itemElem.getAttribute('data-search-target') || "").toLowerCase();
        const matchesSearch = searchTarget.includes(currentSearchQuery.toLowerCase());
        
        return matchesCategory && matchesSearch;
      }
    });
  }

  /**
   * Helper to automatically parse and sanitize social media/video URLs into iframe-embeddable links.
   */
  function getEmbedUrl(url) {
    if (!url) return '';
    let cleanUrl = url.trim();

    // YouTube handling (Shorts, watch, youtu.be, embed)
    if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) {
      let videoId = '';
      if (cleanUrl.includes('watch?v=')) {
        videoId = cleanUrl.split('watch?v=')[1].split('&')[0];
      } else if (cleanUrl.includes('youtu.be/')) {
        videoId = cleanUrl.split('youtu.be/')[1].split('?')[0];
      } else if (cleanUrl.includes('embed/')) {
        return cleanUrl; // Already embed URL
      } else if (cleanUrl.includes('/shorts/')) {
        videoId = cleanUrl.split('/shorts/')[1].split('?')[0];
      }
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
      }
    }

    // Instagram Reels / Posts handling
    if (cleanUrl.includes('instagram.com')) {
      let baseUrl = cleanUrl.split('?')[0];
      if (baseUrl.endsWith('/')) {
        baseUrl = baseUrl.slice(0, -1);
      }
      return `${baseUrl}/embed/`;
    }

    // TikTok handling
    if (cleanUrl.includes('tiktok.com')) {
      if (cleanUrl.includes('/video/')) {
        let videoId = cleanUrl.split('/video/')[1].split('?')[0];
        return `https://www.tiktok.com/embed/v2/${videoId}`;
      }
    }

    // Vimeo handling
    if (cleanUrl.includes('vimeo.com')) {
      let videoId = cleanUrl.split('vimeo.com/')[1].split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }

    // Google Drive video handling
    if (cleanUrl.includes('drive.google.com')) {
      if (cleanUrl.includes('/view')) {
        return cleanUrl.replace('/view', '/preview');
      }
      return cleanUrl;
    }

    return cleanUrl;
  }

  /**
   * Helper to automatically parse and sanitize Google Drive image URLs into direct raw render links.
   */
  function getDirectImageUrl(url) {
    if (!url) return '';
    let cleanUrl = url.trim();

    // Check if it's a Google Drive link
    if (cleanUrl.includes('drive.google.com')) {
      let fileId = '';
      if (cleanUrl.includes('/file/d/')) {
        fileId = cleanUrl.split('/file/d/')[1].split('/')[0].split('?')[0];
      } else if (cleanUrl.includes('id=')) {
        fileId = cleanUrl.split('id=')[1].split('&')[0];
      }
      if (fileId) {
        return `https://drive.google.com/uc?export=view&id=${fileId}`;
      }
    }

    return cleanUrl;
  }

  /**
   * Helper to format a date into a readable string in both English and Indonesian.
   * Supports ISO string (YYYY-MM-DDTHH:mm) and older string dates ("15 Maret 2023").
   */
  function formatDate(dateStr, lang) {
    if (!dateStr) return '';
    
    // If it's an ISO date string (has '-' and 'T')
    if (dateStr.includes('-') && dateStr.includes('T')) {
      try {
        const dateObj = new Date(dateStr);
        if (isNaN(dateObj.getTime())) return dateStr;
        
        const day = dateObj.getDate();
        const year = dateObj.getFullYear();
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
        
        const monthsId = [
          'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
          'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        
        const monthsEn = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        const monthName = lang === 'id' ? monthsId[dateObj.getMonth()] : monthsEn[dateObj.getMonth()];
        return `${day} ${monthName} ${year}, ${hours}:${minutes}`;
      } catch (e) {
        return dateStr;
      }
    }

    // Fallback for older text-based date formatting
    if (lang === 'en') {
      let translated = dateStr;
      const monthTranslations = {
        'januari': 'January', 'februari': 'February', 'maret': 'March',
        'mei': 'May', 'juni': 'June', 'juli': 'July',
        'agustus': 'August', 'oktober': 'October', 'desember': 'December'
      };
      
      for (const [idMonth, enMonth] of Object.entries(monthTranslations)) {
        const regex = new RegExp(`\\b${idMonth}\\b`, 'gi');
        translated = translated.replace(regex, enMonth);
      }
      return translated;
    } else {
      let translated = dateStr;
      const monthTranslations = {
        'january': 'Januari', 'february': 'Februari', 'march': 'Maret',
        'may': 'Mei', 'june': 'Juni', 'july': 'Juli',
        'august': 'Agustus', 'october': 'Oktober', 'december': 'Desember'
      };
      
      for (const [enMonth, idMonth] of Object.entries(monthTranslations)) {
        const regex = new RegExp(`\\b${enMonth}\\b`, 'gi');
        translated = translated.replace(regex, idMonth);
      }
      return translated;
    }
  }

  /**
   * Dynamic Project Details Modal Renderer
   */
  function openProjectDetailsModal(projectId) {
    const project = portfolioData.find(item => item.id === projectId);
    if (!project) return;

    const modalTitle = document.getElementById('projectDetailsTitle');
    const modalCategory = document.getElementById('projectDetailsCategory');
    const modalDate = document.getElementById('projectDetailsDate');
    const modalTools = document.getElementById('projectDetailsTools');
    const modalLink = document.getElementById('projectDetailsLink');
    const modalLinkRow = document.getElementById('projectDetailsLinkRow');
    const modalDesc = document.getElementById('projectDetailsDesc');
    const mediaContainer = document.getElementById('projectModalMediaContainer');

    // Translate modal fields
    const translatedTitle = lang === 'id' ? (project.title_id || project.title_en || project.title) : (project.title_en || project.title || project.title_id);
    const translatedDesc = lang === 'id' ? (project.detailed_desc_id || project.detailed_desc_en) : project.detailed_desc_en;
    const catLabels = project.categories.map(c => {
      const mappings = {
        'design': lang === 'id' ? 'Desain' : 'Design',
        '3ddesign': lang === 'id' ? 'Desain 3D' : '3D Design',
        'web': 'Web',
        'video': lang === 'id' ? 'Video & Animasi' : 'Video & Animation',
        'photo': lang === 'id' ? 'Foto' : 'Photo'
      };
      return mappings[c] || c;
    });

    // Populate standard text contents
    modalTitle.textContent = translatedTitle;
    modalCategory.textContent = catLabels.join(', ');
    modalDate.textContent = formatDate(project.date, lang);
    modalTools.textContent = project.tools.join(', ');
    modalDesc.innerHTML = translatedDesc.replace(/\n/g, '<br>');

    // Populate Project URL Row
    if (project.project_url) {
      modalLinkRow.style.display = 'grid';
      modalLink.href = project.project_url;
      modalLink.innerHTML = lang === 'id' ? 'Lihat Proyek <i class="bi bi-box-arrow-up-right"></i>' : 'View Project <i class="bi bi-box-arrow-up-right"></i>';
    } else {
      modalLinkRow.style.display = 'none';
    }

    // Populate Image Slider, Video, or Single Image
    mediaContainer.innerHTML = ''; // Reset container
    
    // Create the floating magnifying glass zoom-in button first
    const zoomBtn = document.createElement('a');
    zoomBtn.target = '_blank';
    zoomBtn.className = 'modal-zoom-btn';
    zoomBtn.title = lang === 'id' ? 'Buka Ukuran Penuh' : 'Open Fullscreen';
    zoomBtn.innerHTML = '<i class="bi bi-zoom-in"></i>';
    
    if (project.slider_images && project.slider_images.length > 1) {
      // Set initial zoom link to the first slide image
      zoomBtn.href = getDirectImageUrl(project.slider_images[0]);
      
      // Build Swiper Carousel
      const swiperWrapper = document.createElement('div');
      swiperWrapper.className = 'project-swiper-container swiper init-swiper-modal';
      
      const slidesHTML = project.slider_images.map(img => `
        <div class="swiper-slide text-center">
          <img src="${getDirectImageUrl(img)}" class="img-fluid rounded" alt="${translatedTitle}">
        </div>
      `).join('');

      swiperWrapper.innerHTML = `
        <div class="swiper-wrapper align-items-center">
          ${slidesHTML}
        </div>
        <div class="swiper-pagination"></div>
        <div class="swiper-button-prev text-success" style="--swiper-navigation-size:25px;"></div>
        <div class="swiper-button-next text-success" style="--swiper-navigation-size:25px;"></div>
      `;

      mediaContainer.appendChild(swiperWrapper);

      // Initialize Swiper specifically for Modal Carousel with slideChange event listener
      new Swiper('.init-swiper-modal', {
        loop: true,
        speed: 600,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        slidesPerView: 1,
        spaceBetween: 10,
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        on: {
          slideChange: function() {
            const activeSlide = this.slides[this.activeIndex];
            if (activeSlide) {
              const activeImg = activeSlide.querySelector('img');
              if (activeImg) {
                zoomBtn.href = activeImg.getAttribute('src') || activeImg.src;
              }
            }
          }
        }
      });
    } else if (project.media_type === 'video') {
      zoomBtn.href = project.media_url;
      // Render native video player
      const videoEl = document.createElement('video');
      videoEl.src = project.media_url;
      videoEl.controls = true;
      videoEl.className = 'img-fluid rounded shadow-sm w-100';
      videoEl.style.maxHeight = '500px';
      videoEl.style.objectFit = 'contain';
      videoEl.style.backgroundColor = '#000';
      videoEl.style.border = '1px solid var(--border-color)';
      mediaContainer.appendChild(videoEl);
    } else if (project.media_type === 'youtube') {
      const embedUrl = getEmbedUrl(project.media_url);
      zoomBtn.href = project.media_url;
      // Render embedded YouTube / Instagram / TikTok / Social video
      const iframeEl = document.createElement('iframe');
      iframeEl.src = embedUrl;
      iframeEl.className = 'w-100 rounded shadow-sm';
      iframeEl.style.height = (project.media_url.includes('instagram.com') || project.media_url.includes('tiktok.com')) ? '480px' : '400px';
      iframeEl.style.border = '1px solid var(--border-color)';
      iframeEl.allow = 'autoplay; encrypted-media; picture-in-picture';
      iframeEl.allowFullscreen = true;
      mediaContainer.appendChild(iframeEl);
    } else if (project.media_type === 'drive_video') {
      const embedUrl = getEmbedUrl(project.media_url);
      zoomBtn.href = project.media_url;
      // Render embedded Google Drive video player
      const iframeEl = document.createElement('iframe');
      iframeEl.src = embedUrl;
      iframeEl.className = 'w-100 rounded shadow-sm';
      iframeEl.style.height = '400px';
      iframeEl.style.border = '1px solid var(--border-color)';
      iframeEl.allow = 'autoplay; encrypted-media';
      iframeEl.allowFullscreen = true;
      mediaContainer.appendChild(iframeEl);
    } else {
      zoomBtn.href = project.media_url;
      // Render standard single thumbnail image
      const singleImg = document.createElement('img');
      singleImg.src = getDirectImageUrl(project.thumbnail);
      singleImg.className = 'img-fluid rounded shadow-sm w-100';
      singleImg.style.maxHeight = '500px';
      singleImg.style.objectFit = 'contain';
      singleImg.style.border = '1px solid var(--border-color)';
      mediaContainer.appendChild(singleImg);
    }

    // Append the floating magnifying glass zoom-in button inside media container
    mediaContainer.appendChild(zoomBtn);

    // Open Bootstrap Modal programmatically
    const bsModal = new bootstrap.Modal(document.getElementById('projectDetailsModal'));
    bsModal.show();
  }



  /**
   * Helper to parse dates in both English, Indonesian formats, and ISO datetime format.
   */
  function parseDate(dateStr) {
    if (!dateStr) return new Date(0);
    
    // If it's already an ISO string format (has '-' and 'T')
    if (dateStr.includes('-') && dateStr.includes('T')) {
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    
    const parts = dateStr.trim().split(/\s+/);
    if (parts.length < 3) return new Date(0);
    const day = parseInt(parts[0]);
    const monthName = parts[1].toLowerCase();
    const year = parseInt(parts[2]);
    
    const months = {
      'januari': 0, 'january': 0,
      'februari': 1, 'february': 1,
      'maret': 2, 'march': 2,
      'april': 3,
      'mei': 4, 'may': 4,
      'juni': 5, 'june': 5,
      'juli': 6, 'july': 6,
      'agustus': 7, 'august': 7,
      'september': 8,
      'oktober': 9, 'october': 9,
      'november': 10,
      'desember': 11, 'december': 11
    };
    
    const month = months[monthName] !== undefined ? months[monthName] : 0;
    return new Date(year, month, day);
  }

  /**
   * Filter and Sort Portfolio Data, then Render Cards
   */
  function renderPortfolioFilteredAndSorted() {
    const portfolioContainer = document.getElementById('portfolio-container');
    if (!portfolioContainer) return;

    // 1. Copy the raw database array
    let items = [...rawPortfolioData];

    // 2. Apply Year Filter if applicable
    if (currentSortFilter.startsWith('year-')) {
      const targetYear = currentSortFilter.replace('year-', '');
      items = items.filter(item => {
        if (!item.date) return false;
        const parsed = parseDate(item.date);
        const itemYear = parsed.getFullYear().toString();
        return itemYear === targetYear;
      });
      // Sort filtered items by newest first
      items.sort((a, b) => parseDate(b.date) - parseDate(a.date));
    } else if (currentSortFilter === 'newest') {
      // Sort newest first
      items.sort((a, b) => parseDate(b.date) - parseDate(a.date));
    } else if (currentSortFilter === 'oldest') {
      // Sort oldest first
      items.sort((a, b) => parseDate(a.date) - parseDate(b.date));
    }

    portfolioData = items;
    portfolioContainer.innerHTML = '';

    // If no items found matching the year
    if (portfolioData.length === 0) {
      portfolioContainer.innerHTML = `
        <div class="text-center w-100 py-5">
          <p class="text-muted"><i class="bi bi-info-circle-fill"></i> ${lang === 'id' ? 'Tidak ada portofolio di tahun ini.' : 'No portfolio items found in this year.'}</p>
        </div>
      `;
      // Reflow Isotope
      if (initIsotope) {
        initIsotope.reloadItems();
        initIsotope.layout();
      }
      return;
    }

    // 3. Render Cards
    portfolioData.forEach(item => {
      const filterClasses = item.categories.map(c => `filter-${c}`).join(' ');
      const translatedTitle = lang === 'id' ? (item.title_id || item.title_en || item.title) : (item.title_en || item.title || item.title_id);
      const translatedDesc = lang === 'id' ? (item.desc_id || item.desc_en) : item.desc_en;
      const searchTarget = `${translatedTitle} ${translatedDesc} ${item.tools.join(' ')}`.toLowerCase();

      const cardCol = document.createElement('div');
      cardCol.className = `col-lg-4 col-md-6 portfolio-item isotope-item ${filterClasses}`;
      cardCol.setAttribute('data-search-target', searchTarget);

      const detailsAnchor = `
        <a href="#" title="More Details" class="details-link" data-project-id="${item.id}"><i class="bi bi-link-45deg"></i></a>
      `;

      const toolTags = item.tools.slice(0, 3).map(tool => `<span class="tag-badge">${tool}</span>`).join('');

      cardCol.innerHTML = `
        <div class="portfolio-content h-100">
          <img src="${getDirectImageUrl(item.thumbnail)}" class="img-fluid" alt="${translatedTitle}">
          <div class="portfolio-info">
            <div class="portfolio-info-content">
              <h4>${translatedTitle}</h4>
              <p>${translatedDesc}</p>
              <div class="portfolio-tags">${toolTags}</div>
            </div>
            <div class="portfolio-links">
              ${detailsAnchor}
            </div>
          </div>
        </div>
      `;

      portfolioContainer.appendChild(cardCol);
    });

    // 4. Initialize or update Isotope
    const isotopeLayout = document.querySelector('.isotope-layout');
    if (isotopeLayout) {
      let layout = isotopeLayout.getAttribute('data-layout') ?? 'masonry';
      let defaultFilter = isotopeLayout.getAttribute('data-default-filter') ?? '*';
      let sort = isotopeLayout.getAttribute('data-sort') ?? 'original-order';

      if (initIsotope) {
        initIsotope.destroy();
        initIsotope = null;
      }

      imagesLoaded(isotopeLayout.querySelector('.isotope-container'), function() {
        initIsotope = new Isotope(isotopeLayout.querySelector('.isotope-container'), {
          itemSelector: '.isotope-item',
          layoutMode: layout,
          filter: defaultFilter,
          sortBy: sort
        });
        
        filterIsotope();
        aosInit();
      });
    }
  }

  /**
   * Fetch JSON & Dynamically Build Portfolio Items
   */
  function fetchAndRenderPortfolio() {
    const portfolioContainer = document.getElementById('portfolio-container');
    const loadingEl = document.getElementById('portfolio-loading');

    fetch('data/portfolio-data.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch portfolio data');
        }
        return response.json();
      })
      .then(data => {
        rawPortfolioData = data;

        // Clear loading spinner
        if (loadingEl) loadingEl.remove();

        // Perform initial render
        renderPortfolioFilteredAndSorted();

        // Initialize glightbox once
        GLightbox({
          selector: '.glightbox'
        });

        // Handle Isotope filters tabs clicks
        const isotopeLayout = document.querySelector('.isotope-layout');
        if (isotopeLayout) {
          isotopeLayout.querySelectorAll('.isotope-filters li').forEach(function(filterBtn) {
            filterBtn.addEventListener('click', function() {
              isotopeLayout.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
              this.classList.add('filter-active');
              
              currentCategoryFilter = this.getAttribute('data-filter');
              filterIsotope();
              
              aosInit();
            });
          });
        }

        // Live Search Input Listener
        const searchInput = document.getElementById('portfolio-search');
        if (searchInput) {
          searchInput.addEventListener('input', function(e) {
            currentSearchQuery = e.target.value;
            filterIsotope();
          });
        }

        // Dropdown Sort/Filter Listener
        const sortFilterSelect = document.getElementById('portfolio-sort-filter');
        if (sortFilterSelect) {
          sortFilterSelect.addEventListener('change', function(e) {
            currentSortFilter = e.target.value;
            renderPortfolioFilteredAndSorted();
          });
        }

        // Event listener delegation for Details links click
        if (portfolioContainer) {
          portfolioContainer.addEventListener('click', function(e) {
            const detailAnchor = e.target.closest('.details-link');
            if (detailAnchor) {
              e.preventDefault();
              const pId = detailAnchor.getAttribute('data-project-id');
              openProjectDetailsModal(pId);
            }
          });
        }
      })
      .catch(err => {
        console.error('Error loading portfolio:', err);
        if (portfolioContainer) {
          portfolioContainer.innerHTML = `
            <div class="alert alert-danger text-center w-100" role="alert">
              <i class="bi bi-exclamation-triangle-fill"></i> 
              ${lang === 'id' ? 'Gagal memuat database portofolio. Silakan segarkan halaman.' : 'Failed to load portfolio database. Please refresh the page.'}
            </div>
          `;
        }
      });
  }

  // Fetch and populate portfolio once window load
  window.addEventListener('load', () => {
    fetchAndRenderPortfolio();
  });

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    });
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);
  
})();
