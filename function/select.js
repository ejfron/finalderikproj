document.addEventListener("DOMContentLoaded", () => {
    const listVid = document.querySelectorAll('.list_vid a'); // Menu links
    const vidItems = document.querySelectorAll('.vid_item > div'); // Video sections
    const allVideos = document.querySelectorAll('.vid_item iframe'); // All videos

    // Mute all videos initially
    allVideos.forEach(video => {
        video.muted = true;
    });

    let currentVideo = null; // Track currently playing video
    let sequenceTimeout = null; // Timeout for sequential playback
    let isHovering = false; // Track hover state
    let currentVideoIndex = 0; // Current video in the sequence

    let currentlyPlaying = null;

    document.querySelectorAll('.video-iframe').forEach(iframe => {
        iframe.addEventListener('click', () => {
            const iframeUrl = iframe.src;
    
            // Stop the currently playing iframe by resetting its source
            if (currentlyPlaying && currentlyPlaying !== iframe) {
                const stopUrl = currentlyPlaying.src + "?autoplay=0";
                currentlyPlaying.src = stopUrl;
            }
    
            // Set the newly clicked iframe
            currentlyPlaying = iframe;
            
            // Redirect iframe content into a new browser tab
            window.open(iframeUrl, '_blank');
        });
    });
    


    // Handle menu clicks
    listVid.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior

            // Get target ID
            const targetId = link.id;

            // Toggle active class for the menu
            listVid.forEach(item => item.classList.toggle('active', item === link));

            // Show the matching video section and hide others
            vidItems.forEach(item => {
                item.style.display = item.classList.contains(targetId) ? "flex" : "none";
            });

            // Reset the video sequence and start playback
            currentVideoIndex = 0;
            playVideosSequentially();
        });
    });

    // Handle hover functionality for all videos
    allVideos.forEach(video => {
        video.addEventListener('mouseover', () => {
            isHovering = true;

            // Stop sequential playback
            if (sequenceTimeout) {
                clearTimeout(sequenceTimeout);
            }

            // Play the hovered video
            if (currentVideo && currentVideo !== video) {
                stopVideo(currentVideo); // Stop the current video
            }
            playVideo(video);
        });

        video.addEventListener('mouseout', () => {
            isHovering = false;

            // Stop the hovered video
            stopVideo(video);

            // Resume sequential playback after hover
            setTimeout(() => {
                if (!isHovering) {
                    playVideosSequentially();
                }
            }, 500); // Slight delay
        });
    });

    // Default setup: Show "advertisement" section and play its first video
    document.querySelector('#advertisement').click();
});
