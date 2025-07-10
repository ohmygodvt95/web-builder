# Vue HTML Builder

A drag-and-drop HTML builder application built with Vue 3 and Tailwind CSS.

## Features

- Create landing pages by dragging and dropping various components
- Components include: headers, buttons, hero sections, text, images, headings, and more
- Customize elements with a wide range of generic properties (margin, padding, colors, typography, etc.)
- Preview mode to see how your page will look with different output formats
- Export your design as HTML or JSON with three output options:
  - Tailwind CSS (includes Tailwind CDN)
  - Inline Styles (no dependency on Tailwind)
  - Custom CSS Classes (generates clean CSS stylesheet)
- Import JSON to continue editing previously created designs
- Save and load templates
- Beautiful, user-friendly interface with smooth operation
- Uses localStorage for data persistence

## Technology Stack

- Vue 3 with Composition API
- Tailwind CSS 3 for styling
- Vite for fast development
- Pinia for state management
- Vue Router for routing
- SortableJS for drag and drop functionality
- Vue3-Toastify for notifications

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to http://localhost:5173

## Usage

1. Drag components from the left sidebar onto the canvas
2. Click on a component to edit its properties in the right sidebar:
   - Content tab: Edit component-specific content
   - Styles tab: Customize appearance with generic properties
   - Advanced tab: Edit CSS classes or add custom CSS
3. Use the toolbar buttons to:
   - Toggle Preview Mode to see how your page will look
   - Select output format (Tailwind CSS, Inline Styles, or Custom CSS Classes)
   - Undo/redo changes
   - Save/load templates
   - Import/export designs
   - Clear the canvas

### Styling Options

The editor offers three ways to style components:

1. **Tailwind CSS**: Uses Tailwind utility classes
2. **Inline Styles**: Applies styles directly to HTML elements
3. **Custom CSS Classes**: Generates a stylesheet with unique classes for each component

You can preview each mode and export your HTML with the selected styling method.

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## License

[MIT](LICENSE)
