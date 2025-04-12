// ===== DOM ELEMENTS =====
/**
 * Core DOM element references used throughout the application
 * @namespace DOM
 */
const DOM = {
    // Main Container Views
    containersView: document.getElementById('containersView'),
    settlementsView: document.getElementById('settlementsView'),
    
    // Navigation and Action Buttons
    toggleViewButton: document.getElementById('toggleViewButton'),
    calculateButton: document.getElementById('calculateButton'),
    addContainerButton: document.getElementById('addContainerButton'),
    
    // Modal Elements
    addItemModal: document.getElementById('addItemModal'),
    editItemModal: document.getElementById('editItemModal'),
    addContainerModal: document.getElementById('addContainerModal'),
    peopleListModal: document.getElementById('peopleListModal'),
    
    // Form Inputs - Add Item
    itemName: document.getElementById('itemName'),
    itemPrice: document.getElementById('itemPrice'),
    itemPerson: document.getElementById('itemPerson'),
    saveItemButton: document.getElementById('saveItemButton'),
    cancelAddButton: document.getElementById('cancelAddButton'),
    
    // Form Inputs - Edit Item
    editItemName: document.getElementById('editItemName'),
    editItemPrice: document.getElementById('editItemPrice'),
    editItemPerson: document.getElementById('editItemPerson'),
    updateItemButton: document.getElementById('updateItemButton'),
    cancelEditButton: document.getElementById('cancelEditButton'),
    
    // Form Inputs - Add Container
    containerTitle: document.getElementById('containerTitle'),
    iconSelector: document.getElementById('iconSelector'),
    newPersonName: document.getElementById('newPersonName'),
    addPersonButton: document.getElementById('addPersonButton'),
    peopleList: document.getElementById('peopleList'),
    noPeopleMessage: document.getElementById('noPeopleMessage'),
    saveContainerButton: document.getElementById('saveContainerButton'),
    cancelAddContainerButton: document.getElementById('cancelAddContainerButton'),
    quickAddPeopleBtn: document.getElementById('quickAddPeopleBtn'),
    
    // People List Modal
    peopleListTitle: document.getElementById('peopleListTitle'),
    peopleListItems: document.getElementById('peopleListItems'),
    peopleTotal: document.getElementById('peopleTotal'),
    totalExpenses: document.getElementById('totalExpenses'),
    avgExpense: document.getElementById('avgExpense'),
    addPersonToContainer: document.getElementById('addPersonToContainer'),
    addPersonToContainerBtn: document.getElementById('addPersonToContainerBtn'),
    closePeopleListButton: document.getElementById('closePeopleListButton')
};

/**
 * Application State Management
 * Tracks current state of the application to manage interactions
 * @namespace APP_STATE
 */
const APP_STATE = {
    isInitialized: false,
    currentContainer: null,
    currentItemId: null,
    containers: {},
    people: {
        'cafeteria': ['Aayush', 'Purushottam'],
        'shimla': ['Haraswardhan', 'Himanshu'],
        'dhabe': ['Aayush', 'Purushottam']
    },
    expenses: {},
    containerCounter: 4, // Start counter after existing containers
    itemCounter: 9 // Start counter after existing items
};

// ===== INITIALIZATION =====
/**
 * Validates DOM elements to ensure all required elements are available
 * Helps prevent errors from missing elements
 */
(function validateDOM() {
    // Validate DOM elements to prevent errors
    const missingElements = Object.entries(DOM)
        .filter(([key, element]) => element === null)
        .map(([key]) => key);
    
    if (missingElements.length > 0) {
        console.error('Missing DOM elements:', missingElements);
    }
})();

/**
 * Setup event delegation for ripple effects on buttons and controls
 * Creates a water-like ripple effect when elements are clicked
 */
function setupRippleEffects() {
    // Add ripple effect to all buttons using event delegation
    document.addEventListener('click', function(e) {
        const target = e.target;
        let button = null;
        
        // Find the button element that was clicked or contains the clicked element
        if (target.classList.contains('btn') || 
            target.classList.contains('btn-action') || 
            target.classList.contains('btn-add') || 
            target.classList.contains('people-indicator')) {
            button = target;
        } else if (target.closest('.btn') || 
                   target.closest('.btn-action') || 
                   target.closest('.btn-add') || 
                   target.closest('.people-indicator')) {
            button = target.closest('.btn') || 
                     target.closest('.btn-action') || 
                     target.closest('.btn-add') || 
                     target.closest('.people-indicator');
        }
        
        // Create ripple effect if we found a button
        if (button && !button.classList.contains('no-ripple')) {
            createRippleEffect(button, e);
        }
    });
}

/**
 * Creates a visual ripple effect when an element is clicked
 * @param {Element} button - The button element to apply the effect to
 * @param {Event} e - The click event
 */
function createRippleEffect(button, e) {
    // Create ripple element
    const ripple = document.createElement('span');
    ripple.classList.add('ripple-effect');
    
    // Calculate ripple position relative to the button
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    // Calculate size based on button dimensions
    const size = Math.max(rect.width, rect.height) * 2;
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.marginLeft = `-${size/2}px`;
    ripple.style.marginTop = `-${size/2}px`;
    
    // Add ripple to button
    button.appendChild(ripple);
    
    // Remove ripple after animation completes
    setTimeout(() => {
        if (ripple && ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

// ===== ANIMATION UTILITIES =====
/**
 * Adds fade-in animation to an element with customizable duration
 * @param {Element} element - The DOM element to animate
 * @param {number} duration - Animation duration in milliseconds
 * @returns {Promise} - Resolves when animation completes
 */
function fadeIn(element, duration = 300) {
    return new Promise(resolve => {
        if (!element) {
            resolve();
            return;
        }
        
        element.style.opacity = 0;
        element.style.display = 'block';
        element.style.transition = `opacity ${duration}ms ease`;
        
        // Trigger reflow to ensure transition applies
        element.offsetHeight;
        
        element.style.opacity = 1;
        
        setTimeout(() => {
            resolve();
        }, duration);
    });
}

/**
 * Adds fade-out animation to an element with customizable duration
 * @param {Element} element - The DOM element to animate
 * @param {number} duration - Animation duration in milliseconds
 * @returns {Promise} - Resolves when animation completes
 */
function fadeOut(element, duration = 300) {
    return new Promise(resolve => {
        if (!element) {
            resolve();
            return;
        }
        
        element.style.opacity = 1;
        element.style.transition = `opacity ${duration}ms ease`;
        
        // Trigger reflow to ensure transition applies
        element.offsetHeight;
        
        element.style.opacity = 0;
        
        setTimeout(() => {
            element.style.display = 'none';
            resolve();
        }, duration);
    });
}

/**
 * Adds slide-in animation to an element
 * @param {Element} element - The DOM element to animate
 * @param {number} duration - Animation duration in milliseconds
 * @param {number} distance - Distance to slide in pixels
 * @returns {Promise} - Resolves when animation completes
 */
function slideIn(element, duration = 300, distance = 20) {
    return new Promise(resolve => {
        if (!element) {
            resolve();
            return;
        }
        
        element.style.opacity = 0;
        element.style.transform = `translateY(${distance}px)`;
        element.style.display = 'block';
        element.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
        
        // Trigger reflow to ensure transition applies
        element.offsetHeight;
        
        element.style.transform = 'translateY(0)';
        element.style.opacity = 1;
        
        setTimeout(() => {
            resolve();
        }, duration);
    });
}

/**
 * Adds pop/scale animation to an element
 * @param {Element} element - The DOM element to animate
 * @param {number} duration - Animation duration in milliseconds
 * @param {number} scale - Scale factor (1 = original size)
 * @returns {Promise} - Resolves when animation completes
 */
function popIn(element, duration = 300, scale = 1.05) {
    return new Promise(resolve => {
        if (!element) {
            resolve();
            return;
        }
        
        element.style.transform = 'scale(0.95)';
        element.style.transition = `transform ${duration/2}ms ease`;
        element.style.transform = `scale(${scale})`;
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
            
            setTimeout(() => {
                resolve();
            }, duration/2);
        }, duration/2);
    });
}

// ===== EVENT LISTENERS =====

// Initialize event listeners when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize app
    initializeApp();
    
    // Main Actions
    DOM.toggleViewButton?.addEventListener('click', toggleView);
    DOM.calculateButton?.addEventListener('click', calculateSettlements);
    DOM.addContainerButton?.addEventListener('click', showAddContainerModal);
    
    // Container Modal
    DOM.saveContainerButton?.addEventListener('click', addContainer);
    DOM.cancelAddContainerButton?.addEventListener('click', hideAddContainerModal);
    
    // Add Item Buttons - Use event delegation for dynamically added elements
    document.addEventListener('click', (e) => {
        // Find closest add-item-button if clicked inside one
        const addItemButton = e.target.closest('.add-item-button');
        if (addItemButton) {
            APP_STATE.setCurrentContainer(addItemButton.getAttribute('data-container'));
            showAddItemModal();
        }
        
        // Edit button delegation
        const editButton = e.target.closest('.btn-action--edit');
        if (editButton) {
            APP_STATE.setCurrentItemId(editButton.getAttribute('data-id'));
            showEditItemModal(APP_STATE.currentItemId);
        }
        
        // Delete button delegation
        const deleteButton = e.target.closest('.btn-action--delete');
        if (deleteButton) {
            const itemId = deleteButton.getAttribute('data-id');
            deleteItem(itemId);
        }
    });
    
    // Add Item Modal
    DOM.saveItemButton?.addEventListener('click', addItem);
    DOM.cancelAddButton?.addEventListener('click', hideAddItemModal);
    
    // Form keyboard shortcuts
    [
        DOM.itemName, DOM.itemPrice, DOM.itemPerson,
        DOM.editItemName, DOM.editItemPrice, DOM.editItemPerson,
        DOM.containerTitle
    ].forEach(input => {
        if (input) {
            input.addEventListener('keydown', handleFormKeyPress);
        }
    });
    
    // Price input validation for numeric values only
    [DOM.itemPrice, DOM.editItemPrice].forEach(priceInput => {
        if (priceInput) {
            // Format on blur
            priceInput.addEventListener('blur', function() {
                if (this.value) {
                    // Remove non-numeric characters except decimal point
                    let value = this.value.replace(/[^0-9.]/g, '');
                    
                    // Ensure only one decimal point
                    const parts = value.split('.');
                    if (parts.length > 2) {
                        value = parts[0] + '.' + parts.slice(1).join('');
                    }
                    
                    // Limit to 2 decimal places
                    if (parts.length > 1 && parts[1].length > 2) {
                        value = parts[0] + '.' + parts[1].substring(0, 2);
                    }
                    
                    // Remove leading zeros (except for decimal values < 1)
                    if (!value.startsWith('0.')) {
                        value = value.replace(/^0+/, '') || '0';
                    }
                    
                    this.value = value;
                }
            });
            
            // Prevent invalid input during typing
            priceInput.addEventListener('input', function() {
                // Allow only numbers and decimal point
                const regex = /^[0-9]*\.?[0-9]*$/;
                if (this.value && !regex.test(this.value)) {
                    // Keep only valid characters
                    this.value = this.value.replace(/[^0-9.]/g, '');
                }
                
                // Visual feedback on valid/invalid input
                if (this.value && regex.test(this.value)) {
                    this.style.borderColor = '#10b981'; // Green for valid input
                } else if (this.value) {
                    this.style.borderColor = '#ef4444'; // Red for invalid input
                } else {
                    this.style.borderColor = '#e5e7eb'; // Default border for empty
                }
            });
        }
    });
    
    // Edit Item Modal
    DOM.updateItemButton?.addEventListener('click', updateItem);
    DOM.cancelEditButton?.addEventListener('click', hideEditItemModal);
    
    // Icon Selector
    if (DOM.iconSelector) {
        DOM.iconSelector.addEventListener('click', (e) => {
            const iconOption = e.target.closest('.icon-option');
            if (iconOption) {
                // Remove active class from all options
                DOM.iconSelector.querySelectorAll('.icon-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                
                // Add active class to selected option
                iconOption.classList.add('active');
                
                // Set the selected icon
                APP_STATE.setSelectedIcon(iconOption.getAttribute('data-icon'));
            }
        });
    }
    
    // Global keyboard shortcuts for modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (DOM.addItemModal?.style.display === 'flex') hideAddItemModal();
            if (DOM.editItemModal?.style.display === 'flex') hideEditItemModal();
            if (DOM.addContainerModal?.style.display === 'flex') hideAddContainerModal();
            if (DOM.peopleListModal?.style.display === 'flex') closePeopleListModal();
        }
    });
    
    // Close modals when clicking outside content - use event delegation
    document.addEventListener('click', (e) => {
        if (e.target === DOM.addItemModal) hideAddItemModal();
        if (e.target === DOM.editItemModal) hideEditItemModal();
        if (e.target === DOM.addContainerModal) hideAddContainerModal();
        if (e.target === DOM.peopleListModal) closePeopleListModal();
    });
    
    // People functionality
    DOM.addPersonButton?.addEventListener('click', addPersonToList);
    DOM.newPersonName?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addPersonToList();
        }
    });
    
    // Add focus and input events to show suggestions for people
    DOM.newPersonName?.addEventListener('focus', () => {
        updatePersonSuggestions();
    });
    
    DOM.newPersonName?.addEventListener('input', () => {
        updatePersonSuggestions();
    });
    
    // Quick add common people
    DOM.quickAddPeopleBtn?.addEventListener('click', quickAddPeople);
    
    // Add person to container functionality
    DOM.addPersonToContainerBtn?.addEventListener('click', () => {
        addPersonToCurrentContainer();
    });
    
    DOM.addPersonToContainer?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addPersonToCurrentContainer();
        }
    });
    
    DOM.closePeopleListButton?.addEventListener('click', closePeopleListModal);
    
    // Initialize the app
    initializeApp();
});

/**
 * Initialize all people indicators with event listeners
 */
function initPeopleIndicators() {
    // Find all existing people indicators
    const peopleIndicators = document.querySelectorAll('.people-indicator');
    
    // Add event listeners to all people indicators
    peopleIndicators.forEach(indicator => {
        // Skip if already initialized
        if (indicator.getAttribute('data-initialized') === 'true') return;
        
        indicator.setAttribute('data-initialized', 'true');
        indicator.addEventListener('click', handlePeopleIndicatorClick);
    });
    
    console.log('People indicators initialized:', peopleIndicators.length);
}

/**
 * Initialize the application
 */
function initializeApp() {
    if (APP_STATE.isInitialized) return;
    
    console.log('Initializing application...');
    
    try {
        // Show the settlement indicator for Cafeteria
        updateSettlementIndicator('cafeteria', true);
        
        // Add click listeners to all settlement indicators
        document.querySelectorAll('.settlement-indicator').forEach(indicator => {
            indicator.addEventListener('click', function() {
                const containerId = this.getAttribute('data-container');
                showSettlementDetails(containerId);
            });
        });
        
        // Initialize people indicators with direct onclick attributes
        initPeopleIndicators();
        
        // Update people counts
        updateAllPeopleCounts();
        
        // Initialize settlement indicators
        initializeSettlementIndicators();
        
        // Show welcome message with delay
        setTimeout(() => {
            showToast('Welcome to Expense Tracker!', 'info');
            
            // Demo animation for cafeteria container's settlement status
            demoSettlementAnimation();
        }, 1000);
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Error initializing app:', error);
        showToast('There was an error initializing the app. Please refresh.', 'error');
    }
    
    APP_STATE.isInitialized = true;
}

/**
 * Demo animation for settlements
 */
function demoSettlementAnimation() {
    // Cafeteria is already marked as settled in the initial state
    // Let's showcase the animation
    const cafeteriaContainer = document.querySelector('.expense-container[data-id="cafeteria"]');
    if (!cafeteriaContainer) return;
    
    const settlementIndicator = cafeteriaContainer.querySelector('.settlement-indicator');
    if (!settlementIndicator) return;
    
    // First reset the indicator to ensure animation runs fresh
    settlementIndicator.classList.remove('active');
    settlementIndicator.style.display = 'none';
    
    // Remove any existing confetti elements
    const existingConfetti = settlementIndicator.querySelectorAll('.confetti');
    existingConfetti.forEach(el => el.remove());
    
    // Add a slight delay then trigger the animation
    setTimeout(() => {
        toggleSettlementIndicator('cafeteria', true);
        updateContainerSettlementStatus('cafeteria', true);
        
        // Show a toast message explaining what's happening
        setTimeout(() => {
            showToast('The Cafeteria container is marked as settled! Click on the scales icon to see details.', 'success', 5000);
        }, 500);
    }, 1500);
}

/**
 * Handle click on people indicator
 * @param {Event} e - Click event
 */
function handlePeopleIndicatorClick(e) {
    e.preventDefault();
    const containerId = this.getAttribute('data-container');
    console.log('People indicator clicked for container:', containerId);
    
    // Add ripple effect
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.classList.add('ripple-effect');
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    this.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
    
    // Determine which type of people viewer to show
    if (typeof window.showPeople === 'function') {
        window.showPeople(containerId);
    } else {
        showPeopleListModal(containerId);
    }
}

/**
 * Toggle between Expenses and Settlements views with animation
 */
function toggleView() {
    const isShowingSettlements = DOM.containersView.style.display === 'none';
    
    if (isShowingSettlements) {
        // Switch to Expenses view with animation
        DOM.settlementsView.style.opacity = 1;
        DOM.settlementsView.style.transition = 'opacity 0.3s ease-out';
        DOM.settlementsView.style.opacity = 0;
        
        setTimeout(() => {
            DOM.settlementsView.style.display = 'none';
            DOM.containersView.style.display = 'grid';
            DOM.containersView.style.opacity = 0;
            DOM.containersView.style.transition = 'opacity 0.3s ease-in';
            
            setTimeout(() => {
                DOM.containersView.style.opacity = 1;
            }, 50);
            
            DOM.toggleViewButton.innerHTML = '<i class="fas fa-exchange-alt"></i><span>Show Settlements</span>';
        }, 300);
    } else {
        // Switch to Settlements view with animation
        DOM.containersView.style.opacity = 1;
        DOM.containersView.style.transition = 'opacity 0.3s ease-out';
        DOM.containersView.style.opacity = 0;
        
        setTimeout(() => {
            DOM.containersView.style.display = 'none';
            DOM.settlementsView.style.display = 'grid';
            DOM.settlementsView.style.opacity = 0;
            DOM.settlementsView.style.transition = 'opacity 0.3s ease-in';
            
            setTimeout(() => {
                DOM.settlementsView.style.opacity = 1;
            }, 50);
            
            DOM.toggleViewButton.innerHTML = '<i class="fas fa-exchange-alt"></i><span>Show Expenses</span>';
        }, 300);
    }
}

/**
 * Handle keyboard shortcuts in forms
 */
function handleFormKeyPress(e) {
    // Enter key submits the form
    if (e.key === 'Enter') {
        e.preventDefault();
        
        // Determine which form we're in and submit it
        if (DOM.addItemModal.style.display === 'flex') {
            DOM.saveItemButton.click();
        } else if (DOM.editItemModal.style.display === 'flex') {
            DOM.updateItemButton.click();
        } else if (DOM.addContainerModal.style.display === 'flex') {
            DOM.saveContainerButton.click();
        }
    }
}

/**
 * Show the Add Item modal with animation
 */
function showAddItemModal() {
    // Reset validation styles
    resetInputStyles([DOM.itemName, DOM.itemPrice, DOM.itemPerson]);
    
    showModal(DOM.addItemModal, DOM.itemName);
    
    // Setup person field autocomplete with existing people
    setupPersonAutocomplete(DOM.itemPerson);
}

/**
 * Setup person input with autocomplete functionality
 * @param {HTMLElement} inputElement - The input element to enhance
 */
function setupPersonAutocomplete(inputElement) {
    if (!inputElement) return;
    
    // Create or get the suggestions container
    let suggestionsContainer = document.getElementById('personSuggestions');
    if (!suggestionsContainer) {
        suggestionsContainer = document.createElement('div');
        suggestionsContainer.id = 'personSuggestions';
        suggestionsContainer.className = 'person-suggestions';
        suggestionsContainer.style.position = 'absolute';
        suggestionsContainer.style.zIndex = '1000';
        suggestionsContainer.style.background = 'white';
        suggestionsContainer.style.border = '1px solid #e5e7eb';
        suggestionsContainer.style.borderRadius = '0.5rem';
        suggestionsContainer.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        suggestionsContainer.style.width = '100%';
        suggestionsContainer.style.maxHeight = '200px';
        suggestionsContainer.style.overflowY = 'auto';
        suggestionsContainer.style.display = 'none';
        document.body.appendChild(suggestionsContainer);
    }
    
    // Position the suggestions container below the input
    function positionSuggestions() {
        const rect = inputElement.getBoundingClientRect();
        suggestionsContainer.style.top = `${rect.bottom + window.scrollY}px`;
        suggestionsContainer.style.left = `${rect.left + window.scrollX}px`;
        suggestionsContainer.style.width = `${rect.width}px`;
    }
    
    // Update suggestions based on input value
    function updateSuggestions() {
        const value = inputElement.value.toLowerCase();
        
        // Get all unique people from all containers
        const allPeople = getAllUniquePeople();
        
        // Filter people based on input
        const filteredPeople = allPeople.filter(person => 
            person.toLowerCase().includes(value)
        );
        
        // Don't show suggestions if input is empty or no matches
        if (value === '' || filteredPeople.length === 0) {
            suggestionsContainer.style.display = 'none';
            return;
        }
        
        // Update and show suggestions
        suggestionsContainer.innerHTML = '';
        filteredPeople.forEach(person => {
            const div = document.createElement('div');
            div.className = 'person-suggestion-item';
            div.textContent = person;
            div.style.padding = '8px 12px';
            div.style.cursor = 'pointer';
            div.style.transition = 'background-color 0.2s ease';
            
            div.addEventListener('mouseenter', () => {
                div.style.backgroundColor = 'rgba(30, 133, 85, 0.1)';
            });
            
            div.addEventListener('mouseleave', () => {
                div.style.backgroundColor = 'transparent';
            });
            
            div.addEventListener('click', () => {
                inputElement.value = person;
                suggestionsContainer.style.display = 'none';
            });
            
            suggestionsContainer.appendChild(div);
        });
        
        positionSuggestions();
        suggestionsContainer.style.display = 'block';
    }
    
    // Add event listeners
    inputElement.addEventListener('focus', () => {
        updateSuggestions();
    });
    
    inputElement.addEventListener('input', () => {
        updateSuggestions();
    });
    
    inputElement.addEventListener('blur', () => {
        // Delay hiding to allow for clicks on suggestions
        setTimeout(() => {
            suggestionsContainer.style.display = 'none';
        }, 200);
    });
    
    // Handle keyboard navigation within suggestions
    inputElement.addEventListener('keydown', (e) => {
        const items = suggestionsContainer.querySelectorAll('.person-suggestion-item');
        if (items.length === 0) return;
        
        // Find currently highlighted item
        const current = suggestionsContainer.querySelector('.person-suggestion-item.highlighted');
        let index = -1;
        
        if (current) {
            items.forEach((item, i) => {
                if (item === current) index = i;
            });
            current.classList.remove('highlighted');
            current.style.backgroundColor = 'transparent';
        }
        
        // Arrow down
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            index = (index + 1) % items.length;
            items[index].classList.add('highlighted');
            items[index].style.backgroundColor = 'rgba(30, 133, 85, 0.1)';
            items[index].scrollIntoView({ block: 'nearest' });
        }
        // Arrow up
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            index = index <= 0 ? items.length - 1 : index - 1;
            items[index].classList.add('highlighted');
            items[index].style.backgroundColor = 'rgba(30, 133, 85, 0.1)';
            items[index].scrollIntoView({ block: 'nearest' });
        }
        // Enter key to select
        else if (e.key === 'Enter' && index >= 0) {
            e.preventDefault();
            inputElement.value = items[index].textContent;
            suggestionsContainer.style.display = 'none';
        }
    });
    
    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!inputElement.contains(e.target) && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.style.display = 'none';
        }
    });
}

/**
 * Hide the Add Item modal with animation
 */
function hideAddItemModal() {
    hideModal(DOM.addItemModal);
    
    // Clear form data
    DOM.itemName.value = '';
    DOM.itemPrice.value = '';
    DOM.itemPerson.value = '';
    resetInputStyles([DOM.itemName, DOM.itemPrice, DOM.itemPerson]);
}

/**
 * Reset the styling of input fields
 * @param {Array} inputs - Array of input elements to reset
 */
function resetInputStyles(inputs) {
    if (!inputs || !Array.isArray(inputs)) return;
    
    inputs.forEach(input => {
        if (input) {
            input.style.borderColor = '#e5e7eb'; // Default border color
            
            // Remove any error classes
            input.classList.remove('input-error');
            
            // Remove any existing error message
            const errorElement = input.parentElement.querySelector('.input-error-message');
            if (errorElement) {
                errorElement.remove();
            }
        }
    });
}

/**
 * Validate form inputs and show inline errors
 * @param {Array} fields - Array of {input, name, validator} objects
 * @returns {boolean} True if all fields are valid
 */
function validateFormInputs(fields) {
    if (!fields || !Array.isArray(fields)) return false;
    
    let isValid = true;
    
    fields.forEach(field => {
        const { input, name, validator } = field;
        if (!input) return;
        
        // Remove any existing error message
        const errorElement = input.parentElement.querySelector('.input-error-message');
        if (errorElement) {
            errorElement.remove();
        }
        
        // Reset input style
        input.style.borderColor = '#e5e7eb';
        input.classList.remove('input-error');
        
        // Check if empty
        if (!input.value.trim()) {
            isValid = false;
            showInputError(input, `Please enter ${name}`);
            return;
        }
        
        // If a validator function is provided, use it
        if (validator && typeof validator === 'function') {
            const validationResult = validator(input.value);
            if (validationResult !== true) {
                isValid = false;
                showInputError(input, validationResult);
            }
        }
    });
    
    return isValid;
}

/**
 * Show an error message below an input field
 * @param {HTMLElement} input - The input element
 * @param {string} message - The error message
 */
function showInputError(input, message) {
    if (!input || !message) return;
    
    // Add error styling to input
    input.style.borderColor = '#ef4444'; // Red for errors
    input.classList.add('input-error');
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'input-error-message';
    errorElement.style.color = '#ef4444';
    errorElement.style.fontSize = '0.75rem';
    errorElement.style.marginTop = '0.25rem';
    errorElement.style.animation = 'fadeIn 0.3s ease forwards';
    errorElement.innerHTML = `<i class="fas fa-exclamation-circle mr-1"></i>${message}`;
    
    // Add error message after the input's parent (the relative container)
    input.parentElement.appendChild(errorElement);
}

/**
 * Show the Edit Item modal and populate with item data
 * @param {string} itemId - The ID of the item to edit
 */
function showEditItemModal(itemId) {
    const itemCard = document.querySelector(`.expense-item[data-id="${itemId}"]`);
    const name = itemCard.querySelector('.font-medium').textContent;
    const price = itemCard.querySelector('.expense-item__price').textContent.replace(/[^0-9]/g, '');
    const person = itemCard.querySelector('.badge--person').textContent.trim();
    
    // Populate form with current values
    DOM.editItemName.value = name;
    DOM.editItemPrice.value = price;
    DOM.editItemPerson.value = person;
    
    // Show modal with animation
    DOM.editItemModal.style.display = 'flex';
    
    setTimeout(() => {
        DOM.editItemModal.classList.add('active');
    }, 10);
    
    // Focus on first field
    DOM.editItemName.focus();
    
    // Setup person autocomplete
    setupPersonAutocomplete(DOM.editItemPerson);
}

/**
 * Hide the Edit Item modal with animation
 */
function hideEditItemModal() {
    DOM.editItemModal.classList.remove('active');
    
    setTimeout(() => {
        DOM.editItemModal.style.display = 'none';
    }, 300);
}

/**
 * Show the Add Container modal with animation
 */
function showAddContainerModal() {
    DOM.addContainerModal.style.display = 'flex';
    
    setTimeout(() => {
        DOM.addContainerModal.classList.add('active');
    }, 10);
    
    // Reset form fields and icon selection
    DOM.containerTitle.value = '';
    
    // Reset icon selection
    if (DOM.iconSelector) {
        const iconOptions = DOM.iconSelector.querySelectorAll('.icon-option');
        iconOptions.forEach(opt => opt.classList.remove('active'));
        
        // Set default icon as active
        const defaultIcon = DOM.iconSelector.querySelector('.icon-option[data-icon="fas fa-utensils"]');
        if (defaultIcon) {
            defaultIcon.classList.add('active');
            APP_STATE.setSelectedIcon('fas fa-utensils');
        }
    }
    
    // Reset people list
    APP_STATE.clearPeopleTags();
    DOM.peopleList.innerHTML = '';
    DOM.peopleList.appendChild(DOM.noPeopleMessage);
    DOM.noPeopleMessage.style.display = 'block';
    DOM.newPersonName.value = '';
    
    // Initialize person suggestions
    setTimeout(() => {
        updatePersonSuggestions();
    }, 300);
    
    DOM.containerTitle.focus();
}

/**
 * Hide the Add Container modal with animation
 */
function hideAddContainerModal() {
    DOM.addContainerModal.classList.remove('active');
    
    setTimeout(() => {
        DOM.addContainerModal.style.display = 'none';
    }, 300);
}

/**
 * Add a new item to a container with animation
 */
function addItem() {
    // Validate inputs with more comprehensive validation
    const isValid = validateFormInputs([
        { 
            input: DOM.itemName, 
            name: 'item name' 
        },
        { 
            input: DOM.itemPrice, 
            name: 'price',
            validator: (value) => {
                // Check if it's a valid number
                const num = parseFloat(value);
                if (isNaN(num)) return 'Please enter a valid number';
                if (num <= 0) return 'Price must be greater than zero';
                return true;
            }
        },
        { 
            input: DOM.itemPerson, 
            name: 'person name' 
        }
    ]);
    
    if (isValid) {
        const container = document.querySelector(`.expense-container[data-id="${APP_STATE.currentContainer}"]`);
        const itemsContainer = container.querySelector('.expense-container__items');
        
        // Check for and remove the "No items yet" placeholder
        const emptyStatePlaceholder = itemsContainer.querySelector('.text-gray-400.text-center');
        if (emptyStatePlaceholder) {
            emptyStatePlaceholder.remove();
        }
        
        // Add the person to the container's people list if not already there
        if (!APP_STATE.containerPeople[APP_STATE.currentContainer]) {
            APP_STATE.containerPeople[APP_STATE.currentContainer] = [];
        }
        
        // Add person to container's people list
        if (!APP_STATE.containerPeople[APP_STATE.currentContainer].includes(DOM.itemPerson.value)) {
            APP_STATE.containerPeople[APP_STATE.currentContainer].push(DOM.itemPerson.value);
            // Update the people count
            updatePeopleCount(APP_STATE.currentContainer);
        }
        
        // Generate unique ID for the new item
        const newItemId = 'item' + Date.now();
        
        // Format price value for display
        const formattedPrice = formatPrice(DOM.itemPrice.value);
        
        // Create new item element
        const newItem = document.createElement('div');
        newItem.className = 'expense-item anim-bounce-in';
        newItem.setAttribute('data-id', newItemId);
        
        // Set item HTML with updated design
        newItem.innerHTML = `
            <div class="flex flex-col">
                <span class="font-medium">${DOM.itemName.value}</span>
                <div class="flex items-center gap-2 mt-1">
                    <span class="expense-item__price">₹${formattedPrice}</span>
                    <span class="badge badge--person">
                        <i class="fas fa-user mr-1"></i>
                        ${DOM.itemPerson.value}
                    </span>
                </div>
            </div>
            <div class="flex items-center">
                <button class="btn-action btn-action--edit" data-id="${newItemId}" title="Edit Item">
                    <i class="fas fa-edit text-blue-500"></i>
                </button>
                <button class="btn-action btn-action--delete" data-id="${newItemId}" title="Delete Item">
                    <i class="fas fa-trash text-red-500"></i>
                </button>
                <span class="text-gray-400 ml-1">
                    <i class="fas fa-chevron-right"></i>
                </span>
            </div>
        `;
        
        // Add item to container
        itemsContainer.appendChild(newItem);
        
        // Add event listeners to the new buttons
        const editButton = newItem.querySelector('.btn-action--edit');
        editButton.addEventListener('click', function() {
            APP_STATE.setCurrentItemId(this.getAttribute('data-id'));
            showEditItemModal(APP_STATE.currentItemId);
        });
        
        const deleteButton = newItem.querySelector('.btn-action--delete');
        deleteButton.addEventListener('click', function() {
            const itemId = this.getAttribute('data-id');
            deleteItem(itemId);
        });
        
        // Show success message
        showToast('Item added successfully!', 'success');
        
        // Close modal
        hideAddItemModal();
        
        // Scroll to the new item
        setTimeout(() => {
            newItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
}

/**
 * Format a price value for display
 * @param {string|number} price - The price to format
 * @returns {string} The formatted price
 */
function formatPrice(price) {
    if (!price) return '0';
    
    // Convert to number
    const num = parseFloat(price);
    if (isNaN(num)) return '0';
    
    // Format with 2 decimal places if needed
    if (Number.isInteger(num)) {
        return num.toString();
    } else {
        return num.toFixed(2).replace(/\.00$/, '');
    }
}

/**
 * Update an existing item with animation
 */
function updateItem() {
    // Validate input
    if (DOM.editItemName.value && DOM.editItemPrice.value && DOM.editItemPerson.value) {
        const itemCard = document.querySelector(`.expense-item[data-id="${APP_STATE.currentItemId}"]`);
        
        // Highlight card briefly
        itemCard.style.transition = 'background-color 0.5s ease';
        itemCard.style.backgroundColor = '#e9f5fe';
        
        setTimeout(() => {
            itemCard.style.backgroundColor = '';
        }, 800);
        
        // Update item data with new structure
        itemCard.querySelector('.font-medium').textContent = DOM.editItemName.value;
        itemCard.querySelector('.expense-item__price').innerHTML = `₹${DOM.editItemPrice.value}`;
        itemCard.querySelector('.badge--person').innerHTML = `<i class="fas fa-user mr-1"></i>${DOM.editItemPerson.value}`;
        
        // Show success message
        showToast('Item updated successfully!', 'success');
        
        // Close modal
        hideEditItemModal();
    } else {
        // Show validation error
        showToast('Please fill all fields', 'error');
    }
}

/**
 * Delete an item with animation
 * @param {string} itemId - The ID of the item to delete
 */
function deleteItem(itemId) {
    const confirmDelete = confirm('Are you sure you want to delete this item?');
    
    if (confirmDelete) {
        const itemCard = document.querySelector(`.expense-item[data-id="${itemId}"]`);
        const container = itemCard.closest('.expense-container');
        const itemsContainer = container.querySelector('.expense-container__items');
        
        // Animate removal
        itemCard.style.transition = 'all 0.3s ease';
        itemCard.style.opacity = '0';
        itemCard.style.transform = 'translateX(20px)';
        
        setTimeout(() => {
            itemCard.remove();
            
            // Check if this was the last item in the container
            const remainingItems = itemsContainer.querySelectorAll('.expense-item');
            if (remainingItems.length === 0) {
                // Add the empty state message back
                const emptyState = document.createElement('div');
                emptyState.className = 'text-gray-400 text-center py-6';
                emptyState.innerHTML = `
                    <i class="fas fa-receipt text-3xl mb-2"></i>
                    <p>No items yet. Add your first expense.</p>
                `;
                itemsContainer.appendChild(emptyState);
            }
            
            showToast('Item deleted', 'info');
        }, 300);
    }
}

/**
 * Add a new container with animation
 */
function addContainer() {
    if (DOM.containerTitle.value) {
        // Create ID from title
        const containerId = DOM.containerTitle.value.toLowerCase().replace(/\s+/g, '-');
        
        // Create new container element with animation classes
        const newContainer = document.createElement('div');
        newContainer.className = 'expense-container anim-slide-in';
        newContainer.setAttribute('data-id', containerId);
        
        // Use the selected icon from the icon selector
        // If none selected, default to 'fas fa-utensils'
        const iconClass = APP_STATE.selectedIcon || 'fas fa-utensils';
        const iconColor = getIconColor(iconClass);
        
        // Generate people tooltip content
        let peopleTooltip = '';
        let peopleCount = APP_STATE.peopleTags.length;
        
        if (peopleCount > 0) {
            // Create a tooltip with people's names
            const peopleList = APP_STATE.peopleTags.join(', ');
            peopleTooltip = `data-tooltip="People: ${peopleList}"`;
        } else {
            peopleTooltip = `data-tooltip="No people added"`;
            peopleCount = 0;
        }
        
        // Set container HTML with improved design and selected icon, but without the scales icon initially
        newContainer.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-medium flex items-center gap-2">
                    <i class="${iconClass} ${iconColor}"></i>
                    ${DOM.containerTitle.value}
                </h2>
                <div class="flex items-center gap-2">
                    <button class="settlement-indicator tooltip" data-tooltip="Payment Settled" data-container="${containerId}" style="display: none;">
                        <i class="fas fa-balance-scale"></i>
                        <div class="confetti"></div>
                        <div class="confetti"></div>
                        <div class="confetti"></div>
                        <div class="confetti"></div>
                        <div class="confetti"></div>
                        <div class="confetti"></div>
                    </button>
                    <button class="people-indicator tooltip" data-tooltip="View and manage people" data-container="${containerId}" id="${containerId}PeopleBtn" aria-label="View people in ${DOM.containerTitle.value}">
                        <i class="fas fa-users"></i>
                        <div class="people-count">${peopleCount}</div>
                    </button>
                    <div class="btn-add add-item-button" data-container="${containerId}" title="Add Item">
                        <i class="fas fa-plus"></i>
                    </div>
                </div>
            </div>
            <div class="expense-container__items">
                <!-- Items will be added here -->
                <div class="text-gray-400 text-center py-6">
                    <i class="fas fa-receipt text-3xl mb-2"></i>
                    <p>No items yet. Add your first expense.</p>
                </div>
            </div>
        `;
        
        // Insert before the add container button
        DOM.containersView.insertBefore(newContainer, DOM.addContainerButton);
        
        // Initialize the data for the inline script
        if (!window.containersData) {
            window.containersData = {};
        }
        
        // Create data for this container in the containersData object
        window.containersData[containerId] = {
            name: DOM.containerTitle.value,
            people: APP_STATE.peopleTags.map(name => ({name, amount: 0}))
        };
        
        // Add event listener to the new people button for direct popup
        const peopleBtn = document.getElementById(`${containerId}PeopleBtn`);
        if (peopleBtn) {
            peopleBtn.addEventListener('click', function() {
                showPeople(containerId);
            });
        }
        
        // Add event listener to the new add item button
        const addItemButton = newContainer.querySelector('.add-item-button');
        addItemButton.addEventListener('click', function() {
            APP_STATE.setCurrentContainer(this.getAttribute('data-container'));
            showAddItemModal();
        });
        
        // Add event listener to the settlement indicator
        const settlementIndicator = newContainer.querySelector('.settlement-indicator');
        settlementIndicator.addEventListener('click', function() {
            const containerId = this.getAttribute('data-container');
            showSettlementDetails(containerId);
        });
        
        // Add event listener to the people indicator with enhanced click animation
        const peopleIndicator = newContainer.querySelector('.people-indicator');
        peopleIndicator.addEventListener('click', function() {
            const containerId = this.getAttribute('data-container');
            
            // Add a click animation
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            showPeople(containerId);
        });
        
        // Save the people list to the container
        if (APP_STATE.peopleTags.length > 0) {
            APP_STATE.containerPeople[containerId] = [...APP_STATE.peopleTags];
        } else {
            APP_STATE.containerPeople[containerId] = [];
        }
        
        // Show success message
        showToast(`"${DOM.containerTitle.value}" journey started!`, 'success');
        
        // Close modal
        hideAddContainerModal();
        
        // Reset people tags array
        APP_STATE.clearPeopleTags();
        
        // Scroll to the new container
        setTimeout(() => {
            newContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    } else {
        // Show validation error
        showToast('Please enter a container name', 'error');
    }
}

/**
 * Get an appropriate color class for an icon based on icon type
 * @param {string} iconClass - The Font Awesome icon class
 * @returns {string} The color class for the icon
 */
function getIconColor(iconClass) {
    // Map of icon types to color classes
    const iconColors = {
        'fa-utensils': 'text-yellow-600',
        'fa-coffee': 'text-yellow-800',
        'fa-plane': 'text-blue-500',
        'fa-car': 'text-red-500',
        'fa-film': 'text-purple-600',
        'fa-shopping-cart': 'text-green-500',
        'fa-home': 'text-gray-700',
        'fa-gift': 'text-pink-500',
        'fa-gamepad': 'text-indigo-500',
        'fa-graduation-cap': 'text-blue-700',
        'fa-mountain': 'text-green-600',
        'fa-book': 'text-yellow-500',
        'fa-tshirt': 'text-blue-400',
        'fa-bus': 'text-gray-600',
        'fa-pizza-slice': 'text-red-600',
        'fa-box': 'text-gray-700',
        'fa-shopping-bag': 'text-green-400',
        'fa-suitcase': 'text-blue-800',
        'fa-store': 'text-purple-500',
        'fa-hotel': 'text-pink-700'
    };
    
    // Find which icon we're using from the iconClass parameter
    for (const key in iconColors) {
        if (iconClass.includes(key)) {
            return iconColors[key];
        }
    }
    
    // Default color if no match
    return 'text-primary';
}

/**
 * Get all expense items from the page
 * @returns {Array} Array of expense objects
 */
function getAllExpenses() {
    const expenses = [];
    const expenseItems = document.querySelectorAll('.expense-item:not([style*="display: none"])');
    
    expenseItems.forEach(item => {
        const name = item.querySelector('.font-medium').textContent;
        const priceText = item.querySelector('.expense-item__price').textContent;
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        const personText = item.querySelector('.badge--person').textContent.trim();
        const person = personText.replace(/\s+/g, ' ').trim();
        const container = item.closest('.expense-container').getAttribute('data-id');
        
        if (!isNaN(price) && person) {
            expenses.push({
                name: name,
                price: price,
                person: person,
                container: container
            });
        }
    });
    
    return expenses;
}

/**
 * Calculate settlements based on expenses
 */
function calculateSettlements() {
    // Show calculating animation
    showToast('Calculating settlements...', 'info');
    
    // Get all expenses
    const expenses = getAllExpenses();
    
    if (expenses.length === 0) {
        showToast('No expenses found to calculate settlements', 'error');
        return;
    }
    
    // Calculate total spent by each person
    const personExpenses = {};
    let totalExpense = 0;
    
    // Track which containers were involved in this calculation
    const involvedContainers = new Set();
    
    expenses.forEach(expense => {
        const person = expense.person;
        if (!personExpenses[person]) {
            personExpenses[person] = 0;
        }
        personExpenses[person] += expense.price;
        totalExpense += expense.price;
        
        // Track container
        if (expense.container) {
            involvedContainers.add(expense.container);
        }
    });
    
    // Get unique persons
    const persons = Object.keys(personExpenses);
    const personCount = persons.length;
    
    if (personCount === 0) {
        showToast('No valid persons found in expenses', 'error');
        return;
    }
    
    // Calculate fair share per person
    const fairShare = totalExpense / personCount;
    
    // Calculate how much each person owes or is owed
    const balances = {};
    persons.forEach(person => {
        balances[person] = personExpenses[person] - fairShare;
    });
    
    // Create the settlement transactions
    const settlements = [];
    const debtors = persons.filter(person => balances[person] < 0)
        .sort((a, b) => balances[a] - balances[b]);
    const creditors = persons.filter(person => balances[person] > 0)
        .sort((a, b) => balances[b] - balances[a]);
    
    // Calculate settlements
    let debtorIndex = 0;
    let creditorIndex = 0;
    
    while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
        const debtor = debtors[debtorIndex];
        const creditor = creditors[creditorIndex];
        
        const debtorOwes = Math.abs(balances[debtor]);
        const creditorIsOwed = balances[creditor];
        
        const amount = Math.min(debtorOwes, creditorIsOwed);
        
        if (amount > 0) {
            settlements.push({
                from: debtor,
                to: creditor,
                amount: Math.round(amount * 100) / 100
            });
        }
        
        balances[debtor] += amount;
        balances[creditor] -= amount;
        
        if (Math.abs(balances[debtor]) < 0.01) {
            debtorIndex++;
        }
        if (Math.abs(balances[creditor]) < 0.01) {
            creditorIndex++;
        }
    }
    
    // Mark containers as settled and update UI
    involvedContainers.forEach(containerId => {
        APP_STATE.settledContainers.add(containerId);
        updateSettlementIndicator(containerId, true);
    });
    
    // Update the UI with settlements
    updateSettlementsView(settlements, {
        totalExpense,
        personCount,
        perPersonExpense: fairShare,
        expenseCount: expenses.length
    });
    
    // Switch to settlements view with animation
    toggleView();
    
    // Show success message
    showToast('Settlements calculated successfully!', 'success');
}

/**
 * Update the settlements view with calculated data
 * @param {Array} settlements - Array of settlement objects
 * @param {Object} summary - Summary data
 */
function updateSettlementsView(settlements, summary) {
    // Get the settlements container
    const settlementsContainer = document.getElementById('settlementsView');
    
    // Clear previous settlements excluding the header
    const header = settlementsContainer.querySelector('.flex.justify-between');
    const summaryCard = settlementsContainer.querySelector('.expense-container.bg-blue-50');
    
    // Clear all child elements except the header and summary card
    while (settlementsContainer.childElementCount > 2) {
        const child = settlementsContainer.children[1];
        if (child !== header && child !== summaryCard) {
            settlementsContainer.removeChild(child);
        }
    }
    
    // Add settlement items
    settlements.forEach((settlement, index) => {
        const settlementItem = document.createElement('div');
        settlementItem.className = 'expense-item anim-bounce-in';
        settlementItem.style.animationDelay = `${0.1 + index * 0.1}s`;
        
        settlementItem.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="badge badge--person">
                    <i class="fas fa-user mr-1"></i>
                    ${settlement.from}
                </span>
                <span class="text-gray-500">
                    <i class="fas fa-arrow-right"></i>
                </span>
                <span class="badge badge--person">
                    <i class="fas fa-user mr-1"></i>
                    ${settlement.to}
                </span>
            </div>
            <div class="expense-item__price flex items-center">
                <i class="fas fa-rupee-sign mr-1"></i>
                <span>${settlement.amount.toFixed(2)}</span>
            </div>
        `;
        
        // Insert before the summary card
        settlementsContainer.insertBefore(settlementItem, summaryCard);
    });
    
    // Update summary data
    const totalSpentElement = summaryCard.querySelector('.text-primary');
    const peopleElement = summaryCard.querySelector('.text-purple-500');
    const perPersonElement = summaryCard.querySelector('.text-green-500');
    const expensesElement = summaryCard.querySelector('.text-yellow-500');
    
    if (totalSpentElement) totalSpentElement.textContent = `₹${summary.totalExpense.toFixed(2)}`;
    if (peopleElement) peopleElement.textContent = summary.personCount;
    if (perPersonElement) perPersonElement.textContent = `₹${summary.perPersonExpense.toFixed(2)}`;
    if (expensesElement) expensesElement.textContent = summary.expenseCount;
    
    // If no settlements, show a message
    if (settlements.length === 0) {
        const noSettlements = document.createElement('div');
        noSettlements.className = 'expense-item anim-bounce-in bg-gray-50';
        noSettlements.innerHTML = `
            <div class="w-full text-center py-6 text-gray-500">
                <i class="fas fa-check-circle text-green-500 text-2xl mb-2"></i>
                <p>All expenses are settled! Everyone has paid their fair share.</p>
            </div>
        `;
        
        // Insert before the summary card
        settlementsContainer.insertBefore(noSettlements, summaryCard);
    }
}

/**
 * Update the settlement indicator (scales icon) for a container
 * @param {string} containerId - ID of the container to update
 * @param {boolean} isSettled - Whether the container is settled
 */
function updateSettlementIndicator(containerId, isSettled) {
    const container = document.querySelector(`.expense-container[data-id="${containerId}"]`);
    if (container) {
        const indicator = container.querySelector('.settlement-indicator');
        if (indicator) {
            if (isSettled) {
                indicator.style.display = 'flex';
                // Add a subtle animation to draw attention
                indicator.classList.add('anim-bounce-in');
            } else {
                indicator.style.display = 'none';
                indicator.classList.remove('anim-bounce-in');
            }
        }
    }
}

/**
 * Show settlement details for a specific container
 * @param {string} containerId - ID of the container to show settlements for
 */
function showSettlementDetails(containerId) {
    if (!APP_STATE.settledContainers.has(containerId)) {
        return; // Not settled yet
    }
    
    // Filter expenses for this container only
    const allExpenses = getAllExpenses();
    const containerExpenses = allExpenses.filter(exp => exp.container === containerId);
    
    if (containerExpenses.length === 0) {
        showToast('No expenses found for this container', 'error');
        return;
    }
    
    // Get container name without the icon
    const containerElement = document.querySelector(`.expense-container[data-id="${containerId}"]`);
    if (!containerElement) return;
    
    const containerNameElement = containerElement.querySelector('h2');
    if (!containerNameElement) return;
    
    // Extract just the text without the icon
    const containerName = containerNameElement.textContent.trim();
    
    // Display details in a toast message
    showToast(`The "${containerName}" expenses are settled!`, 'success');
    
    // Show settlements view to display the details
    if (DOM.containersView.style.display !== 'none') {
        toggleView();
    }
}

/**
 * Update people count indicators for all containers
 */
function updateAllPeopleCounts() {
    for (const containerId in APP_STATE.containerPeople) {
        updatePeopleCount(containerId);
    }
}

/**
 * Update the people count indicator for a specific container
 * @param {string} containerId - ID of the container to update
 */
function updatePeopleCount(containerId) {
    const container = document.querySelector(`.expense-container[data-id="${containerId}"]`);
    if (container) {
        const peopleCount = container.querySelector('.people-count');
        if (peopleCount && APP_STATE.containerPeople[containerId]) {
            const uniquePeople = [...new Set(APP_STATE.containerPeople[containerId])];
            peopleCount.textContent = uniquePeople.length;
        }
    }
}

/**
 * Show the people list modal for a specific container
 * @param {string} containerId - ID of the container to show people for
 */
window.showPeopleListModal = function(containerId) {
    console.log('Showing people for container:', containerId);
    
    // Store current container ID for adding people
    window.currentPeopleContainer = containerId;
    
    // Get container name
    const container = document.querySelector(`.expense-container[data-id="${containerId}"]`);
    if (!container) {
        console.error('Container not found:', containerId);
        alert('Container not found: ' + containerId);
        return;
    }
    
    const containerNameEl = container.querySelector('h2');
    if (!containerNameEl) {
        console.error('Container name element not found');
        alert('Container name element not found');
        return;
    }
    
    // Get both text and icon from the container name
    const containerIcon = containerNameEl.querySelector('i').cloneNode(true);
    const containerName = containerNameEl.textContent.trim();
    
    // Set modal title with icon
    DOM.peopleListTitle.innerHTML = '';
    DOM.peopleListTitle.appendChild(containerIcon);
    DOM.peopleListTitle.appendChild(document.createTextNode(` People in ${containerName}`));
    
    // Clear previous items
    DOM.peopleListItems.innerHTML = '';
    
    // Get unique people for this container
    const people = APP_STATE.containerPeople[containerId] || [];
    const uniquePeople = [...new Set(people)];
    
    console.log('People in container:', uniquePeople);
    
    // Update the global containersData object for consistency with the inline popup
    if (window.containersData && containerId) {
        if (!window.containersData[containerId]) {
            window.containersData[containerId] = {
                name: containerName,
                people: []
            };
        }
        
        // Update people in containersData from our containerPeople object
        const allExpenses = getAllExpenses();
        const containerExpenses = allExpenses.filter(exp => exp.container === containerId);
        
        // Build the people array with their expenses
        window.containersData[containerId].people = uniquePeople.map(person => {
            const personExpenses = containerExpenses
                .filter(exp => exp.person === person)
                .reduce((sum, exp) => sum + exp.price, 0);
                
            return {
                name: person,
                amount: personExpenses
            };
        });
    }
    
    if (uniquePeople.length === 0) {
        DOM.peopleListItems.innerHTML = `
            <div class="text-gray-400 text-center py-6">
                <i class="fas fa-users text-gray-300 text-4xl mb-3"></i>
                <p>No people found in this journey</p>
                <button id="addFirstPersonBtn" class="btn btn--primary rounded-lg mt-4 mx-auto text-sm py-1 px-3">
                    <i class="fas fa-user-plus mr-1"></i>
                    Add Your First Person
                </button>
            </div>
        `;
        
        // Add event listener to the "Add Your First Person" button
        const addFirstPersonBtn = DOM.peopleListItems.querySelector('#addFirstPersonBtn');
        if (addFirstPersonBtn) {
            addFirstPersonBtn.addEventListener('click', function() {
                DOM.addPersonToContainer.focus();
            });
        }
        
        // Update summary
        DOM.peopleTotal.textContent = '0';
        DOM.totalExpenses.textContent = '₹0';
        DOM.avgExpense.textContent = '₹0';
    } else {
        // Get expenses for each person
        const allExpenses = getAllExpenses();
        const containerExpenses = allExpenses.filter(exp => exp.container === containerId);
        
        const personExpenses = {};
        uniquePeople.forEach(person => {
            personExpenses[person] = 0;
        });
        
        containerExpenses.forEach(expense => {
            if (personExpenses.hasOwnProperty(expense.person)) {
                personExpenses[expense.person] += expense.price;
            }
        });
        
        // Calculate total expenses
        const totalAmount = Object.values(personExpenses).reduce((sum, amount) => sum + amount, 0);
        const averageAmount = uniquePeople.length > 0 ? totalAmount / uniquePeople.length : 0;
        
        // Update summary
        DOM.peopleTotal.textContent = uniquePeople.length;
        DOM.totalExpenses.textContent = `₹${totalAmount.toFixed(0)}`;
        DOM.avgExpense.textContent = `₹${averageAmount.toFixed(0)}`;
        
        // Add people to the list
        uniquePeople.forEach((person, index) => {
            const amount = personExpenses[person] || 0;
            const personInitial = person.charAt(0).toUpperCase();
            
            // Generate a random pastel background color for the avatar based on the name
            const hue = (person.charCodeAt(0) * 5) % 360;
            const avatarColor = `hsl(${hue}, 70%, 65%)`;
            
            const personItem = document.createElement('div');
            personItem.className = 'people-list-item';
            personItem.style.animationDelay = `${index * 0.05}s`;
            personItem.innerHTML = `
                <div class="people-avatar" style="background-color: ${avatarColor};">${personInitial}</div>
                <div class="people-list-name">${person}</div>
                <div class="people-list-amount">₹${amount.toFixed(0)}</div>
                <button class="btn-action remove-person" data-person="${person}" title="Remove ${person}">
                    <i class="fas fa-times-circle text-red-500"></i>
                </button>
            `;
            
            DOM.peopleListItems.appendChild(personItem);
            
            // Add remove functionality
            const removeBtn = personItem.querySelector('.remove-person');
            removeBtn.addEventListener('click', function() {
                const personToRemove = this.getAttribute('data-person');
                
                // Ask for confirmation if the person has expenses
                const hasExpenses = amount > 0;
                if (hasExpenses) {
                    showToast(`Cannot remove ${personToRemove} because they have expenses in this group`, 'error');
                    return;
                }
                
                // Add slide-out animation
                personItem.style.transition = 'all 0.3s ease';
                personItem.style.transform = 'translateX(10px)';
                personItem.style.opacity = '0';
                
                setTimeout(() => {
                    removePersonFromContainer(containerId, personToRemove);
                }, 300);
            });
        });
    }
    
    // Reset add person input
    DOM.addPersonToContainer.value = '';
    
    // Show the modal
    DOM.peopleListModal.style.display = 'flex';
    
    // Focus on the add person input for convenience
    setTimeout(() => {
        DOM.addPersonToContainer.focus();
    }, 300);
}

/**
 * Close the people list modal
 */
function closePeopleListModal() {
    DOM.peopleListModal.style.display = 'none';
    window.currentPeopleContainer = null;
}

/**
 * Add a person to the current open container
 */
function addPersonToCurrentContainer() {
    const personName = DOM.addPersonToContainer.value.trim();
    const containerId = window.currentPeopleContainer;
    
    if (!personName || !containerId) {
        showToast('Please enter a valid person name', 'error');
        return;
    }
    
    // Check if the person is already in this container
    if (APP_STATE.containerPeople[containerId] && APP_STATE.containerPeople[containerId].includes(personName)) {
        // If already in list, flash the person's item in the list to indicate it exists
        const existingItem = Array.from(DOM.peopleListItems.querySelectorAll('.people-list-item')).find(
            item => item.querySelector('.people-list-name').textContent === personName
        );
        
        if (existingItem) {
            // Highlight the existing item briefly
            existingItem.style.transition = 'background-color 0.5s ease';
            existingItem.style.backgroundColor = '#fef3c7'; // Soft yellow highlight
            
            setTimeout(() => {
                existingItem.style.backgroundColor = '';
            }, 1500);
            
            // Scroll to the item
            existingItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        showToast(`${personName} is already in this group`, 'info');
        return;
    }
    
    // Add person to container
    if (!APP_STATE.containerPeople[containerId]) {
        APP_STATE.containerPeople[containerId] = [];
    }
    
    APP_STATE.containerPeople[containerId].push(personName);
    
    // Also update the containersData object for the inline popup
    if (window.containersData && window.containersData[containerId]) {
        // Check if person is already in the containersData
        const existing = window.containersData[containerId].people.find(p => p.name === personName);
        if (!existing) {
            window.containersData[containerId].people.push({
                name: personName,
                amount: 0
            });
        }
    }
    
    // Update UI with animation
    updatePeopleCount(containerId);
    
    // Clear the input field and keep focus on it
    DOM.addPersonToContainer.value = '';
    DOM.addPersonToContainer.focus();
    
    // Show success feedback
    showToast(`${personName} added to group`, 'success');
    
    // Refresh the people list with a nice transition
    const currentScrollPosition = DOM.peopleListItems.scrollTop;
    
    // Fade out the current list
    DOM.peopleListItems.style.transition = 'opacity 0.2s ease';
    DOM.peopleListItems.style.opacity = '0.5';
    
    // After a short delay, refresh the list and restore scroll position
    setTimeout(() => {
        showPeopleListModal(containerId);
        
        // Restore the scroll position
        setTimeout(() => {
            DOM.peopleListItems.scrollTop = currentScrollPosition;
        }, 100);
    }, 300);
}

/**
 * Remove a person from a container
 * @param {string} containerId - ID of the container
 * @param {string} personName - Name of the person to remove
 */
function removePersonFromContainer(containerId, personName) {
    if (!APP_STATE.containerPeople[containerId]) {
        showToast('Container not found', 'error');
        return;
    }
    
    // Check if this person has expenses in this container
    const allExpenses = getAllExpenses();
    const personExpensesInContainer = allExpenses.filter(
        exp => exp.container === containerId && exp.person === personName
    );
    
    if (personExpensesInContainer.length > 0) {
        showToast(`Cannot remove ${personName} because they have expenses in this group`, 'error');
        return;
    }
    
    // Remove person from container
    APP_STATE.containerPeople[containerId] = APP_STATE.containerPeople[containerId].filter(name => name !== personName);
    
    // Also update the containersData object for the inline popup
    if (window.containersData && window.containersData[containerId]) {
        window.containersData[containerId].people = window.containersData[containerId].people
            .filter(p => p.name !== personName);
    }
    
    // Update UI
    updatePeopleCount(containerId);
    showToast(`${personName} removed from group`, 'success');
    
    // Refresh the people list
    showPeopleListModal(containerId);
}

/**
 * Add a person to the list in the "Start a Journey" modal
 */
function addPersonToList() {
    const personName = DOM.newPersonName.value.trim();
    
    if (personName) {
        // Hide the "No people added yet" message
        DOM.noPeopleMessage.style.display = 'none';
        
        // Check if the person is already in the list
        if (APP_STATE.peopleTags.includes(personName)) {
            showToast('This person is already in the list', 'error');
            return;
        }
        
        // Add to the state
        APP_STATE.peopleTags.push(personName);
        
        // Get person initial for avatar
        const personInitial = personName.charAt(0).toUpperCase();
        
        // Generate a consistent color based on the person's name
        const hue = (personName.charCodeAt(0) * 5) % 360;
        const avatarColor = `hsl(${hue}, 70%, 65%)`;
        
        // Create and add the tag with enhanced design
        const personTag = document.createElement('div');
        personTag.className = 'person-tag';
        personTag.innerHTML = `
            <div class="person-tag-avatar" style="background-color: ${avatarColor};">${personInitial}</div>
            <span>${personName}</span>
            <button class="person-tag-remove" data-person="${personName}" title="Remove ${personName}">
                <i class="fas fa-times-circle"></i>
            </button>
        `;
        
        // Add remove functionality
        const removeButton = personTag.querySelector('.person-tag-remove');
        removeButton.addEventListener('click', function() {
            const personToRemove = this.getAttribute('data-person');
            APP_STATE.peopleTags = APP_STATE.peopleTags.filter(name => name !== personToRemove);
            
            // Add slide-out animation before removing
            personTag.style.transition = 'all 0.3s ease';
            personTag.style.transform = 'translateX(10px)';
            personTag.style.opacity = '0';
            
            setTimeout(() => {
                personTag.remove();
                
                // Show the "No people added yet" message if the list is empty
                if (APP_STATE.peopleTags.length === 0) {
                    DOM.noPeopleMessage.style.display = 'block';
                }
            }, 300);
        });
        
        DOM.peopleList.appendChild(personTag);
        
        // Clear the input
        DOM.newPersonName.value = '';
        DOM.newPersonName.focus();
        
        // Update suggestions
        updatePersonSuggestions();
    } else {
        showToast('Please enter a person name', 'error');
    }
}

/**
 * Get all unique people from all containers
 * @returns {Array} Array of unique person names
 */
function getAllUniquePeople() {
    const allPeople = new Set();
    
    // Add from existing containers in APP_STATE
    if (APP_STATE.containerPeople) {
        Object.values(APP_STATE.containerPeople).forEach(people => {
            people.forEach(person => allPeople.add(person));
        });
    }
    
    // Add from global containersData
    if (window.containersData) {
        Object.values(window.containersData).forEach(container => {
            if (container.people && Array.isArray(container.people)) {
                container.people.forEach(person => {
                    if (typeof person === 'object' && person.name) {
                        allPeople.add(person.name);
                    } else if (typeof person === 'string') {
                        allPeople.add(person);
                    }
                });
            }
        });
    }
    
    return [...allPeople];
}

/**
 * Create or update suggestions dropdown for person input
 */
function updatePersonSuggestions() {
    // Get all existing people from all containers
    const allPeople = getAllUniquePeople();
    
    // Remove existing suggestions container if it exists
    const existingSuggestions = document.getElementById('personSuggestions');
    if (existingSuggestions) {
        existingSuggestions.remove();
    }
    
    // Create suggestions container
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.id = 'personSuggestions';
    suggestionsContainer.className = 'suggestions-container';
    
    // Get current input value
    const currentInput = DOM.newPersonName.value.trim().toLowerCase();
    
    // Filter out people already in the current list and match current input
    const availablePeople = allPeople.filter(function(person) {
        return !APP_STATE.peopleTags.includes(person) && 
               (currentInput === '' || person.toLowerCase().includes(currentInput));
    });
    
    // Sort by relevance - exact matches first, then startsWith, then includes
    availablePeople.sort(function(a, b) {
        const aLower = a.toLowerCase();
        const bLower = b.toLowerCase();
        
        // Exact match first
        if (aLower === currentInput && bLower !== currentInput) return -1;
        if (bLower === currentInput && aLower !== currentInput) return 1;
        
        // Then starts with
        if (aLower.startsWith(currentInput) && !bLower.startsWith(currentInput)) return -1;
        if (bLower.startsWith(currentInput) && !aLower.startsWith(currentInput)) return 1;
        
        // Alphabetical for the rest
        return a.localeCompare(b);
    });
    
    // Only show if there are available people to suggest
    if (availablePeople.length === 0) {
        return;
    }
    
    // Add up to 5 people as suggestions
    availablePeople.slice(0, 5).forEach(function(person) {
        const personInitial = person.charAt(0).toUpperCase();
        const hue = (person.charCodeAt(0) * 5) % 360;
        const avatarColor = 'hsl(' + hue + ', 70%, 65%)';
        
        const suggestion = document.createElement('div');
        suggestion.className = 'person-suggestion';
        
        suggestion.innerHTML = 
            '<div class="person-tag-avatar" style="background-color: ' + avatarColor + ';">' + personInitial + '</div>' +
            '<span>' + person + '</span>';
        
        suggestion.addEventListener('click', function() {
            // Add this person to the list
            DOM.newPersonName.value = person;
            addPersonToList();
            suggestionsContainer.remove();
        });
        
        suggestionsContainer.appendChild(suggestion);
    });
    
    // If there are more than 5 people, add a "more" option
    if (availablePeople.length > 5) {
        const moreOption = document.createElement('div');
        moreOption.className = 'person-suggestion person-suggestion-more';
        moreOption.innerHTML = '<span>+ ' + (availablePeople.length - 5) + ' more people</span>';
        
        moreOption.addEventListener('click', function() {
            // Show all remaining people
            suggestionsContainer.innerHTML = '';
            
            // Add a search input at the top
            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.className = 'person-search-input';
            searchInput.placeholder = 'Search people...';
            searchInput.value = currentInput;
            suggestionsContainer.appendChild(searchInput);
            
            // Add all people as options
            const peopleContainer = document.createElement('div');
            peopleContainer.className = 'all-people-container';
            
            availablePeople.forEach(function(person) {
                const personInitial = person.charAt(0).toUpperCase();
                const hue = (person.charCodeAt(0) * 5) % 360;
                const avatarColor = 'hsl(' + hue + ', 70%, 65%)';
                
                const suggestion = document.createElement('div');
                suggestion.className = 'person-suggestion';
                suggestion.dataset.name = person.toLowerCase();
                
                suggestion.innerHTML = 
                    '<div class="person-tag-avatar" style="background-color: ' + avatarColor + ';">' + personInitial + '</div>' +
                    '<span>' + person + '</span>';
                
                suggestion.addEventListener('click', function() {
                    DOM.newPersonName.value = person;
                    addPersonToList();
                    suggestionsContainer.remove();
                });
                
                peopleContainer.appendChild(suggestion);
            });
            
            suggestionsContainer.appendChild(peopleContainer);
            
            // Focus the search input
            searchInput.focus();
            
            // Add search functionality
            searchInput.addEventListener('input', function(e) {
                const searchTerm = e.target.value.toLowerCase();
                const suggestions = peopleContainer.querySelectorAll('.person-suggestion');
                
                suggestions.forEach(function(suggestion) {
                    const personName = suggestion.dataset.name;
                    if (personName.includes(searchTerm)) {
                        suggestion.style.display = 'flex';
                    } else {
                        suggestion.style.display = 'none';
                    }
                });
            });
            
            // Trigger the search with current input
            if (currentInput) {
                searchInput.dispatchEvent(new Event('input'));
            }
        });
        
        suggestionsContainer.appendChild(moreOption);
    }
    
    // Position below the input field
    const inputRect = DOM.newPersonName.getBoundingClientRect();
    DOM.peopleList.parentNode.appendChild(suggestionsContainer);
    
    // Add click outside handler to close suggestions
    document.addEventListener('click', function closePersonSuggestions(e) {
        if (!suggestionsContainer.contains(e.target) && e.target !== DOM.newPersonName) {
            suggestionsContainer.remove();
            document.removeEventListener('click', closePersonSuggestions);
        }
    });
}

/**
 * Quick add a set of common people to the people list
 */
function quickAddPeople() {
    // Get all unique existing people from all containers
    const existingPeople = getAllUniquePeople();
    
    if (existingPeople.length === 0) {
        // If no existing people found, use default list
        const commonPeople = [
            'Ansh', 'Aarhan', 'Devansh', 'Aditya'
        ];
        
        // Filter out people already in the list
        const newPeople = commonPeople.filter(function(person) {
            return !APP_STATE.peopleTags.includes(person);
        });
        
        if (newPeople.length === 0) {
            showToast('All common people are already added', 'info');
            return;
        }
        
        // Add each person with a slight delay for a nice animation effect
        newPeople.forEach(function(person, index) {
            setTimeout(function() {
                // Add to the state
                APP_STATE.peopleTags.push(person);
                
                // Hide the "No people added yet" message
                DOM.noPeopleMessage.style.display = 'none';
                
                // Get person initial for avatar
                const personInitial = person.charAt(0).toUpperCase();
                
                // Generate consistent avatar color
                const hue = (person.charCodeAt(0) * 5) % 360;
                const avatarColor = 'hsl(' + hue + ', 70%, 65%)';
                
                // Create and add the tag with enhanced design
                const personTag = document.createElement('div');
                personTag.className = 'person-tag';
                personTag.style.animationDelay = index * 0.1 + 's';
                
                personTag.innerHTML = 
                    '<div class="person-tag-avatar" style="background-color: ' + avatarColor + ';">' + personInitial + '</div>' +
                    '<span>' + person + '</span>' +
                    '<button class="person-tag-remove" data-person="' + person + '" title="Remove ' + person + '">' +
                    '<i class="fas fa-times-circle"></i>' +
                    '</button>';
                
                // Add remove functionality
                const removeButton = personTag.querySelector('.person-tag-remove');
                removeButton.addEventListener('click', function() {
                    const personToRemove = this.getAttribute('data-person');
                    APP_STATE.peopleTags = APP_STATE.peopleTags.filter(function(name) {
                        return name !== personToRemove;
                    });
                    
                    // Add slide-out animation before removing
                    personTag.style.transition = 'all 0.3s ease';
                    personTag.style.transform = 'translateX(10px)';
                    personTag.style.opacity = '0';
                    
                    setTimeout(function() {
                        personTag.remove();
                        
                        // Show the "No people added yet" message if the list is empty
                        if (APP_STATE.peopleTags.length === 0) {
                            DOM.noPeopleMessage.style.display = 'block';
                        }
                    }, 300);
                });
                
                DOM.peopleList.appendChild(personTag);
            }, index * 100); // Stagger the addition by 100ms per person
        });
        
        showToast('Added ' + newPeople.length + ' people to the list', 'success');
    } else {
        // Create a modal to select from existing people
        const modalBackdrop = document.createElement('div');
        modalBackdrop.className = 'quick-add-people-modal';
        
        // Start building the HTML content
        let modalContent = '<div class="quick-add-people-content anim-bounce-in">' +
            '<div class="quick-add-people-header">' +
            '<h3>Add Existing People</h3>' +
            '<button class="quick-add-people-close">' +
            '<i class="fas fa-times"></i>' +
            '</button>' +
            '</div>' +
            '<div class="quick-add-people-body">' +
            '<div class="quick-add-people-search">' +
            '<input type="text" placeholder="Search people..." class="quick-add-search-input">' +
            '</div>' +
            '<div class="quick-add-people-list">';
        
        // Generate HTML for each person
        existingPeople.forEach(function(person) {
            const personInitial = person.charAt(0).toUpperCase();
            const hue = (person.charCodeAt(0) * 5) % 360;
            const avatarColor = 'hsl(' + hue + ', 70%, 65%)';
            const isAdded = APP_STATE.peopleTags.includes(person);
            const addedClass = isAdded ? 'already-added' : '';
            const checkboxAttrs = isAdded ? 'checked disabled' : '';
            const label = isAdded ? '<span class="already-added-label">Already added</span>' : '';
            
            modalContent += '<div class="quick-add-person ' + addedClass + '" data-name="' + person.toLowerCase() + '" data-person="' + person + '">' +
                '<div class="person-check">' +
                '<input type="checkbox" id="check-' + person + '" ' + checkboxAttrs + '>' +
                '<label for="check-' + person + '"></label>' +
                '</div>' +
                '<div class="person-tag-avatar" style="background-color: ' + avatarColor + ';">' + personInitial + '</div>' +
                '<span>' + person + '</span>' +
                label +
                '</div>';
        });
        
        modalContent += '</div>' +
            '</div>' +
            '<div class="quick-add-people-footer">' +
            '<button class="btn btn--neutral quick-add-cancel">Cancel</button>' +
            '<button class="btn btn--primary quick-add-confirm">' +
            '<i class="fas fa-plus-circle mr-1"></i>' +
            'Add Selected' +
            '</button>' +
            '</div>' +
            '</div>';
        
        modalBackdrop.innerHTML = modalContent;
        document.body.appendChild(modalBackdrop);
        
        // Get modal elements
        const modal = modalBackdrop.querySelector('.quick-add-people-content');
        const closeBtn = modalBackdrop.querySelector('.quick-add-people-close');
        const cancelBtn = modalBackdrop.querySelector('.quick-add-cancel');
        const confirmBtn = modalBackdrop.querySelector('.quick-add-confirm');
        const searchInput = modalBackdrop.querySelector('.quick-add-search-input');
        const peopleList = modalBackdrop.querySelector('.quick-add-people-list');
        
        // Show modal with animation
        setTimeout(function() {
            modalBackdrop.style.opacity = '1';
            modal.style.transform = 'scale(1)';
        }, 10);
        
        // Add search functionality
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const peopleItems = peopleList.querySelectorAll('.quick-add-person');
            
            peopleItems.forEach(function(item) {
                const personName = item.dataset.name;
                if (personName.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
        
        // Add click handler for each person item
        peopleList.querySelectorAll('.quick-add-person:not(.already-added)').forEach(function(item) {
            item.addEventListener('click', function() {
                const checkbox = item.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
                
                // Toggle selected class
                if (checkbox.checked) {
                    item.classList.add('selected');
                } else {
                    item.classList.remove('selected');
                }
                
                // Update confirm button text
                const selectedCount = peopleList.querySelectorAll('.quick-add-person input[type="checkbox"]:checked:not([disabled])').length;
                if (selectedCount > 0) {
                    confirmBtn.innerHTML = '<i class="fas fa-plus-circle mr-1"></i> Add ' + selectedCount + ' People';
                    confirmBtn.disabled = false;
                } else {
                    confirmBtn.innerHTML = '<i class="fas fa-plus-circle mr-1"></i> Add Selected';
                    confirmBtn.disabled = true;
                }
            });
        });
        
        // Close modal function
        const closeModal = function() {
            modalBackdrop.style.opacity = '0';
            modal.style.transform = 'scale(0.9)';
            setTimeout(function() {
                modalBackdrop.remove();
            }, 300);
        };
        
        // Close on close button click
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        
        // Close on click outside modal
        modalBackdrop.addEventListener('click', function(e) {
            if (e.target === modalBackdrop) {
                closeModal();
            }
        });
        
        // Add selected people when confirm button is clicked
        confirmBtn.addEventListener('click', function() {
            const selectedPeople = [];
            
            peopleList.querySelectorAll('.quick-add-person input[type="checkbox"]:checked:not([disabled])').forEach(function(checkbox) {
                const personItem = checkbox.closest('.quick-add-person');
                const personName = personItem.dataset.person;
                selectedPeople.push(personName);
            });
            
            // Close modal
            closeModal();
            
            // If no people selected, do nothing
            if (selectedPeople.length === 0) {
                return;
            }
            
            // Add selected people to the list
            selectedPeople.forEach(function(person, index) {
                setTimeout(function() {
                    // Add to the state
                    APP_STATE.peopleTags.push(person);
                    
                    // Hide the "No people added yet" message
                    DOM.noPeopleMessage.style.display = 'none';
                    
                    // Get person initial for avatar
                    const personInitial = person.charAt(0).toUpperCase();
                    
                    // Generate consistent avatar color
                    const hue = (person.charCodeAt(0) * 5) % 360;
                    const avatarColor = 'hsl(' + hue + ', 70%, 65%)';
                    
                    // Create and add the tag with enhanced design
                    const personTag = document.createElement('div');
                    personTag.className = 'person-tag';
                    personTag.style.animationDelay = index * 0.1 + 's';
                    
                    personTag.innerHTML = 
                        '<div class="person-tag-avatar" style="background-color: ' + avatarColor + ';">' + personInitial + '</div>' +
                        '<span>' + person + '</span>' +
                        '<button class="person-tag-remove" data-person="' + person + '" title="Remove ' + person + '">' +
                        '<i class="fas fa-times-circle"></i>' +
                        '</button>';
                    
                    // Add remove functionality
                    const removeButton = personTag.querySelector('.person-tag-remove');
                    removeButton.addEventListener('click', function() {
                        const personToRemove = this.getAttribute('data-person');
                        APP_STATE.peopleTags = APP_STATE.peopleTags.filter(function(name) {
                            return name !== personToRemove;
                        });
                        
                        // Add slide-out animation before removing
                        personTag.style.transition = 'all 0.3s ease';
                        personTag.style.transform = 'translateX(10px)';
                        personTag.style.opacity = '0';
                        
                        setTimeout(function() {
                            personTag.remove();
                            
                            // Show the "No people added yet" message if the list is empty
                            if (APP_STATE.peopleTags.length === 0) {
                                DOM.noPeopleMessage.style.display = 'block';
                            }
                        }, 300);
                    });
                    
                    DOM.peopleList.appendChild(personTag);
                }, index * 100); // Stagger the addition by 100ms per person
            });
            
            showToast('Added ' + selectedPeople.length + ' people to the list', 'success');
        });
        
        // Focus the search input
        setTimeout(function() {
            searchInput.focus();
        }, 300);
    }
}

// ===== MODAL HANDLING WITH ENHANCED ANIMATIONS =====

/**
 * Show the modal to add a new item
 */
async function showModal(modal, focusElement = null) {
    if (!modal) return;
    
    // Make modal visible but transparent
    modal.style.display = 'flex';
    modal.style.opacity = '0';
    
    // Get the modal content
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.style.transform = 'scale(0.9)';
        modalContent.style.opacity = '0';
    }
    
    // Trigger reflow
    modal.offsetHeight;
    
    // Animate modal background
    modal.style.transition = 'opacity 300ms ease';
    modal.style.opacity = '1';
    
    // Animate modal content
    if (modalContent) {
        modalContent.style.transition = 'transform 300ms ease, opacity 300ms ease';
        modalContent.style.transform = 'scale(1)';
        modalContent.style.opacity = '1';
    }
    
    // Set focus after animation completes
    if (focusElement) {
        setTimeout(() => {
            focusElement.focus();
            
            // If it's an input, select all text for easy replacement
            if (focusElement.tagName === 'INPUT') {
                focusElement.select();
            }
        }, 350);
    }
}

/**
 * Hide a modal with smooth animation
 */
async function hideModal(modal) {
    if (!modal) return;
    
    // Get the modal content
    const modalContent = modal.querySelector('.modal-content');
    
    // Animate modal content first
    if (modalContent) {
        modalContent.style.transition = 'transform 250ms ease, opacity 250ms ease';
        modalContent.style.transform = 'scale(0.9)';
        modalContent.style.opacity = '0';
    }
    
    // Wait a bit and then fade out the background
    setTimeout(() => {
        modal.style.transition = 'opacity 200ms ease';
        modal.style.opacity = '0';
        
        // Hide modal after animation completes
        setTimeout(() => {
            modal.style.display = 'none';
            
            // Reset transforms for next open
            if (modalContent) {
                modalContent.style.transform = '';
                modalContent.style.opacity = '';
            }
        }, 200);
    }, 50);
}

// ===== TOAST NOTIFICATIONS =====

/**
 * Show a toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of toast (success, error, info, warning)
 * @param {number} duration - How long to show the toast in ms
 */
function showToast(message, type = 'info', duration = 3000) {
    // Create toast container if it doesn't exist
    if (!DOM.toastContainer) {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 10px;
        `;
        document.body.appendChild(container);
        DOM.toastContainer = container;
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    
    // Style based on type
    let icon, bgColor, textColor, borderColor;
    switch (type) {
        case 'success':
            icon = 'fas fa-check-circle';
            bgColor = '#d1fae5';
            textColor = '#065f46';
            borderColor = '#10b981';
            break;
        case 'error':
            icon = 'fas fa-exclamation-circle';
            bgColor = '#fee2e2';
            textColor = '#991b1b';
            borderColor = '#ef4444';
            break;
        case 'warning':
            icon = 'fas fa-exclamation-triangle';
            bgColor = '#fef3c7';
            textColor = '#92400e';
            borderColor = '#f59e0b';
            break;
        case 'info':
        default:
            icon = 'fas fa-info-circle';
            bgColor = '#e0f2fe';
            textColor = '#0369a1';
            borderColor = '#38bdf8';
            break;
    }
    
    // Set toast style
    toast.style.cssText = `
        background-color: ${bgColor};
        color: ${textColor};
        border-left: 4px solid ${borderColor};
        padding: 12px 16px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        min-width: 250px;
        max-width: 350px;
        transform: translateX(120%);
        transition: transform 0.3s ease;
    `;
    
    // Toast content
    toast.innerHTML = `
        <i class="${icon}" style="margin-right: 10px;"></i>
        <div style="flex: 1;">${message}</div>
        <button class="toast-close no-ripple" style="background: none; border: none; color: ${textColor}; cursor: pointer; margin-left: 10px;">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to container
    DOM.toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 10);
    
    // Set up close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.style.transform = 'translateX(120%)';
        setTimeout(() => {
            if (toast.parentNode) {
                DOM.toastContainer.removeChild(toast);
            }
        }, 300);
    });
    
    // Auto-remove after duration
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.transform = 'translateX(120%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    DOM.toastContainer.removeChild(toast);
                }
            }, 300);
        }
    }, duration);
    
    return toast;
}

/**
 * Toggles the settlement indicator for a container
 * @param {string} containerName - Name of the container
 * @param {boolean} showIndicator - Whether to show or hide the indicator
 */
function toggleSettlementIndicator(containerName, showIndicator) {
    const indicator = document.querySelector(`.settlement-indicator[data-container="${containerName}"]`);
    
    if (!indicator) return;
    
    if (showIndicator) {
        // Add confetti elements
        if (!indicator.querySelector('.confetti')) {
            for (let i = 0; i < 6; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                indicator.appendChild(confetti);
            }
        }
        
        // Show and animate the indicator
        indicator.style.display = 'flex';
        // Use setTimeout to ensure the display change has taken effect before adding active class
        setTimeout(() => {
            indicator.classList.add('active');
            // Show a success toast message
            showToast(`Settlement complete for ${containerName}!`, 'success');
        }, 50);
    } else {
        // Remove active class and hide the indicator
        indicator.classList.remove('active');
        setTimeout(() => {
            indicator.style.display = 'none';
            // Remove confetti elements
            const confetti = indicator.querySelectorAll('.confetti');
            confetti.forEach(el => el.remove());
        }, 1000); // Wait for animations to complete
    }
}

/**
 * Updates settlement indicators for all containers based on settlements data
 */
function updateSettlementIndicators() {
    // Get all containers
    const containers = getContainers();
    
    containers.forEach(container => {
        // Check if this container is settled (all debts paid)
        const containerItems = getItems().filter(item => item.container === container);
        
        if (containerItems.length === 0) return;
        
        // Get unique people involved in this container
        const people = [...new Set(containerItems.map(item => item.person))];
        
        // If only one person in container, it's considered settled
        if (people.length <= 1) {
            toggleSettlementIndicator(container, true);
            return;
        }
        
        // Get settlements for these people
        const containerSettlements = calculateSettlements(container);
        
        // Check if all settlements are zero (everything is paid)
        const isSettled = containerSettlements.every(settlement => 
            Math.abs(settlement.amount) < 0.01  // Using a small threshold to account for floating point errors
        );
        
        // Toggle indicator based on settlement status
        toggleSettlementIndicator(container, isSettled);
    });
}

/**
 * Updates the visual appearance of containers based on settlement status
 * @param {string} containerId - ID of the container to update
 * @param {boolean} isSettled - Whether all settlements are complete
 */
function updateContainerSettlementStatus(containerId, isSettled) {
    const container = document.querySelector(`.expense-container[data-id="${containerId}"]`);
    if (!container) return;
    
    if (isSettled) {
        container.classList.add('container-settled');
        // Add subtle animation to indicate completion
        container.style.transition = 'background-color 0.5s ease';
        
        // Show animation only if this is a new settled state
        if (!container.hasAttribute('data-settled')) {
            const celebrationEffect = document.createElement('div');
            celebrationEffect.className = 'celebration-effect';
            celebrationEffect.innerHTML = '🎉';
            container.appendChild(celebrationEffect);
            
            // Animate celebration emoji
            setTimeout(() => {
                celebrationEffect.style.opacity = '1';
                celebrationEffect.style.transform = 'translateY(0) scale(1)';
                
                // Remove after animation completes
                setTimeout(() => {
                    celebrationEffect.style.opacity = '0';
                    setTimeout(() => {
                        if (celebrationEffect.parentNode) {
                            celebrationEffect.parentNode.removeChild(celebrationEffect);
                        }
                    }, 500);
                }, 2000);
            }, 100);
            
            // Add a soft highlight flash
            container.style.backgroundColor = '#f0fff4';
            setTimeout(() => {
                container.style.backgroundColor = '';
            }, 1500);
        }
        
        container.setAttribute('data-settled', 'true');
    } else {
        container.classList.remove('container-settled');
        container.removeAttribute('data-settled');
    }
}

/**
 * Update all settlement indicators
 */
function updateSettlementIndicators() {
    const containers = document.querySelectorAll('.expense-container');
    
    containers.forEach(container => {
        const containerId = container.getAttribute('data-id');
        if (!containerId) return;
        
        const settlementIndicator = container.querySelector('.settlement-indicator');
        if (!settlementIndicator) return;
        
        // Get all items in this container
        const allExpenses = getAllExpenses();
        const containerItems = allExpenses.filter(item => item.container === containerId);
        
        // If no items, hide the indicator
        if (containerItems.length === 0) {
            toggleSettlementIndicator(containerId, false);
            updateContainerSettlementStatus(containerId, false);
            return;
        }
        
        // Get unique people in this container
        const uniquePeople = [...new Set(containerItems.map(item => item.person))];
        
        // If only one person, no settlements needed
        if (uniquePeople.length <= 1) {
            toggleSettlementIndicator(containerId, true);
            updateContainerSettlementStatus(containerId, true);
            return;
        }
        
        // Calculate if the container is settled based on existing data
        const isSettled = APP_STATE.settledContainers.has(containerId);
        
        // Update the settlement indicator
        toggleSettlementIndicator(containerId, isSettled);
        
        // Update container appearance
        updateContainerSettlementStatus(containerId, isSettled);
    });
}

// Call this function when the app initializes
function initializeSettlementIndicators() {
    // Add CSS for settled containers
    const style = document.createElement('style');
    style.textContent = `
        .container-settled {
            border: 1px solid #10b981 !important;
            box-shadow: 0 0 8px rgba(16, 185, 129, 0.2) !important;
        }
        .celebration-effect {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -100%) scale(0.5);
            font-size: 40px;
            opacity: 0;
            transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            pointer-events: none;
            z-index: 10;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize settlement indicators
    updateSettlementIndicators();
}

// Update the calculateAndDisplaySettlements function to call updateSettlementIndicators
function calculateAndDisplaySettlements() {
    // ... existing code ...
    
    // Update settlement indicators after calculating
    updateSettlementIndicators();
    
    // ... existing code ...
}