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
      
      // Find component recursively using the existing findComponentById method
      const component = this.findComponentById(id);
      if (component) {
        Object.assign(component, properties);
      }
    },
    
    updateComponentStyles(id, styleProperties) {
      // Save current state for undo
      this.saveState();
      
      // Find component recursively using the existing findComponentById method
      const component = this.findComponentById(id);
      if (component) {
        // Đảm bảo customStyles tồn tại
        if (!component.customStyles) {
          component.customStyles = {};
        }
        
        // Cập nhật thuộc tính style
        component.customStyles = {
          ...component.customStyles,
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

    addChildToContainer(parentId, childComponent) {
      this.saveState();
      
      // Find parent component and add child
      const parent = this.findComponentById(parentId);
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(childComponent);
        this.selectComponent(childComponent.id);
        toast.success('Component added to container');
      }
    },

    removeChildFromContainer(parentId, childId) {
      this.saveState();
      
      const parent = this.findComponentById(parentId);
      if (parent && parent.children) {
        const index = parent.children.findIndex(child => child.id === childId);
        if (index !== -1) {
          parent.children.splice(index, 1);
          this.selectedComponent = null;
          toast.success('Component removed from container');
        }
      }
    },

    findComponentById(id, componentList = this.components) {
      for (const component of componentList) {
        if (component.id === id) {
          return component;
        }
        if (component.children) {
          const found = this.findComponentById(id, component.children);
          if (found) return found;
        }
      }
      return null;
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
          case 'container':
            html += `  <div${classAttribute}${styleAttribute}>\n`;
            if (component.children && component.children.length > 0) {
              // Handle nested components (simplified for now)
              html += `    <!-- Container with ${component.children.length} children -->\n`;
            } else {
              html += `    <!-- Empty Container -->\n`;
            }
            html += `  </div>\n`;
            break;
          case 'grid':
            html += `  <div${classAttribute}${styleAttribute}>\n`;
            if (component.items && component.items.length > 0) {
              component.items.forEach(item => {
                html += `    <div class="grid-item">${item.content}</div>\n`;
              });
            }
            html += `  </div>\n`;
            break;
          case 'link':
            const target = component.target === '_blank' ? ' target="_blank"' : '';
            html += `  <a href="${component.href}"${target}${classAttribute}${styleAttribute}>${component.content}</a>\n`;
            break;
          case 'dropdown':
            html += `  <select${classAttribute}${styleAttribute}>\n`;
            html += `    <option value="">${component.label}</option>\n`;
            if (component.options && component.options.length > 0) {
              component.options.forEach(option => {
                html += `    <option value="${option.value}">${option.label}</option>\n`;
              });
            }
            html += `  </select>\n`;
            break;
          case 'table':
            html += `  <table${classAttribute}${styleAttribute}>\n`;
            if (component.headers && component.headers.length > 0) {
              html += `    <thead>\n      <tr>\n`;
              component.headers.forEach(header => {
                html += `        <th>${header.content || header}</th>\n`;
              });
              html += `      </tr>\n    </thead>\n`;
            }
            if (component.rows && component.rows.length > 0) {
              html += `    <tbody>\n`;
              component.rows.forEach(row => {
                html += `      <tr>\n`;
                if (row.cells) {
                  row.cells.forEach(cell => {
                    html += `        <td>${cell.content || cell}</td>\n`;
                  });
                } else {
                  row.forEach(cell => {
                    html += `        <td>${cell}</td>\n`;
                  });
                }
                html += `      </tr>\n`;
              });
              html += `    </tbody>\n`;
            }
            html += `  </table>\n`;
            break;
          case 'card':
            html += `  <div${classAttribute}${styleAttribute}>\n`;
            if (component.imageUrl) {
              html += `    <img src="${component.imageUrl}" alt="Card image">\n`;
            }
            html += `    <div class="card-content">\n`;
            html += `      <h3>${component.title}</h3>\n`;
            html += `      <p>${component.content}</p>\n`;
            if (component.buttonText) {
              html += `      <button>${component.buttonText}</button>\n`;
            }
            html += `    </div>\n`;
            html += `  </div>\n`;
            break;
          case 'input':
            html += `  <div${classAttribute}${styleAttribute}>\n`;
            if (component.label) {
              html += `    <label>${component.label}</label>\n`;
            }
            html += `    <input type="${component.inputType || 'text'}" placeholder="${component.placeholder || ''}"${component.required ? ' required' : ''}>\n`;
            html += `  </div>\n`;
            break;
          case 'textarea':
            html += `  <div${classAttribute}${styleAttribute}>\n`;
            if (component.label) {
              html += `    <label>${component.label}</label>\n`;
            }
            html += `    <textarea placeholder="${component.placeholder || ''}" rows="${component.rows || 4}"${component.required ? ' required' : ''}></textarea>\n`;
            html += `  </div>\n`;
            break;
          case 'select':
            html += `  <div${classAttribute}${styleAttribute}>\n`;
            if (component.label) {
              html += `    <label>${component.label}</label>\n`;
            }
            html += `    <select>\n`;
            html += `      <option value="">${component.placeholder || 'Choose an option'}</option>\n`;
            if (component.options && component.options.length > 0) {
              component.options.forEach(option => {
                html += `      <option value="${option.value}">${option.label}</option>\n`;
              });
            }
            html += `    </select>\n`;
            html += `  </div>\n`;
            break;
          case 'grid':
            html += `  <div${classAttribute}${styleAttribute}>\n`;
            if (component.children && component.children.length > 0) {
              component.children.forEach(child => {
                html += this.componentToHTML(child, '', indentLevel + 1);
              });
            } else {
              for (let i = 1; i <= (component.columns || 3); i++) {
                html += `    <div class="grid-item">Grid Item ${i}</div>\n`;
              }
            }
            html += `  </div>\n`;
            break;
          case 'flexbox':
            html += `  <div${classAttribute}${styleAttribute}>\n`;
            if (component.children && component.children.length > 0) {
              component.children.forEach(child => {
                html += this.componentToHTML(child, '', indentLevel + 1);
              });
            } else {
              html += `    <div class="flex-item">Flex Item 1</div>\n`;
              html += `    <div class="flex-item">Flex Item 2</div>\n`;
            }
            html += `  </div>\n`;
            break;
          case 'section':
            html += `  <section${classAttribute}${styleAttribute}>\n`;
            if (component.children && component.children.length > 0) {
              component.children.forEach(child => {
                html += this.componentToHTML(child, '', indentLevel + 1);
              });
            }
            html += `  </section>\n`;
            break;
          case 'navbar':
            html += `  <nav${classAttribute}${styleAttribute}>\n`;
            html += `    <div class="nav-container">\n`;
            html += `      <div class="nav-brand">${component.brand}</div>\n`;
            if (component.items && component.items.length > 0) {
              html += `      <ul class="nav-menu">\n`;
              component.items.forEach(item => {
                html += `        <li><a href="${item.href}">${item.label}</a></li>\n`;
              });
              html += `      </ul>\n`;
            }
            html += `    </div>\n`;
            html += `  </nav>\n`;
            break;
          case 'footer':
            html += `  <footer${classAttribute}${styleAttribute}>\n`;
            html += `    <div class="footer-container">\n`;
            html += `      <div class="footer-brand">${component.brand}</div>\n`;
            if (component.columns && component.columns.length > 0) {
              component.columns.forEach(column => {
                html += `      <div class="footer-column">\n`;
                html += `        <h4>${column.title}</h4>\n`;
                if (column.links && column.links.length > 0) {
                  html += `        <ul>\n`;
                  column.links.forEach(link => {
                    html += `          <li><a href="${link.href}">${link.label}</a></li>\n`;
                  });
                  html += `        </ul>\n`;
                }
                html += `      </div>\n`;
              });
            }
            html += `      <div class="footer-copyright">${component.copyright}</div>\n`;
            html += `    </div>\n`;
            html += `  </footer>\n`;
            break;
          case 'contact':
            html += `  <div${classAttribute}${styleAttribute}>\n`;
            html += `    <h2>${component.title}</h2>\n`;
            html += `    <p>${component.subtitle}</p>\n`;
            html += `    <form>\n`;
            if (component.fields && component.fields.length > 0) {
              component.fields.forEach(field => {
                html += `      <div class="form-group">\n`;
                html += `        <label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>\n`;
                if (field.type === 'textarea') {
                  html += `        <textarea id="${field.name}" name="${field.name}" placeholder="${field.placeholder}"${field.required ? ' required' : ''}></textarea>\n`;
                } else {
                  html += `        <input type="${field.type}" id="${field.name}" name="${field.name}" placeholder="${field.placeholder}"${field.required ? ' required' : ''}>\n`;
                }
                html += `      </div>\n`;
              });
            }
            html += `      <button type="submit">${component.submitText}</button>\n`;
            html += `    </form>\n`;
            html += `  </div>\n`;
            break;
          case 'testimonial':
            html += `  <div${classAttribute}${styleAttribute}>\n`;
            if (component.avatar) {
              html += `    <img src="${component.avatar}" alt="Avatar" class="testimonial-avatar">\n`;
            }
            html += `    <blockquote>"${component.quote}"</blockquote>\n`;
            html += `    <div class="testimonial-author">\n`;
            html += `      <div class="author-name">${component.author}</div>\n`;
            html += `      <div class="author-position">${component.position}</div>\n`;
            if (component.rating) {
              html += `      <div class="rating">${'★'.repeat(component.rating)}${'☆'.repeat(5 - component.rating)}</div>\n`;
            }
            html += `    </div>\n`;
            html += `  </div>\n`;
            break;
          case 'navigation':
            html += `  <nav${classAttribute}${styleAttribute}>\n`;
            html += `    <div class="nav-container">\n`;
            html += `      <div class="nav-brand">${component.brand}</div>\n`;
            if (component.items && component.items.length > 0) {
              html += `      <ul class="nav-menu">\n`;
              component.items.forEach(item => {
                html += `        <li><a href="${item.href}">${item.label}</a></li>\n`;
              });
              html += `      </ul>\n`;
            }
            html += `    </div>\n`;
            html += `  </nav>\n`;
            break;
          case 'form':
            html += `  <form${classAttribute}${styleAttribute}>\n`;
            if (component.title) {
              html += `    <h3>${component.title}</h3>\n`;
            }
            if (component.fields && component.fields.length > 0) {
              component.fields.forEach(field => {
                html += `    <div class="form-group">\n`;
                html += `      <label for="${field.name}">${field.label}</label>\n`;
                if (field.type === 'textarea') {
                  html += `      <textarea id="${field.name}" name="${field.name}" placeholder="${field.placeholder}"></textarea>\n`;
                } else {
                  html += `      <input type="${field.type}" id="${field.name}" name="${field.name}" placeholder="${field.placeholder}">\n`;
                }
                html += `    </div>\n`;
              });
            }
            html += `    <button type="submit">${component.submitText}</button>\n`;
            html += `  </form>\n`;
            break;
          case 'list':
            const listTag = component.listType || 'ul';
            html += `  <${listTag}${classAttribute}${styleAttribute}>\n`;
            if (component.items && component.items.length > 0) {
              component.items.forEach(item => {
                html += `    <li>${item}</li>\n`;
              });
            }
            html += `  </${listTag}>\n`;
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
        html += '    table { border-collapse: collapse; width: 100%; }\n';
        html += '    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }\n';
        html += '    th { background-color: #f4f4f4; font-weight: bold; }\n';
        html += '    .form-group { margin-bottom: 1rem; }\n';
        html += '    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: bold; }\n';
        html += '    .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }\n';
        html += '    .card-content { padding: 1rem; }\n';
        html += '    .nav-container { display: flex; justify-content: space-between; align-items: center; }\n';
        html += '    .nav-menu { list-style: none; display: flex; gap: 1rem; margin: 0; padding: 0; }\n';
        html += '    .nav-menu a { text-decoration: none; color: inherit; }\n';
        html += '    .grid-item { background-color: #f0f0f0; padding: 1rem; border-radius: 4px; }\n';
        html += '    @media (min-width: 768px) {\n';
        html += '      .hero-content { display: flex; align-items: center; }\n';
        html += '      .hero-text, .hero-image { width: 50%; }\n';
        html += '      .feature-item { display: inline-block; width: calc(33.333% - 20px); margin: 10px; vertical-align: top; }\n';
        html += '    }\n';
        html += '    @media (max-width: 767px) {\n';
        html += '      .feature-item { margin-bottom: 20px; }\n';
        html += '      .nav-container { flex-direction: column; }\n';
        html += '      .nav-menu { margin-top: 1rem; }\n';
        html += '      table, th, td { font-size: 0.9rem; }\n';
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
      
      // Use the existing findComponentById method to search recursively
      const findComponent = (id, componentList = state.components) => {
        for (const component of componentList) {
          if (component.id === id) {
            return component;
          }
          if (component.children && component.children.length > 0) {
            const found = findComponent(id, component.children);
            if (found) return found;
          }
        }
        return null;
      };
      
      return findComponent(state.selectedComponent);
    }
  }
});
