/**
 * Covertfily Ad Fallback System (EvaDav / General)
 * Detects ad-blocking and displays high-quality branded placeholders.
 */

(function() {
    const handleAdFallback = () => {
        const checkAd = (containerSelector, fallbackId) => {
            const containers = document.querySelectorAll(containerSelector);
            const fallback = document.getElementById(fallbackId);
            
            if (!fallback) return;

            // Check if any container has an iframe, script-injected div, or significant height
            let isBlocked = true;
            containers.forEach(container => {
                // Common signs of loaded ads: iframes, 'ins' tags (Google), or nested divs with content
                const hasIframe = container.querySelector('iframe');
                const hasContent = container.innerHTML.trim().length > 50 && !container.querySelector('.ad-fallback');
                const hasHeight = container.offsetHeight > 50;

                if (hasIframe || (hasContent && hasHeight)) {
                    isBlocked = false;
                }
            });

            if (isBlocked) {
                fallback.style.display = 'flex';
                containers.forEach(c => {
                    c.style.minHeight = '600px';
                    c.style.background = '#f8fafc';
                });
            }
        };

        // Delay to allow ad scripts (like EvaDav) to execute
        setTimeout(() => {
            checkAd('.side-ad-left', 'fallback-left');
            checkAd('.side-ad-right', 'fallback-right');
        }, 4500);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', handleAdFallback);
    } else {
        handleAdFallback();
    }
})();
