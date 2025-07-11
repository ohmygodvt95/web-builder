# Vue HTML Builder - AI Coding Guide

## Architecture Overview

This is a **drag-and-drop HTML builder** built with Vue 3 Composition API + Pinia state management. The core concept is component-based page building with three output formats: Tailwind CSS, inline styles, or custom CSS classes.

### Key Components Structure
- **`src/stores/editor.js`** - Central Pinia store managing all components, undo/redo, templates, and export logic
- **`src/views/Editor.vue`** - Main editor layout with toolbox, canvas, and properties panel
- **`src/components/editor/`** - Editor-specific components (toolbox, properties panel, renderer)
- **`src/utils/element-properties.js`** - Property definitions for component styling system

## Critical Development Patterns

### Component Data Model
Components follow this structure:
```javascript
{
  id: 'component-type-timestamp', // Unique identifier
  type: 'header|paragraph|button|hero|features|cta|image|heading|container',
  content: 'Text content or specific properties',
  classes: 'tailwind-classes-string', // Tailwind styling
  customStyles: {}, // CSS-in-JS object for inline/CSS class output
  // Type-specific properties (heading.level, image.src, hero.heading, etc.)
}
```

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
`src/utils/element-properties.js` defines:
- **Property groups** (layout, typography, colors, effects)
- **CSS mappings** from property names to actual CSS properties
- **Available options** for dropdowns in properties panel

Add new properties here when extending component customization.

## Development Workflows

### Adding New Component Types
1. Add default structure in `ComponentToolbox.vue` `handleDragStart()` switch statement
2. Add rendering logic in `RenderComponent.vue` template
3. Add property inputs in `PropertiesPanel.vue` content tab
4. Add HTML export logic in `store.exportToHTML()` switch statement

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
