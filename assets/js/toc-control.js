// Table of Contents - Default Closed
document.addEventListener('DOMContentLoaded', function() {
    // Find the TOC details element
    const tocDetails = document.querySelector('.toc details');
    
    if (tocDetails) {
        // Remove the 'open' attribute to close it by default
        tocDetails.removeAttribute('open');
    }
});
