document.addEventListener('DOMContentLoaded', () => {
    // Get elements for Route From
    const addRouteFromButton = document.getElementById('add-route-from');
    const removeRouteFromButton = document.getElementById('remove-route-from');
    const routeFromSelect = document.getElementById('route-from');
    const newRouteFromInput = document.getElementById('new-route-from');

    // Get elements for Route To
    const addRouteToButton = document.getElementById('add-route-to');
    const removeRouteToButton = document.getElementById('remove-route-to');
    const routeToSelect = document.getElementById('route-to');
    const newRouteToInput = document.getElementById('new-route-to');

    // Get elements for Place
    const placeSelect = document.getElementById('place');

    // Get elements for Aircraft Type
    const addAircraftTypeButton = document.getElementById('add-aircraft-type');
    const removeAircraftTypeButton = document.getElementById('remove-aircraft-type');
    const aircraftTypeSelect = document.getElementById('aircraft-type');
    const newAircraftTypeInput = document.getElementById('new-aircraft-type');

    // Get elements for Registration Marks
    const addRegistrationMarkButton = document.getElementById('add-registration-mark');
    const removeRegistrationMarkButton = document.getElementById('remove-registration-mark');
    const registrationMarkSelect = document.getElementById('registration-marks');
    const newRegistrationMarkInput = document.getElementById('new-registration-mark');

    // Get elements for authentication
    const authPasswordAircraftInput = document.getElementById('auth-password-aircraft');
    const submitAuthAircraftButton = document.getElementById('submit-auth-aircraft');
    const authPasswordRegistrationInput = document.getElementById('auth-password-registration');
    const submitAuthRegistrationButton = document.getElementById('submit-auth-registration');
    const correctAircraftPassword = '12345'; // Replace with your actual password for Aircraft Type
    const correctRegistrationPassword = '12345'; // Replace with your actual password for Registration Marks

    let isAircraftTypeAuthenticated = false;
    let isRegistrationAuthenticated = false;

    // Disable Add and Remove buttons for Aircraft Type and Registration Marks initially
    if (addAircraftTypeButton) addAircraftTypeButton.disabled = true;
    if (removeAircraftTypeButton) removeAircraftTypeButton.disabled = true;
    if (addRegistrationMarkButton) addRegistrationMarkButton.disabled = true;
    if (removeRegistrationMarkButton) removeRegistrationMarkButton.disabled = true;

    // Aircraft Type authentication
    submitAuthAircraftButton.addEventListener('click', () => {
        const enteredPassword = authPasswordAircraftInput.value;
        if (enteredPassword === correctAircraftPassword) {
            isAircraftTypeAuthenticated = true;
            if (addAircraftTypeButton) addAircraftTypeButton.disabled = false;
            if (removeAircraftTypeButton) removeAircraftTypeButton.disabled = false;
            authPasswordAircraftInput.value = ''; // Clear the password field
        } else {
            alert('Incorrect password for Aircraft Type');
        }
    });

    // Registration Marks authentication
    submitAuthRegistrationButton.addEventListener('click', () => {
        const enteredPassword = authPasswordRegistrationInput.value;
        if (enteredPassword === correctRegistrationPassword) {
            isRegistrationAuthenticated = true;
            if (addRegistrationMarkButton) addRegistrationMarkButton.disabled = false;
            if (removeRegistrationMarkButton) removeRegistrationMarkButton.disabled = false;
            authPasswordRegistrationInput.value = ''; // Clear the password field
        } else {
            alert('Incorrect password for Registration Marks');
        }
    });

    // Function to load options from local storage
    function loadOptions(selectElement, key) {
        const options = JSON.parse(localStorage.getItem(key)) || [];
        selectElement.innerHTML = '<option value="">Select an option</option>'; // Reset to default option
        options.forEach(option => {
            const newOption = document.createElement('option');
            newOption.value = option;
            newOption.textContent = option;
            selectElement.appendChild(newOption);
        });
    }

    // Function to save options to local storage
    function saveOptions(selectElement, key) {
        const options = Array.from(selectElement.options)
            .slice(1) // Exclude the default option
            .map(option => option.value);
        localStorage.setItem(key, JSON.stringify(options));
    }

    // Function to add new option
    function addOption(selectElement, inputElement, key) {
        const newOptionValue = inputElement.value.trim();
        if (newOptionValue && !Array.from(selectElement.options).some(option => option.value === newOptionValue)) {
            const newOption = document.createElement('option');
            newOption.value = newOptionValue;
            newOption.textContent = newOptionValue;
            selectElement.appendChild(newOption);
            inputElement.value = '';
            saveOptions(selectElement, key); // Save to local storage
        }
    }

    // Function to remove selected option
    function removeSelectedOption(selectElement, key) {
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        if (selectedOption) {
            selectElement.removeChild(selectedOption);
            saveOptions(selectElement, key); // Save to local storage
        }
    }

    // Function to populate Place options based on selected Route From and Route To
    function populatePlaceOptions() {
        placeSelect.innerHTML = '<option value="">Select a place</option>'; // Reset options
        const routeFromValue = routeFromSelect.value;
        const routeToValue = routeToSelect.value;

        if (routeFromValue && routeToValue) {
            // Example logic to populate Place options based on selected Route From and Route To
            const places = [routeFromValue, routeToValue]; // Modify this logic as needed
            places.forEach(place => {
                const option = document.createElement('option');
                option.value = place;
                option.textContent = place;
                placeSelect.appendChild(option);
            });
        }
    }

    // Add event listeners for Route From
    if (addRouteFromButton) {
        addRouteFromButton.addEventListener('click', () => addOption(routeFromSelect, newRouteFromInput, 'routeFromOptions'));
    }
    if (removeRouteFromButton) {
        removeRouteFromButton.addEventListener('click', () => removeSelectedOption(routeFromSelect, 'routeFromOptions'));
    }

    // Add event listeners for Route To
    if (addRouteToButton) {
        addRouteToButton.addEventListener('click', () => addOption(routeToSelect, newRouteToInput, 'routeToOptions'));
    }
    if (removeRouteToButton) {
        removeRouteToButton.addEventListener('click', () => removeSelectedOption(routeToSelect, 'routeToOptions'));
    }

    // Add event listeners for Aircraft Type
    if (addAircraftTypeButton) {
        addAircraftTypeButton.addEventListener('click', () => {
            if (isAircraftTypeAuthenticated) {
                addOption(aircraftTypeSelect, newAircraftTypeInput, 'aircraftTypeOptions');
            } else {
                alert('Please enter the correct password to add aircraft types.');
            }
        });
    }
    if (removeAircraftTypeButton) {
        removeAircraftTypeButton.addEventListener('click', () => {
            if (isAircraftTypeAuthenticated) {
                removeSelectedOption(aircraftTypeSelect, 'aircraftTypeOptions');
            } else {
                alert('Please enter the correct password to remove aircraft types.');
            }
        });
    }

    // Add event listeners for Registration Marks
    if (addRegistrationMarkButton) {
        addRegistrationMarkButton.addEventListener('click', () => {
            if (isRegistrationAuthenticated) {
                addOption(registrationMarkSelect, newRegistrationMarkInput, 'registrationMarkOptions');
            } else {
                alert('Please enter the correct password to add registration marks.');
            }
        });
    }
    if (removeRegistrationMarkButton) {
        removeRegistrationMarkButton.addEventListener('click', () => {
            if (isRegistrationAuthenticated) {
                removeSelectedOption(registrationMarkSelect, 'registrationMarkOptions');
            } else {
                alert('Please enter the correct password to remove registration marks.');
            }
        });
    }

    // Add change event listeners to Route From and Route To to populate Place options
    routeFromSelect.addEventListener('change', populatePlaceOptions);
    routeToSelect.addEventListener('change', populatePlaceOptions);

    // Load options on page load
    loadOptions(routeFromSelect, 'routeFromOptions');
    loadOptions(routeToSelect, 'routeToOptions');
    loadOptions(aircraftTypeSelect, 'aircraftTypeOptions');
    loadOptions(registrationMarkSelect, 'registrationMarkOptions');
    
    populatePlaceOptions(); // Initialize Place options based on loaded Route From and Route To values
});
