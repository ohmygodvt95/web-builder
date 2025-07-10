import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { toast } from 'vue3-toastify'
import { generateCSSFromProperties } from '../utils/element-properties'

export const useEditorStore = defineStore('editor', {
  state: () => ({
    components: useStorage('web-editor-components', []),
    currentlyDragging: null,
    selectedComponent: null,
    undoStack: [],
    redoStack: [],
    isPreviewMode: false,
    outputType: 'tailwind', // 'tailwind', 'inline-styles', or 'css-classes'
    templates: useStorage('web-editor-templates', [
      {
        id: 'template-1',
        name: 'Blank Template',
        components: []
      },
      {
        id: 'template-2',
        name: 'Simple Landing Page',
        components: [
          {
            id: 'header-1',
            type: 'header',
            content: 'Welcome to my landing page',
            classes: 'text-4xl font-bold text-center py-8 bg-blue-500 text-white',
            customStyles: {
              backgroundColor: '#3B82F6',
              color: '#FFFFFF',
              padding: '32px',
              textAlign: 'center',
              fontSize: '36px',
              fontWeight: 'bold',
            },
          },
          {
            id: 'hero-1',
            type: 'hero',
            heading: 'Amazing Product',
            subheading: 'The best product you will ever use',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.',
            imageUrl: 'https://via.placeholder.com/600x400',
            classes: 'flex flex-col md:flex-row items-center justify-between gap-8 py-16 px-4',
            customStyles: {
              padding: '64px',
              display: 'flex',
              flexDirection: 'column',
            },
          },
          {
            id: 'features-1',
            type: 'features',
            items: [
              { title: 'Feature 1', description: 'Description of feature 1' },
              { title: 'Feature 2', description: 'Description of feature 2' },
              { title: 'Feature 3', description: 'Description of feature 3' },
            ],
            classes: 'grid grid-cols-1 md:grid-cols-3 gap-8 py-16 px-4',
            customStyles: {
              padding: '64px',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '32px',
            },
          },
          {
            id: 'cta-1',
            type: 'cta',
            heading: 'Ready to get started?',
            buttonText: 'Sign Up Now',
            classes: 'text-center py-16 bg-gray-100',
            customStyles: {
              padding: '64px',
              textAlign: 'center',
              backgroundColor: '#F3F4F6',
            },
          }
        ]
      }
    ]),
  }),
  
  actions: {
    addComponent(component) {
      // Save current state for undo
      this.saveState();
      
      // Đảm bảo component luôn có customStyles
      if (!component.customStyles) {
        component.customStyles = {};
      }
      
      this.components.push(component);
      this.selectComponent(component.id);
      toast.success('Component added');
    },
    
    updateComponent(id, properties) {
      // Save current state for undo
      this.saveState();
      
      const index = this.components.findIndex(c => c.id === id);
      if (index !== -1) {
        this.components[index] = { ...this.components[index], ...properties };
      }
    },
    
    updateComponentStyles(id, styleProperties) {
      // Save current state for undo
      this.saveState();
      
      const index = this.components.findIndex(c => c.id === id);
      if (index !== -1) {
        // Đảm bảo customStyles tồn tại
        if (!this.components[index].customStyles) {
          this.components[index].customStyles = {};
        }
        
        // Cập nhật thuộc tính style
        this.components[index].customStyles = {
          ...this.components[index].customStyles,
          ...styleProperties
        };
      }
    },
    
    togglePreviewMode() {
      this.isPreviewMode = !this.isPreviewMode;
    },
    
    setOutputType(type) {
      if (['tailwind', 'inline-styles', 'css-classes'].includes(type)) {
        this.outputType = type;
      }
    },
    
    removeComponent(id) {
      // Save current state for undo
      this.saveState();
      
      const index = this.components.findIndex(c => c.id === id);
      if (index !== -1) {
        this.components.splice(index, 1);
        this.selectedComponent = null;
        toast.success('Component removed');
      }
    },
    
    moveComponent(oldIndex, newIndex) {
      // Save current state for undo
      this.saveState();
      
      if (oldIndex !== newIndex && oldIndex >= 0 && newIndex >= 0) {
        const component = this.components[oldIndex];
        this.components.splice(oldIndex, 1);
        this.components.splice(newIndex, 0, component);
      }
    },
    
    selectComponent(id) {
      this.selectedComponent = id;
    },
    
    setDragging(id) {
      this.currentlyDragging = id;
    },
    
    clearSelection() {
      this.selectedComponent = null;
    },
    
    saveState() {
      // Save current state to undo stack
      this.undoStack.push(JSON.stringify(this.components));
      // Clear redo stack when a new action is performed
      this.redoStack = [];
    },
    
    undo() {
      if (this.undoStack.length > 0) {
        // Save current state to redo stack
        this.redoStack.push(JSON.stringify(this.components));
        // Restore previous state
        const previousState = this.undoStack.pop();
        this.components = JSON.parse(previousState);
        toast.info('Undo successful');
      } else {
        toast.info('Nothing to undo');
      }
    },
    
    redo() {
      if (this.redoStack.length > 0) {
        // Save current state to undo stack
        this.undoStack.push(JSON.stringify(this.components));
        // Restore next state
        const nextState = this.redoStack.pop();
        this.components = JSON.parse(nextState);
        toast.info('Redo successful');
      } else {
        toast.info('Nothing to redo');
      }
    },
    
    exportToHTML() {
      // Generate HTML from components based on selected output type
      let html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n';
      html += '  <meta charset="UTF-8">\n';
      html += '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
      html += '  <title>Exported Landing Page</title>\n';
      
      // Add appropriate CSS based on output type
      if (this.outputType === 'tailwind') {
        html += '  <script src="https://cdn.tailwindcss.com"></script>\n';
      } else if (this.outputType === 'css-classes') {
        html += '  <style>\n';
        
        // Add custom CSS classes for each component
        this.components.forEach(component => {
          if (component.customStyles) {
            html += `    .component-${component.id} {\n`;
            for (const [key, value] of Object.entries(component.customStyles)) {
              html += `      ${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${value};\n`;
            }
            html += '    }\n';
          }
        });
        
        html += '  </style>\n';
      }
      
      html += '</head>\n<body>\n';
      
      // Add components
      this.components.forEach(component => {
        // Determine which classes/styles to use based on output type
        let classAttribute = '';
        let styleAttribute = '';
        
        if (this.outputType === 'tailwind') {
          classAttribute = component.classes ? ` class="${component.classes}"` : '';
        } else if (this.outputType === 'css-classes') {
          classAttribute = ` class="component-${component.id}"`;
        } else if (this.outputType === 'inline-styles') {
          if (component.customStyles) {
            const styleStr = Object.entries(component.customStyles)
              .map(([key, value]) => {
                // Convert camelCase to kebab-case for CSS
                const kebabKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
                return `${kebabKey}: ${value}`;
              })
              .join('; ');
            styleAttribute = styleStr ? ` style="${styleStr}"` : '';
          }
        }
        
        switch (component.type) {
          case 'header':
            html += `  <header${classAttribute}${styleAttribute}>${component.content}</header>\n`;
            break;
          case 'paragraph':
            html += `  <p${classAttribute}${styleAttribute}>${component.content}</p>\n`;
            break;
          case 'heading':
            const level = component.level || 1;
            html += `  <h${level}${classAttribute}${styleAttribute}>${component.content}</h${level}>\n`;
            break;
          case 'button':
            html += `  <button${classAttribute}${styleAttribute}>${component.content}</button>\n`;
            break;
          case 'image':
            html += `  <img src="${component.src}" alt="${component.alt || ''}"${classAttribute}${styleAttribute}>\n`;
            break;
          case 'hero':
            html += `  <section${classAttribute}${styleAttribute}>\n`;
            html += `    <div class="container">\n`;
            html += `      <h2>${component.heading}</h2>\n`;
            html += `      <p>${component.subheading}</p>\n`;
            html += `      <div class="hero-content">\n`;
            html += `        <div class="hero-text">\n`;
            html += `          <p>${component.content}</p>\n`;
            html += `        </div>\n`;
            html += `        <div class="hero-image">\n`;
            html += `          <img src="${component.imageUrl}" alt="Hero image">\n`;
            html += `        </div>\n`;
            html += `      </div>\n`;
            html += `    </div>\n`;
            html += `  </section>\n`;
            break;
          case 'features':
            html += `  <section${classAttribute}${styleAttribute}>\n`;
            html += `    <div class="container">\n`;
            if (component.items && component.items.length > 0) {
              component.items.forEach(item => {
                html += `      <div class="feature-item">\n`;
                html += `        <h3>${item.title}</h3>\n`;
                html += `        <p>${item.description}</p>\n`;
                html += `      </div>\n`;
              });
            }
            html += `    </div>\n`;
            html += `  </section>\n`;
            break;
          case 'cta':
            html += `  <section${classAttribute}${styleAttribute}>\n`;
            html += `    <div class="container">\n`;
            html += `      <h2>${component.heading}</h2>\n`;
            html += `      <button>${component.buttonText}</button>\n`;
            html += `    </div>\n`;
            html += `  </section>\n`;
            break;
          // Add more component types as needed
        }
      });
      
      // Add basic responsive styles if not using Tailwind
      if (this.outputType !== 'tailwind') {
        html += '  <style>\n';
        html += '    /* Basic responsive styles */\n';
        html += '    .container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 15px; }\n';
        html += '    img { max-width: 100%; height: auto; }\n';
        html += '    @media (min-width: 768px) {\n';
        html += '      .hero-content { display: flex; align-items: center; }\n';
        html += '      .hero-text, .hero-image { width: 50%; }\n';
        html += '      .feature-item { display: inline-block; width: calc(33.333% - 20px); margin: 10px; vertical-align: top; }\n';
        html += '    }\n';
        html += '    @media (max-width: 767px) {\n';
        html += '      .feature-item { margin-bottom: 20px; }\n';
        html += '    }\n';
        html += '  </style>\n';
      }
      
      html += '</body>\n</html>';
      return html;
    },
    
    exportToJSON() {
      return JSON.stringify(this.components, null, 2);
    },
    
    importFromJSON(jsonData) {
      try {
        const data = JSON.parse(jsonData);
        if (Array.isArray(data)) {
          // Save current state for undo
          this.saveState();
          
          this.components = data;
          toast.success('Components imported successfully');
          return true;
        }
        toast.error('Invalid JSON format');
        return false;
      } catch (error) {
        toast.error('Failed to parse JSON');
        console.error('Import error:', error);
        return false;
      }
    },
    
    saveTemplate(name) {
      if (!name || name.trim() === '') {
        toast.error('Template name cannot be empty');
        return;
      }
      
      const newTemplate = {
        id: 'template-' + Date.now(),
        name,
        components: JSON.parse(JSON.stringify(this.components))
      };
      
      this.templates.push(newTemplate);
      toast.success('Template saved');
    },
    
    loadTemplate(templateId) {
      const template = this.templates.find(t => t.id === templateId);
      if (template) {
        // Save current state for undo
        this.saveState();
        
        this.components = JSON.parse(JSON.stringify(template.components));
        toast.success('Template loaded');
      }
    },
    
    deleteTemplate(templateId) {
      const index = this.templates.findIndex(t => t.id === templateId);
      if (index !== -1) {
        this.templates.splice(index, 1);
        toast.success('Template deleted');
      }
    },
    
    clearCanvas() {
      // Save current state for undo
      this.saveState();
      
      this.components = [];
      this.selectedComponent = null;
      toast.info('Canvas cleared');
    }
  },
  
  getters: {
    getSelectedComponent: (state) => {
      if (!state.selectedComponent) return null;
      return state.components.find(c => c.id === state.selectedComponent);
    }
  }
});
