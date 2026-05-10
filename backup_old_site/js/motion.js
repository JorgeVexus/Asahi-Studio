/**
 * ASAHI STUDIO - PRECISION MOTION ENGINE V3.0
 * Engineered GSAP Sequences, Lenis Smooth Scroll, and Custom Interaction Logic
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 01. CORE SETUP: LENIS SMOOTH SCROLL
    // ==========================================================================
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing for premium feel
        smoothWheel: true,
        wheelMultiplier: 1,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    gsap.registerPlugin(ScrollTrigger, SplitText);

    // Update Scroll Progress Bar
    lenis.on('scroll', (e) => {
        const progress = e.progress * 100;
        gsap.set('.scroll-progress-bar', { width: `${progress}%` });
    });

    // ==========================================================================
    // 02. CUSTOM CURSOR & CROSSHAIRS
    // ==========================================================================
    // Only init if not on mobile/touch
    if (window.matchMedia("(pointer: fine)").matches) {
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorRing = document.querySelector('.cursor-ring');
        const crossH = document.querySelector('.h-crosshair');
        const crossV = document.querySelector('.v-crosshair');

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Fast follow for dot
            gsap.to(cursorDot, { x: mouseX, y: mouseY, duration: 0.1, ease: "power2.out" });
            
            // Smooth follow for ring
            gsap.to(cursorRing, { x: mouseX, y: mouseY, duration: 0.4, ease: "power3.out" });

            // Crosshairs lock to cursor
            gsap.to(crossH, { y: mouseY, duration: 0.2, ease: "power2.out" });
            gsap.to(crossV, { x: mouseX, duration: 0.2, ease: "power2.out" });
        });

        // Hover States
        const interactables = document.querySelectorAll('a, button, .accordion-header, .project-card');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    // ==========================================================================
    // 03. GLOBAL CLOCK
    // ==========================================================================
    function updateClock() {
        const now = new Date();
        const str = now.toISOString().slice(11, 19) + ":" + Math.floor(now.getMilliseconds() / 10).toString().padStart(2, '0');
        document.getElementById('global-clock').innerText = str;
        requestAnimationFrame(updateClock);
    }
    updateClock();

    // ==========================================================================
    // 04. BOOT SEQUENCE (INITIALIZATION)
    // ==========================================================================
    
    // Split text for hero
    const heroSplit = new SplitText("#hero .split-text", { type: "words,chars" });
    
    const bootTl = gsap.timeline({ defaults: { ease: "expo.out" } });

    // Initial state
    gsap.set('.sys-header', { y: -100 });
    gsap.set(heroSplit.chars, { y: 100, opacity: 0 });
    gsap.set('[data-animate="fade-up"]', { y: 40, opacity: 0 });

    bootTl.to('.system-grid', { opacity: 1, duration: 2, ease: "power2.inOut" })
          .to('.sys-header', { y: 0, duration: 1.5 }, "-=1")
          .to(heroSplit.chars, { 
              y: 0, 
              opacity: 1, 
              stagger: 0.02, 
              duration: 1.5 
          }, "-=1")
          .to('[data-animate="fade-up"]', { 
              y: 0, 
              opacity: 1, 
              stagger: 0.2, 
              duration: 1.5 
          }, "-=1");

    // ==========================================================================
    // 05. SCROLL ANIMATIONS (MANIFESTO)
    // ==========================================================================
    const manifestoSplit = new SplitText(".split-text-scroll", { type: "lines,words" });
    
    gsap.from(manifestoSplit.words, {
        scrollTrigger: {
            trigger: ".section-manifesto",
            start: "top 70%",
        },
        opacity: 0,
        y: 50,
        rotationX: -45,
        stagger: 0.05,
        duration: 1.2,
        ease: "power3.out"
    });

    gsap.from(".reveal-fade", {
        scrollTrigger: {
            trigger: ".section-manifesto",
            start: "top 60%",
        },
        opacity: 0,
        y: 30,
        duration: 1.5,
        ease: "power2.out"
    });

    // ==========================================================================
    // 06. HORIZONTAL SCROLL (OUTPUT PROJECTS)
    // ==========================================================================
    const outputSection = document.querySelector("#output");
    const horizontalContainer = document.querySelector(".horizontal-scroll-container");

    if (outputSection && horizontalContainer) {
        
        function getScrollAmount() {
            let containerWidth = horizontalContainer.scrollWidth;
            return -(containerWidth - window.innerWidth + (window.innerWidth * 0.1)); // account for padding
        }

        const tween = gsap.to(horizontalContainer, {
            x: getScrollAmount,
            ease: "none"
        });

        ScrollTrigger.create({
            trigger: outputSection,
            start: "top top",
            end: () => `+=${getScrollAmount() * -1}`,
            pin: true,
            animation: tween,
            scrub: 1,
            invalidateOnRefresh: true
        });
    }

    // ==========================================================================
    // 07. ACCORDION SYSTEM (CAPABILITIES)
    // ==========================================================================
    const accordions = document.querySelectorAll('.accordion-item');

    accordions.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');

        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all others
            accordions.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    gsap.to(otherItem.querySelector('.accordion-content'), {
                        height: 0,
                        duration: 0.5,
                        ease: "power3.inOut"
                    });
                }
            });

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
                gsap.set(content, { height: "auto" });
                const targetHeight = content.offsetHeight;
                gsap.set(content, { height: 0 });
                gsap.to(content, {
                    height: targetHeight,
                    duration: 0.6,
                    ease: "power3.inOut"
                });
            } else {
                item.classList.remove('active');
                gsap.to(content, {
                    height: 0,
                    duration: 0.5,
                    ease: "power3.inOut"
                });
            }
        });
    });

    // Open first accordion by default
    if(accordions.length > 0) {
        accordions[0].querySelector('.accordion-header').click();
    }

    // ==========================================================================
    // 08. MAGNETIC BUTTON LOGIC
    // ==========================================================================
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.6,
                ease: "power3.out"
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 1,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });

});
