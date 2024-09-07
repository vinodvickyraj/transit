# Transit

Transit empowers backend developers to create dynamic front-end features without needing an extensive background in frontend development. Transit facilitates AJAX requests using event attributes directly in your HTML, which enables you to develop modern, interactive user interfaces with minimal effort.

[Try Demo](https://techiepartner.com/todo/)

## Overview
Transit simplifies AJAX request handling using straightforward event attributes in your HTML. This technique allows you to build modern, interactive user interfaces efficiently by merging HTML simplicity with AJAX's power. For example, an AJAX request can be sent to `on-click="\request"` to update a webpage section dynamically when a user clicks a button.

## Core Features
Transit offers an array of features to facilitate the smooth creation of interactive user interfaces:

1. **Event-Driven AJAX Requests**: Handle AJAX requests via custom `on-*` attributes in your HTML.
2. **Dynamic Content Updates**: Program DOM elements to update based on server responses.
3. **Form Handling**: Seamlessly manage form data and file uploads.
4. **Reset**: Reset forms to their original state effectively.
5. **Hooks and Filters**: Extend or alter Transit functionalities with ease.
6. **CSRF Protection**: Secure your AJAX requests with CSRF token integration.
7. **Processing State Management**: Enable elements to show ongoing AJAX operations using the `processing` class.
8. **Response Actions**: Diverse actions can be specified based on server responses such as DOM updates, alerts, redirects, and more.

## Installation
Integrate the Transit script into your HTML:

```html
<script src="path/to/transit.js"></script>
```

## Request Event Configuration

### Base URL and CSRF Token
Set up the base URL and CSRF token for your requests by including the following meta tags in your HTML head:

```html
<meta name="base-url" content="https://example.com/api/">
<meta name="csrf-token" content="token_value_here">
```

### Supported Event Attributes
Utilize the following `on-*` attributes to bind events to HTML elements:

- `on-load`
- `on-submit`
- `on-change`
- `on-click`
- `on-dblclick`
- `on-blur`
- `on-focus`
- `on-focusin`
- `on-focusout`
- `on-keydown`
- `on-keypress`
- `on-keyup`
- `on-reset`

### Example
Configure an AJAX request to be sent when a user clicks a button:

```html
<button on-click="/clicked">Click Me</button>
```

## Handling Form Data
Transit can automatically manage form data, including file uploads. Use `on-submit` on form elements:

```html
<form on-submit="/submit-form">
    <input type="text" name="username" required>
    <button type="submit">Submit</button>
</form>
```

## Custom Data Attributes
Attach additional data to your HTML elements using `data-*` attributes:

```html
<div on-click="/update" data-id="123" data-name="John Doe">Update</div>
```

## Managing Processing States
Indicate ongoing operations using the `processing` class by linking elements through the `key` and `map` attributes:

```html
<button on-click="/process" key="submit-button">Process</button>
<div map="submit-button" class="status"></div>
```

## Response Actions
You can define a variety of actions based on server responses to AJAX requests:

### Updating DOM elements:
An example of updating the HTML content of a specific element:

```json
[
    {
        "document": [
            {
                "method": "html",
                "element": ".element",
                "value": "<div>New HTML Content</div>"
            }
        ]
    }
]
```

### Available `document` Methods
Transit supports several methods to manipulate the DOM:

- **html**: Replace the inner HTML of the element.
- **append**: Add specified HTML to the end of the element.
- **prepend**: Insert specified HTML at the beginning of the element.
- **addClass**: Add a specified class to the element.
- **removeClass**: Remove a specified class from the element.
- **attr**: Set an attribute with a specified value.
- **removeAttr**: Remove a specified attribute.
- **remove**: Completely remove the element from the DOM.
- **reset**: Reset a form element to its original state.

### Remove an element:
Example of how to remove a specific element from the DOM:

```json
[
    {
        "document": [
            {
                "method": "remove",
                "element": ".element"
            }
        ]
    }
]
```

### Call a JavaScript function:
Directly invoke a client-side JavaScript function:

```json
[
    {
        "fn": {
            "name": "customFunction",
            "arguments": ["Hello"]
        }
    }
]
```

### Redirect the user:
Example JSON to redirect a user to a new URL:

```json
[
    {
        "redirect": "/new-url"
    }
]
```

### Reload the page:
Instruct the browser to reload the current page:

```json
[
    {
        "reload": true
    }
]
```

## Event Listeners Extension
Custom event listeners can be attached to extend Transit functionalities:

```js
document.addEventListener('TransitReady', (event) => {
    setTimeout(function(){
        event.detail.scope.querySelectorAll(".date").forEach((element) => {
            // Initialize a datepicker on elements with class .date
            initializeDatePicker(element);
        });
    }, 0);
});
```

## Event Lifecycle
Upon full DOM load, Transit initializes, setting up event listeners and hooks, and dispatching events like `TransitReady` and `TransitInitialized`.

## Plugin Integration
Implement plugins using the `TransitInitialized` event:

```js
document.addEventListener('TransitInitialized', (event) => {
    try {
        const transit = event.detail.instance;
        initializeYourPlugin(transit); // Initialize your plugin integration
    } catch (error) {
        console.error('Error initializing your plugin:', error);
    }
});
```

## Hooks and Filters
Utilize hooks and filters to customize and extend Transit:

### Filters
- `modifyEvents`: Customize event type list.
- `modifyAction`: Modify actions prior to execution.

### Actions
- `beforeRequest`: Execute custom logic before any AJAX request is processed.
- `afterResponse`: Execute logic after server response handling.


Tailor Transit to meet specific needs, making it an adaptable and extensible library for constructing dynamic user interfaces.

## License
Transit is [MIT](https://opensource.org/licenses/MIT) licensed, allowing widespread adoption and usage in both commercial and personal projects.

With Transit, focus on backend development while still providing rich and interactive user experiences. Enhance productivity by creating dynamic UI components effortlessly with Transit. Start now and see the impact!