/**
 * SweetAlert2 integration for Transit Library, managing alert and confirm dialog.
 */
class TransitSweetAlert2 {
    /**
     * Initializes a new instance of the TransitSweetAlert2 class.
     * @param {Transit} appInstance - An instance of Transit.
     */
    constructor(appInstance) {
        if (!appInstance) throw new Error("TransitSweetAlert2 requires a valid Transit instance.");
        this.app = appInstance;
        this.registerHooks();
    }

    /**
     * Registers hooks for modifying actions and handling confirmations.
     */
    registerHooks() {
        this.app.hooks.addAction('beforeRequest', this.handleConfirm.bind(this), 10);
        this.app.hooks.addFilter('modifyAction', this.modifyAction.bind(this));
        this.app.hooks.addAction('afterResponse', this.afterResponse.bind(this));
    }

    /**
     * Handles confirmation dialogs using SweetAlert2.
     * This method asynchronously waits for user response before proceeding.
     * @param {HTMLElement} element - The element that triggered the confirmation dialog.
     * @param {Event} event - The event associated with the action.
     * @returns {Promise<boolean>} - Resolves to true if the user confirms, otherwise false.
     */
    async handleConfirm(element, event) {
        const confirmMessage = element.getAttribute('confirm');

        // If no confirmation is required, resolve immediately to proceed
        if (!confirmMessage) {
            return true;
        }

        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: confirmMessage, // Use the confirmation message from the element
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, proceed',
                cancelButtonText: 'Cancel'
            });

            return result.isConfirmed; // Proceed if confirmed, otherwise return false
        } catch (error) {
            console.error('Error displaying confirmation dialog:', error);
            return false;
        }
    }


    /**
     * Modifies action objects by replacing 'alert' with 'sweetalert' to utilize SweetAlert2.
     * @param {Object} action - The original action object from the server response.
     * @param {HTMLElement} element - The element that triggered the action.
     * @returns {Object} The modified action object, now with a 'sweetalert' property instead of 'alert'.
     */
    modifyAction(action, element) {
        if (action.hasOwnProperty('alert')) {
            action.sweetalert = action.alert;
            delete action.alert;
        }
        return action;
    }

    /**
     * Displays SweetAlert2 alerts before processing other response actions,
     * ensuring that alerts are handled visually through SweetAlert2.
     * @param {HTMLElement} element - The element that triggered the response.
     * @param {Object} action - The action object modified to contain 'sweetalert' property.
     */
    afterResponse(element, action) {
        if (action.sweetalert) {
            let swalconfig = {};

            // Check if `action.sweetalert` is an object
            if (typeof action.sweetalert === 'object' && !Array.isArray(action.sweetalert)) {
                // Assume it's a full configuration object, pass it directly
                swalconfig = { ...action.sweetalert };
            } else {
                // If it's not an object, assume it's a string and use it as the `title`
                swalconfig = {
                    title: action.sweetalert,
                    icon: 'info',  // Default icon if not provided
                    showConfirmButton: false,  // No buttons
                    timer: 2000,  // Automatically close after 2 seconds
                    timerProgressBar: true  // Show a progress bar for the timer
                };
            }

            Swal.fire(swalconfig)
                .then(() => {
                    // Handle redirects if defined in the sweetalert action
                    if (typeof action.sweetalert === 'object' && action.sweetalert.redirect) {
                        window.location.href = action.sweetalert.redirect;
                    }
                })
                .catch(error => {
                    console.error('Failed to display SweetAlert2:', error);
                });
        }
    }
}

/**
 * Listener for the TransitInitialized event, initializing TransitSweetAlert2
 * when Transit is initialized. This ensures that SweetAlert2 integration
 * begins only after the core functionality is available.
 */
document.addEventListener('TransitInitialized', (event) => {
    try {
        const actjs = event.detail.instance;
        new TransitSweetAlert2(actjs); // Initialize SweetAlert2 integration
    } catch (error) {
        console.error('Error initializing TransitSweetAlert2:', error);
    }
});