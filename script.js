window.onload = function () {
    let currentCategoryIndex = 0;
    const categories = document.querySelectorAll('.carousel-item');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const gatherAllBtn = document.getElementById('gather-all');
    const convertPdfBtn = document.getElementById('convert-pdf');
    const checklistContainer = document.getElementById('checklist-container');

    // Retrieve user information from localStorage
    function getUserInfo() {
        const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
        return userInfo;
    }

    function displayUserInfo() {
        const userInfo = getUserInfo();
        if (userInfo) {
            const userInfoDiv = document.createElement('div');
            userInfoDiv.classList.add('user-info');
            userInfoDiv.innerHTML = `
                <h2>SAFA Inspection Report</h2>
                <p><strong>Auditeur:</strong> ${userInfo.auditeur || ''}</p>
                <p><strong>Date:</strong> ${userInfo.date || ''}</p>
                <p><strong>Route From:</strong> ${userInfo.routeFrom || ''}</p>
                <p><strong>Route To:</strong> ${userInfo.routeTo || ''}</p>
                <p><strong>Aircraft Type:</strong> ${userInfo.aircraftType || ''}</p>
                <p><strong>Place:</strong> ${userInfo.place || ''}</p>
                <p><strong>Local Time:</strong> ${userInfo.localTime || ''}</p>
                <p><strong>Flight Number:</strong> ${userInfo.flightNumber || ''}</p>
                <p><strong>Registration Marks:</strong> ${userInfo.registrationMarks || ''}</p>
                <p><strong>Psychoactive Test:</strong> ${userInfo.psychoactiveTest || ''}</p>
            `;
            checklistContainer.insertBefore(userInfoDiv, checklistContainer.firstChild);
        }
    }

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

    function handleCheckbox(rowId, answer) {
        // Get all checkboxes in the same row
        const row = document.querySelector(`.choice-row[data-choice="${rowId}"]`);
        const checkboxes = row.querySelectorAll('.choice-checkbox');

        // Ensure only one checkbox is checked
        checkboxes.forEach(checkbox => {
            if (checkbox.id.includes(answer.toLowerCase())) {
                checkbox.checked = true;
            } else {
                checkbox.checked = false;
            }
        });
    }

    prevBtn.addEventListener('click', () => {
        // Ensure the previous index is within bounds
        if (currentCategoryIndex > 0) {
            currentCategoryIndex--;
            showCategory(currentCategoryIndex);
        }
    });

    nextBtn.addEventListener('click', () => {
        // Ensure the next index is within bounds
        if (currentCategoryIndex < categories.length - 1) {
            currentCategoryIndex++;
            showCategory(currentCategoryIndex);
        }
    });

    gatherAllBtn.addEventListener('click', () => {
        saveState(); // Save the state before modifying

        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';

        categories.forEach(category => {
            category.classList.add('active');
            const items = category.querySelectorAll('.item');
            items.forEach(item => {
                item.style.display = 'block'; // Show all items
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
            item.style.display = 'block'; // Ensure all items are displayed

            const labels = item.querySelectorAll('.options label');
            labels.forEach(label => {
                const checkbox = label.querySelector('input[type="checkbox"]');
                if (checkbox && checkbox.checked) {
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
        });

        // Create Findings Section
        const findingsSection = document.createElement('div');
        findingsSection.classList.add('findings-section');
        findingsSection.innerHTML = '<h2>Findings</h2><ul id="findings-list"></ul>';
        const findingsList = findingsSection.querySelector('#findings-list');

        items.forEach(item => {
            const nonConfirmCheckbox = item.querySelector('.non-confirm');
            if (nonConfirmCheckbox && nonConfirmCheckbox.checked) {
                const itemName = item.querySelector('span').textContent;

                // Determine the category for the item
                let categoryText = '';
                const cat1Radio = item.querySelector('input.cat1:checked');
                const cat2Radio = item.querySelector('input.cat2:checked');
                const cat3Radio = item.querySelector('input.cat3:checked');

                if (cat1Radio) {
                    categoryText = 'CAT 1';
                } else if (cat2Radio) {
                    categoryText = 'CAT 2';
                } else if (cat3Radio) {
                    categoryText = 'CAT 3';
                }

                const listItem = document.createElement('li');
                listItem.textContent = `${itemName} || ${categoryText}`; // Append "CAT" label with hyphen
                findingsList.appendChild(listItem);
            }
        });

        // Create a container for the entire content including findings
        const fullContent = document.createElement('div');

        // Retrieve and append user information to the PDF
        const userInfo = getUserInfo();
        if (userInfo) {
            const existingUserInfoDiv = clone.querySelector('.user-info');
            if (!existingUserInfoDiv) {
                const userInfoDiv = document.createElement('div');
                userInfoDiv.classList.add('user-info');
                userInfoDiv.innerHTML = `
                    <h2> Inspection Details</h2>
                    <p><strong>Auditeur:</strong> ${userInfo.auditeur || ''}</p>
                    <p><strong>Date:</strong> ${userInfo.date || ''}</p>
                    <p><strong>Route From:</strong> ${userInfo.routeFrom || ''}</p>
                    <p><strong>Route To:</strong> ${userInfo.routeTo || ''}</p>
                    <p><strong>Aircraft Type:</strong> ${userInfo.aircraftType || ''}</p>
                    <p><strong>Place:</strong> ${userInfo.place || ''}</p>
                    <p><strong>Local Time:</strong> ${userInfo.localTime || ''}</p>
                    <p><strong>Flight Number:</strong> ${userInfo.flightNumber || ''}</p>
                    <p><strong>Registration Marks:</strong> ${userInfo.registrationMarks || ''}</p>
                    <p><strong>Psychoactive Test:</strong> ${userInfo.psychoactiveTest || ''}</p>
                `;
                fullContent.appendChild(userInfoDiv);
            }
        }

        // Append the cloned checklist and findings section to fullContent
        fullContent.appendChild(clone);
        fullContent.appendChild(findingsSection);

        // Adjust PDF generation options
        const opt = {
            margin: [10, 10, 10, 10], // Margins to center content
            filename: 'checklist.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 1.5 }, // Adjust scale for fitting content
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Generate the PDF with findings section
        html2pdf().set(opt).from(fullContent).save();
    });


    function initCheckboxes() {
        const choiceRows = document.querySelectorAll('.item .options');
        choiceRows.forEach(row => {
            const conformeCheckbox = row.querySelector('.confirm');
            const nonConformeCheckbox = row.querySelector('.non-confirm');
    
            conformeCheckbox.addEventListener('change', () => {
                if (conformeCheckbox.checked) {
                    nonConformeCheckbox.checked = false;
                }
            });
    
            nonConformeCheckbox.addEventListener('change', () => {
                if (nonConformeCheckbox.checked) {
                    conformeCheckbox.checked = false;
                }
            });
        });
    }

    function initCheckboxes() {
        // Get all .item elements
        const items = document.querySelectorAll('.item');
    
        items.forEach(item => {
            // Get checkboxes for 'Conforme' and 'Non Conforme'
            const conformeCheckbox = item.querySelector('.confirm');
            const nonConformeCheckbox = item.querySelector('.non-confirm');
            
            // Get checkboxes for categories
            const catCheckboxes = item.querySelectorAll('.cat1, .cat2, .cat3');
    
            // Function to handle enabling/disabling of category checkboxes
            function updateCategoryCheckboxes() {
                if (nonConformeCheckbox.checked) {
                    // Enable category checkboxes if 'Non Conforme' is checked
                    catCheckboxes.forEach(catCheckbox => {
                        catCheckbox.disabled = false;
                    });
                } else {
                    // Disable category checkboxes if 'Non Conforme' is not checked
                    catCheckboxes.forEach(catCheckbox => {
                        catCheckbox.disabled = true;
                        catCheckbox.checked = false; // Uncheck all category checkboxes
                    });
                }
            }
    
            // Initialize category checkboxes to be disabled
            updateCategoryCheckboxes();
    
            // Add change event listeners
            conformeCheckbox.addEventListener('change', () => {
                if (conformeCheckbox.checked) {
                    nonConformeCheckbox.checked = false; // Uncheck 'Non Conforme' if 'Conforme' is checked
                    updateCategoryCheckboxes();
                }
            });
    
            nonConformeCheckbox.addEventListener('change', () => {
                if (nonConformeCheckbox.checked) {
                    conformeCheckbox.checked = false; // Uncheck 'Conforme' if 'Non Conforme' is checked
                    updateCategoryCheckboxes();
                } else {
                    updateCategoryCheckboxes();
                }
            });
        });
    }

        // Sélectionnez tous les groupes d'options
        const optionGroups = document.querySelectorAll('.options');

        optionGroups.forEach(group => {
            const cat1 = group.querySelector('.cat1');
            const cat2 = group.querySelector('.cat2');
            const cat3 = group.querySelector('.cat3');
    
            // Fonction pour décocher les autres cases
            function handleCatCheckboxChange() {
                if (this.checked) {
                    if (this.classList.contains('cat1')) {
                        cat2.checked = false;
                        cat3.checked = false;
                    } else if (this.classList.contains('cat2')) {
                        cat1.checked = false;
                        cat3.checked = false;
                    } else if (this.classList.contains('cat3')) {
                        cat1.checked = false;
                        cat2.checked = false;
                    }
                }
            }
    
            // Ajoutez des écouteurs d'événements pour les cases à cocher
            cat1.addEventListener('change', handleCatCheckboxChange);
            cat2.addEventListener('change', handleCatCheckboxChange);
            cat3.addEventListener('change', handleCatCheckboxChange);
        });
    
 

    displayUserInfo(); // Display user information on page load
    showCategory(currentCategoryIndex); // Show the first category initially
    initCheckboxes(); // Initialize checkboxes when the page loads
    initSpecialCheckboxes(); // Initialize special checkboxes

};







