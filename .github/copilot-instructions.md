# Vue HTML Builder - AI Coding Guide

## Architecture Overview

This is a **drag-and-drop HTML builder** built with Vue 3 Composition API + Pinia state management. The core concept is component-based page building with three output formats: Tailwind CSS, inline styles, or custom CSS classes.

### Key Components Structure
- **`src/stores/editor.js`** - Central Pinia store with nested component support, undo/redo, templates, and export logic
- **`src/views/Editor.vue`** - 4-column layout: Toolbox | Component Tree | Canvas | Properties Panel
- **`src/components/editor/ComponentTree.vue`** - Hierarchical component navigator with icons and selection
- **`src/components/editor/ComponentToolbox.vue`** - 3-category component library (Basic, Layout, Pre-built)
- **`src/components/editor/RenderComponent.vue`** - Recursive component renderer with container support
- **`src/components/editor/PropertiesPanel.vue`** - Multi-tab property editor with enhanced input types
- **`src/utils/element-properties.js`** - Property definitions with value/enum/color input types

## Critical Development Patterns

### Component Data Model
Components follow this structure with **nested hierarchy support**:
```javascript
{
  id: 'component-type-timestamp', // Unique identifier
  type: 'header|paragraph|button|hero|features|cta|image|heading|container|grid|flexbox|section',
  content: 'Text content or specific properties',
  classes: 'tailwind-classes-string', // Tailwind styling
  customStyles: {}, // CSS-in-JS object for inline/CSS class output
  children: [], // Array of child components (for containers)
  // Type-specific properties (heading.level, image.src, hero.heading, table.headers/rows, etc.)
}
```

### Container Architecture
The app supports **nested drag-and-drop** with container types:
- **`container`** - Generic flex container with drop zones
- **`grid`** - CSS Grid with configurable columns  
- **`flexbox`** - Flexbox layout with automatic spacing
- **`section`** - Semantic section wrapper with nesting
- **`table`** - Dynamic table with header/row management

**Critical Methods**:
- `store.addChildToContainer(parentId, childComponent)` - Add nested components
- `store.removeChildFromContainer(parentId, childId)` - Remove from hierarchy
- `store.findComponentById(id, componentList)` - Recursive component lookup

### Dual Styling System
The app supports **three output modes** controlled by `store.outputType`:
1. **`tailwind`** - Uses `component.classes` (Tailwind classes)
2. **`inline-styles`** - Uses `component.customStyles` object
3. **`css-classes`** - Generates CSS classes from `customStyles`

**Critical**: When modifying components, update BOTH `classes` and `customStyles` to maintain cross-format compatibility.

### State Management Patterns
- **Always call `store.saveState()`** before mutations for undo/redo functionality
- Use `store.updateComponent(id, properties)` for content changes
- Use `store.updateComponentStyles(id, styleProperties)` for styling changes
- localStorage persistence via `@vueuse/core` useStorage for components and templates

### Property System
`src/utils/element-properties.js` defines **three input types**:
- **`value`** - Free text input with dropdown suggestions (margins, padding, dimensions)
- **`enum`** - Fixed dropdown options (display, position, text-align)
- **`color`** - Color picker with hex/rgb support

**CSS mappings** from property names to actual CSS properties for cross-format compatibility.

Add new properties here when extending component customization.

## Development Workflows

### Adding New Component Types
1. Add default structure in `ComponentToolbox.vue` `handleDragStart()` switch statement
2. Add rendering logic in `RenderComponent.vue` template
3. Add property inputs in `PropertiesPanel.vue` content tab
4. Add HTML export logic in `store.exportToHTML()` switch statement

### Component Categories in Toolbox
- **Basic Elements**: text, buttons, images, forms (header, paragraph, button, input, etc.)
- **Layout Elements**: containers and structural components (container, grid, flexbox, section, card, table)
- **Pre-built Components**: complex assembled components (hero, navbar, footer, features, cta, testimonial)

### Running the Application
```bash
npm run dev  # Starts Vite dev server on port 5173
npm run build # Production build
```

### Key Dependencies
- **SortableJS** - Drag/drop reordering in canvas
- **@vueuse/core** - localStorage utilities
- **vue3-toastify** - User notifications
- **html-beautify** - Code formatting for exports

## Integration Points

### Drag & Drop Flow
1. `ComponentToolbox.vue` creates component data on dragStart
2. `store.setDragging()` stores pending component
3. Editor canvas drop zones call `store.addComponent()`
4. SortableJS handles reordering via `store.moveComponent()`

**Container Drop Handling**: `RenderComponent.vue` implements `handleContainerDrop()` for nested components

### Export System
Export logic in `store.exportToHTML()` generates different output based on `outputType`:
- Adds Tailwind CDN for 'tailwind' mode
- Generates `<style>` blocks for 'css-classes' mode  
- Uses inline `style` attributes for 'inline-styles' mode

### Template System
Templates stored in localStorage via `useStorage('web-editor-templates')`. Each template contains:
```javascript
{ id: string, name: string, components: Component[] }
```

### Component Tree View
`ComponentTree.vue` provides hierarchical component navigation:
- Visual tree representation with type-specific icons
- Direct component selection integration with store
- Delete functionality for nested and root components
- Recursive rendering to handle unlimited nesting depth

## Project-Specific Conventions

- **Component IDs**: Format `{type}-{timestamp}` for uniqueness
- **Mixed language comments**: Vietnamese comments in some files (legacy)
- **Computed styling**: `RenderComponent.vue` dynamically applies classes/styles based on preview mode and output type
- **Property tabs**: Properties panel has 'content', 'styles', 'advanced' tabs for organization
- **Undo/redo**: JSON stringification for state snapshots, not object references

## Common Extension Points

- **New component types**: Follow the 4-step pattern above
- **New style properties**: Add to `element-properties.js` with proper CSS mapping
- **Export formats**: Extend `exportToHTML()` switch statement for new output types
- **Template features**: Leverage existing template CRUD in store actions
