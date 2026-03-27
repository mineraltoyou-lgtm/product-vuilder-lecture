# Lotto Number Generator

## Overview

This project is a simple web application that generates random lottery numbers. It's built using modern web standards, including HTML, CSS, and JavaScript, with a focus on Web Components for creating a reusable UI element.

## Style, Design, and Features

### Initial Version
*   **Random Number Generation:** Generates 6 unique random numbers between 1 and 45.
*   **Web Component:** The entire application is encapsulated within a `<lotto-generator>` custom element.
*   **Basic Styling:** Simple layout with a title, a button, and a display area for the numbers. Each number has a background color based on its value range.

### V2 - Visual & UX Enhancement
*   **Iconography:** Added a refresh SVG icon to the "Generate Numbers" button to make it more intuitive.
*   **Modern Aesthetics:** 
    *   **Glassmorphism:** The main component has a semi-transparent background with a blur effect, creating a "frosted glass" look.
    *   **Depth and Shadow:** Added drop shadows to the main container and number balls to create a sense of depth.
    *   **Gradient Button:** The button now has a linear gradient and a subtle shadow.
*   **Animations & Interactivity:**
    *   The button icon rotates on hover.
    *   The button scales up slightly on hover to provide feedback.
    *   The number balls have a staggered appearance animation.
    *   The number balls lift up slightly on hover.
*   **Typography & Background:**
    *   Imported the 'Poppins' font for a cleaner, more modern look.
    *   The page background has a subtle radial gradient texture.

## Current Plan

*   **Objective:** Enhance the visual design and user experience of the Lotto Number Generator.
*   **Steps:**
    1.  **Read Files:** Review the existing `main.js` and `style.css` to understand the current implementation. (Done)
    2.  **Enhance `main.js`:**
        *   Add an SVG icon for a refresh symbol to the button.
        *   Update the component's internal styles to create a "glassmorphism" effect (frosted glass look) for the main container.
        *   Apply shadows to the container and number balls to add depth.
        *   Animate the button icon to rotate on hover.
        *   Animate the number balls to appear with a slight delay and to lift on hover. (Done)
    3.  **Enhance `style.css`:**
        *   Import and apply the 'Poppins' font from Google Fonts.
        *   Change the background to a dark color with a subtle, premium texture. (Done)
    4.  **Update `blueprint.md`:** Document the new design features and the steps taken. (Done)
