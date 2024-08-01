window.onload = function () {
    let currentCategoryIndex = 0;
    const categories = document.querySelectorAll('.carousel-item');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const gatherAllBtn = document.getElementById('gather-all');
    const convertPdfBtn = document.getElementById('convert-pdf');
    const checklistContainer = document.getElementById('checklist-container');

    // Store the original HTML content
    let originalContent = checklistContainer.innerHTML;
    let visibilityState = [];

    function showCategory(index) {
        categories.forEach((category, i) => {
            category.classList.toggle('active', i === index);
        });
    }

    function saveState() {
        // Save the current visibility of items
        visibilityState = [];
        categories.forEach(category => {
            const items = category.querySelectorAll('.item');
            items.forEach(item => {
                visibilityState.push(item.style.display);
            });
        });
    }

    function restoreState() {
        let index = 0;
        categories.forEach(category => {
            const items = category.querySelectorAll('.item');
            items.forEach(item => {
                item.style.display = visibilityState[index] || 'block';
                index++;
            });
        });
    }

    prevBtn.addEventListener('click', () => {
        currentCategoryIndex = (currentCategoryIndex - 1 + categories.length) % categories.length;
        showCategory(currentCategoryIndex);
    });

    nextBtn.addEventListener('click', () => {
        currentCategoryIndex = (currentCategoryIndex + 1) % categories.length;
        showCategory(currentCategoryIndex);
    });

    gatherAllBtn.addEventListener('click', () => {
        saveState(); // Save the state before modifying

        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';

        categories.forEach(category => {
            category.classList.add('active');
            const items = category.querySelectorAll('.item');
            items.forEach(item => {
                const checkboxes = item.querySelectorAll('input[type="checkbox"]');
                let hasChecked = false;
                checkboxes.forEach(checkbox => {
                    if (checkbox.checked) {
                        hasChecked = true;
                    }
                });
                item.style.display = hasChecked ? 'block' : 'none';
            });
        });

        gatherAllBtn.style.display = 'none';
        convertPdfBtn.style.display = 'block';
    });

    convertPdfBtn.addEventListener('click', () => {
        const pdfContent = checklistContainer;
        const clone = pdfContent.cloneNode(true);
        clone.classList.add('pdf-checklist');

        // Hide buttons in the PDF
        const buttons = clone.querySelectorAll('#gather-all, #convert-pdf');
        buttons.forEach(button => {
            button.style.display = 'none';
        });

        const items = clone.querySelectorAll('.item');
        items.forEach(item => {
            const labels = item.querySelectorAll('.options label');
            let hasChecked = false;
            labels.forEach(label => {
                const checkbox = label.querySelector('input[type="checkbox"]');
                if (checkbox && checkbox.checked) {
                    hasChecked = true;
                    label.style.backgroundColor = '#0056b3';
                    label.style.color = 'white';
                    label.style.padding = '3px';
                    label.style.borderRadius = '3px';
                }
            });

            const commentInput = item.querySelector('input.comment');
            if (commentInput) {
                const comment = commentInput.value.trim();
                commentInput.style.display = 'none'; // Hide the original input field
                if (comment) {
                    const commentDiv = document.createElement('div');
                    commentDiv.textContent = `Comment: ${comment}`;
                    commentDiv.classList.add('comment-box'); // Apply professional style
                    item.appendChild(commentDiv);
                }
            }

            if (!hasChecked) {
                item.style.display = 'none';
            } else {
                item.classList.add('chosen');
            }
        });

        // Adjust PDF generation options
        const opt = {
            margin: [10, 10, 10, 10], // Margins to center content
            filename: 'checklist.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 1.5 }, // Adjust scale for fitting content
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(clone).save();
    });

    showCategory(currentCategoryIndex); // Show the first category initially
};
