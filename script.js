document.addEventListener("DOMContentLoaded", () => {
    const imageGallery = document.getElementById("imageGallery");
    const largeImage = document.getElementById("largeImage");
    let galleryItems = document.querySelectorAll(".gallery-item img");
    let userClicked = false;
    let isUserScrolling = false;
    let scrollTimeout;

    // Clone the gallery items to create an infinite loop
    const cloneGallery = () => {
        const galleryItemCount = galleryItems.length;
        for (let i = 0; i < galleryItemCount; i++) {
            const clone = galleryItems[i].closest('.gallery-item').cloneNode(true);
            imageGallery.appendChild(clone);
        }
        galleryItems = document.querySelectorAll(".gallery-item img"); // Update the galleryItems NodeList
    };
    cloneGallery();

    // Automatically select the first image
    const firstImage = galleryItems[0];
    firstImage.classList.add("selected");
    largeImage.src = firstImage.src;

    let scrollStep = 100; // Adjust scroll step size
    let scrollPause = 1000; // Pause time in milliseconds
    let scrollDelay = 1000; // Additional delay before scrolling
    let currentScrollPosition = 0; // Track current scroll position

    function autoScrollGallery() {
        if (isUserScrolling) return; // Prevent auto-scrolling while user is scrolling

        let maxScrollLeft = imageGallery.scrollWidth / 2;

        // Update the scroll position
        currentScrollPosition += scrollStep;

        // Smooth scroll by a small increment
        imageGallery.scrollTo({
            left: currentScrollPosition,
            behavior: 'smooth'
        });

        // If the user has not clicked, update the large image to the next one
        if (!userClicked) {
            const nextIndex = (Math.floor(currentScrollPosition / scrollStep)) % galleryItems.length;
            const nextImage = galleryItems[nextIndex];
            galleryItems.forEach(img => img.classList.remove("selected"));
            nextImage.classList.add("selected");
            largeImage.src = nextImage.src;
        }

        // Reset to the start when reaching the end of the duplicated items
        if (currentScrollPosition >= maxScrollLeft) {
            currentScrollPosition = 0;
            imageGallery.scrollTo({ left: 0 });
        }
    }

    // Set interval for the incremental scroll with delay
    let autoScrollInterval = setInterval(autoScrollGallery, scrollPause + scrollDelay);

    // Click event to select an image
    imageGallery.addEventListener("click", (event) => {
        const clickedImage = event.target;

        if (clickedImage.tagName.toLowerCase() === 'img') {
            // Update the large image
            largeImage.src = clickedImage.src;

            // Remove selected class from all images and add to the clicked one
            galleryItems.forEach(img => img.classList.remove("selected"));
            clickedImage.classList.add("selected");

            // Update the scroll position to center the clicked image
            currentScrollPosition = clickedImage.closest('.gallery-item').offsetLeft;
            imageGallery.scrollTo({ left: currentScrollPosition, behavior: 'smooth' });

            // Mark that the user has clicked an image
            userClicked = true;

            // Reset the auto-scroll after the click to continue the auto-scrolling
            clearInterval(autoScrollInterval);
            autoScrollInterval = setInterval(autoScrollGallery, scrollPause + scrollDelay);
        }
    });

    // Pause auto-scrolling while the user is manually scrolling
    imageGallery.addEventListener("scroll", () => {
        clearTimeout(scrollTimeout);
        isUserScrolling = true;

        scrollTimeout = setTimeout(() => {
            isUserScrolling = false;
        }, 200); // Adjust delay (in ms) to determine how long after scrolling stops auto-scroll resumes
    });
});
