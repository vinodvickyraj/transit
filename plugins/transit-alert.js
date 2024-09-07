/**
 * TransitAlert integration for Transit, managing alert and confirm dialog.
 */
class TransitAlert {
    /**
     * Initializes a new instance of the TransitAlert class.
     * @param {Transit} appInstance - An instance of Transit.
     */
    constructor(appInstance) {
        if (!appInstance) throw new Error("TransitAlert requires a valid Transit instance.");
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
     * Handles confirmation dialogs using the browser's `confirm()` function.
     * This method synchronously waits for user response before proceeding.
     * @param {HTMLElement} element - The element that triggered the confirmation dialog.
     * @param {Event} event - The event associated with the action.
     * @returns {boolean} - Resolves to true if the user confirms, otherwise false.
     */
    handleConfirm(element, event) {
        const confirmMessage = element.getAttribute('confirm');

        // If no confirmation is required, proceed immediately
        if (!confirmMessage) {
            return true;
        }

        // Show the native confirm dialog and return its result
        return window.confirm(confirmMessage);
    }

    /**
     * Modifies action objects by replacing 'alert' with a native browser `alert()`.
     * @param {Object} action - The original action object from the server response.
     * @param {HTMLElement} element - The element that triggered the action.
     * @returns {Object} The modified action object.
     */
    modifyAction(action, element) {
        if (action.hasOwnProperty('alert')) {
            action.browserAlert = action.alert;
            delete action.alert;
        }
        return action;
    }

    /**
     * Displays native `alert()` dialogs before processing other response actions,
     * ensuring that alerts are handled visually through the browser's native dialog.
     * @param {HTMLElement} element - The element that triggered the response.
     * @param {Object} action - The action object modified to contain 'browserAlert' property.
     */
    afterResponse(element, action) {
        if (action.browserAlert) {
            if (typeof action.browserAlert === 'string') {
                window.alert(action.browserAlert); // Show the native alert dialog with the message
            }

            // Handle redirects if defined in the action
            if (typeof action.browserAlert === 'object' && action.browserAlert.redirect) {
                window.location.href = action.browserAlert.redirect;
            }
        }
    }
}

/**
 * Listener for the TransitInitialized event, initializing Alert
 * when Transit is initialized. This ensures that Alert, Confirm integration
 * begins only after the core functionality is available.
 */
document.addEventListener('TransitInitialized', (event) => {
    try {
        const actjs = event.detail.instance;
        new TransitAlert(actjs); // Initialize TransitAlert integration
    } catch (error) {
        console.error('Error initializing TransitAlert:', error);
    }
});
