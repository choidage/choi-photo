document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor Logic
    const cursor = document.createElement('div');
    cursor.classList.add('cursor');
    
    // Only add custom cursor if not on mobile/touch device
    if (window.matchMedia("(pointer: fine)").matches) {
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Add hover effects for links and images
        const links = document.querySelectorAll('a, button');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
            link.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
        });

        const images = document.querySelectorAll('.gallery-item-asym img');
        images.forEach(img => {
            img.addEventListener('mouseenter', () => {
                cursor.classList.add('hovering');
                cursor.classList.add('hovering-img');
            });
            img.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovering');
                cursor.classList.remove('hovering-img');
            });
        });
    }

    // Dynamic Gallery Rendering
    const galleryGrid = document.getElementById('gallery-grid');
    if (galleryGrid && typeof galleryData !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const categoryFilter = urlParams.get('category');
        
        const categoryTitle = document.getElementById('category-title');
        if (categoryFilter && categoryTitle) {
            categoryTitle.textContent = categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1);
        }

        let filteredData = galleryData;
        if (categoryFilter) {
            filteredData = galleryData.filter(item => item.category === categoryFilter);
        }

        if (filteredData.length === 0) {
            galleryGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); margin-top: 5rem; grid-column-start: 1; grid-column-end: 13;">아직 사진이 없습니다.<br>해당 폴더에 사진을 넣고 "사진업데이트.bat"를 실행해주세요.</p>';
        } else {
            let html = '';
            filteredData.forEach((item, index) => {
                const itemClassNumber = (index % 7) + 1;
                html += `
                    <div class="gallery-item-asym item-${itemClassNumber}">
                        <img src="${item.path}" alt="${item.category} photo">
                    </div>
                `;
            });
            galleryGrid.innerHTML = html;
        }

        // Add hover effects for dynamically added images
        if (window.matchMedia("(pointer: fine)").matches) {
            const newImages = document.querySelectorAll('.gallery-item-asym img');
            newImages.forEach(img => {
                img.addEventListener('mouseenter', () => {
                    cursor.classList.add('hovering');
                    cursor.classList.add('hovering-img');
                });
                img.addEventListener('mouseleave', () => {
                    cursor.classList.remove('hovering');
                    cursor.classList.remove('hovering-img');
                });
            });
        }

        // Lightbox Logic
        const lightbox = document.getElementById('lightbox');
        if (lightbox && filteredData.length > 0) {
            const lightboxImg = document.getElementById('lightbox-img');
            const closeBtn = document.querySelector('.lightbox-close');
            const prevBtn = document.querySelector('.lightbox-prev');
            const nextBtn = document.querySelector('.lightbox-next');
            let currentIndex = 0;

            const openLightbox = (index) => {
                currentIndex = index;
                lightboxImg.src = filteredData[currentIndex].path;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            };

            const closeLightbox = () => {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            };

            const showNext = (e) => {
                if (e) e.stopPropagation();
                currentIndex = (currentIndex + 1) % filteredData.length;
                lightboxImg.src = filteredData[currentIndex].path;
            };

            const showPrev = (e) => {
                if (e) e.stopPropagation();
                currentIndex = (currentIndex - 1 + filteredData.length) % filteredData.length;
                lightboxImg.src = filteredData[currentIndex].path;
            };

            // Attach click to all images
            const imagesToClick = document.querySelectorAll('.gallery-item-asym img');
            imagesToClick.forEach((img, idx) => {
                img.addEventListener('click', () => openLightbox(idx));
            });

            closeBtn.addEventListener('click', closeLightbox);
            nextBtn.addEventListener('click', showNext);
            prevBtn.addEventListener('click', showPrev);

            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) {
                    closeLightbox();
                }
            });

            document.addEventListener('keydown', (e) => {
                if (lightbox.classList.contains('active')) {
                    if (e.key === 'Escape') closeLightbox();
                    if (e.key === 'ArrowRight') showNext();
                    if (e.key === 'ArrowLeft') showPrev();
                }
            });
        }
    }

    // Scroll Reveal Animation using Intersection Observer
    const revealElements = document.querySelectorAll('.gallery-item-asym, .profile-text');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('reveal');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            hamburger.classList.toggle('active');
        });
    }

    // Dropdown Toggle (Universal)
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        link.addEventListener('click', (e) => {
            // Toggle the dropdown instead of navigating
            e.preventDefault();
            dropdown.classList.toggle('active');
        });
    });
});
