import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { toast } from 'vue3-toastify'
import { generateCSSFromProperties } from '../utils/element-properties'
import beautify from 'html-beautify'

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
      
      // First try to find and remove from root level
      const index = this.components.findIndex(c => c.id === id);
      if (index !== -1) {
        this.components.splice(index, 1);
        this.selectedComponent = null;
        toast.success('Component removed');
        return;
      }
      
      // If not found at root level, search in nested components
      const removeFromChildren = (componentList) => {
        for (let i = 0; i < componentList.length; i++) {
          const component = componentList[i];
          if (component.children) {
            const childIndex = component.children.findIndex(child => child.id === id);
            if (childIndex !== -1) {
              component.children.splice(childIndex, 1);
              this.selectedComponent = null;
              toast.success('Component removed');
              return true;
            }
            // Recursively search in nested children
            if (removeFromChildren(component.children)) {
              return true;
            }
          }
        }
        return false;
      };
      
      removeFromChildren(this.components);
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
        
        // Add custom CSS classes for each component (including nested ones)
        this.getAllComponents().forEach(component => {
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
      
      // Add components recursively
      this.components.forEach(component => {
        html += this.componentToHTML(component, 1);
      });

      // Add basic responsive styles if not using Tailwind
      if (this.outputType !== 'tailwind') {
        html += '\n<style>\n';
        html += '  /* Basic responsive styles */\n';
        html += '  .container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 15px; }\n';
        html += '  img { max-width: 100%; height: auto; }\n';
        html += '  table { border-collapse: collapse; width: 100%; }\n';
        html += '  th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }\n';
        html += '  th { background-color: #f4f4f4; font-weight: bold; }\n';
        html += '  .form-group { margin-bottom: 1rem; }\n';
        html += '  .form-group label { display: block; margin-bottom: 0.5rem; font-weight: bold; }\n';
        html += '  .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }\n';
        html += '  .card-content { padding: 1rem; }\n';
        html += '  .nav-container { display: flex; justify-content: space-between; align-items: center; }\n';
        html += '  .nav-menu { list-style: none; display: flex; gap: 1rem; margin: 0; padding: 0; }\n';
        html += '  .nav-menu a { text-decoration: none; color: inherit; }\n';
        html += '  .grid-item { background-color: #f0f0f0; padding: 1rem; border-radius: 4px; }\n';
        html += '  .testimonial-content { text-align: center; }\n';
        html += '  .rating { margin-bottom: 1rem; }\n';
        html += '  .star { color: #fbbf24; font-size: 1.25rem; }\n';
        html += '  .author-info { display: flex; align-items: center; justify-content: center; margin-top: 1rem; }\n';
        html += '  .avatar { width: 3rem; height: 3rem; border-radius: 50%; margin-right: 1rem; }\n';
        html += '  .author-name { font-weight: bold; }\n';
        html += '  .author-position { color: #6b7280; }\n';
        html += '  blockquote { font-style: italic; font-size: 1.125rem; margin: 1rem 0; }\n';
        html += '  @media (min-width: 768px) {\n';
        html += '    .hero-content { display: flex; align-items: center; }\n';
        html += '    .hero-text, .hero-image { width: 50%; }\n';
        html += '    .feature-item { display: inline-block; width: calc(33.333% - 20px); margin: 10px; vertical-align: top; }\n';
        html += '  }\n';
        html += '  @media (max-width: 767px) {\n';
        html += '    .feature-item { margin-bottom: 20px; }\n';
        html += '    .nav-container { flex-direction: column; }\n';
        html += '    .nav-menu { margin-top: 1rem; }\n';
        html += '    table, th, td { font-size: 0.9rem; }\n';
        html += '  }\n';
        html += '</style>\n';
      }
      
      html += '</body>\n</html>';

      return beautify(html, { indent_size: 2 });
    },

    // Helper method to get all components including nested ones
    getAllComponents() {
      const allComponents = [];
      
      const collectComponents = (componentList) => {
        componentList.forEach(component => {
          allComponents.push(component);
          if (component.children && component.children.length > 0) {
            collectComponents(component.children);
          }
        });
      };
      
      collectComponents(this.components);
      return allComponents;
    },

    // Helper method to convert a single component to HTML with nested support
    componentToHTML(component, indentLevel = 1) {
      const indent = '  '.repeat(indentLevel);
      let html = '';
      
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
              const kebabKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
              return `${kebabKey}: ${value}`;
            })
            .join('; ');
          styleAttribute = styleStr ? ` style="${styleStr}"` : '';
        }
      }

      switch (component.type) {
        case 'header':
          html += `${indent}<header${classAttribute}${styleAttribute}>${component.content}</header>\n`;
          break;
        case 'paragraph':
          html += `${indent}<p${classAttribute}${styleAttribute}>${component.content}</p>\n`;
          break;
        case 'heading':
          const level = component.level || 1;
          html += `${indent}<h${level}${classAttribute}${styleAttribute}>${component.content}</h${level}>\n`;
          break;
        case 'button':
          html += `${indent}<button${classAttribute}${styleAttribute}>${component.content}</button>\n`;
          break;
        case 'image':
          html += `${indent}<img src="${component.src}" alt="${component.alt || ''}"${classAttribute}${styleAttribute}>\n`;
          break;
        case 'link':
          const target = component.target === '_blank' ? ' target="_blank"' : '';
          html += `${indent}<a href="${component.href}"${target}${classAttribute}${styleAttribute}>${component.content}</a>\n`;
          break;
        case 'container':
          html += `${indent}<div${classAttribute}${styleAttribute}>\n`;
          if (component.children && component.children.length > 0) {
            component.children.forEach(child => {
              html += this.componentToHTML(child, indentLevel + 1);
            });
          }
          html += `${indent}</div>\n`;
          break;
        case 'grid':
          html += `${indent}<div${classAttribute}${styleAttribute}>\n`;
          if (component.children && component.children.length > 0) {
            component.children.forEach(child => {
              html += this.componentToHTML(child, indentLevel + 1);
            });
          }
          html += `${indent}</div>\n`;
          break;
        case 'flexbox':
          html += `${indent}<div${classAttribute}${styleAttribute}>\n`;
          if (component.children && component.children.length > 0) {
            component.children.forEach(child => {
              html += this.componentToHTML(child, indentLevel + 1);
            });
          }
          html += `${indent}</div>\n`;
          break;
        case 'section':
          html += `${indent}<section${classAttribute}${styleAttribute}>\n`;
          if (component.children && component.children.length > 0) {
            component.children.forEach(child => {
              html += this.componentToHTML(child, indentLevel + 1);
            });
          }
          html += `${indent}</section>\n`;
          break;
        case 'input':
          html += `${indent}<div${classAttribute}${styleAttribute}>\n`;
          if (component.label) {
            html += `${indent}  <label>${component.label}</label>\n`;
          }
          html += `${indent}  <input type="${component.inputType || 'text'}" placeholder="${component.placeholder || ''}"${component.required ? ' required' : ''}>\n`;
          html += `${indent}</div>\n`;
          break;
        case 'textarea':
          html += `${indent}<div${classAttribute}${styleAttribute}>\n`;
          if (component.label) {
            html += `${indent}  <label>${component.label}</label>\n`;
          }
          html += `${indent}  <textarea placeholder="${component.placeholder || ''}" rows="${component.rows || 4}"${component.required ? ' required' : ''}></textarea>\n`;
          html += `${indent}</div>\n`;
          break;
        case 'select':
          html += `${indent}<div${classAttribute}${styleAttribute}>\n`;
          if (component.label) {
            html += `${indent}  <label>${component.label}</label>\n`;
          }
          html += `${indent}  <select>\n`;
          html += `${indent}    <option value="">${component.placeholder || 'Choose an option'}</option>\n`;
          if (component.options && component.options.length > 0) {
            component.options.forEach(option => {
              html += `${indent}    <option value="${option.value}">${option.label}</option>\n`;
            });
          }
          html += `${indent}  </select>\n`;
          html += `${indent}</div>\n`;
          break;
        case 'hero':
          html += `${indent}<section${classAttribute}${styleAttribute}>\n`;
          html += `${indent}  <div class="container">\n`;
          html += `${indent}    <h2>${component.heading}</h2>\n`;
          html += `${indent}    <p>${component.subheading}</p>\n`;
          html += `${indent}    <div class="hero-content">\n`;
          html += `${indent}      <div class="hero-text">\n`;
          html += `${indent}        <p>${component.content}</p>\n`;
          html += `${indent}      </div>\n`;
          html += `${indent}      <div class="hero-image">\n`;
          html += `${indent}        <img src="${component.imageUrl}" alt="Hero image">\n`;
          html += `${indent}      </div>\n`;
          html += `${indent}    </div>\n`;
          html += `${indent}  </div>\n`;
          html += `${indent}</section>\n`;
          break;
        case 'features':
          html += `${indent}<section${classAttribute}${styleAttribute}>\n`;
          html += `${indent}  <div class="container">\n`;
          if (component.items && component.items.length > 0) {
            component.items.forEach(item => {
              html += `${indent}    <div class="feature-item">\n`;
              html += `${indent}      <h3>${item.title}</h3>\n`;
              html += `${indent}      <p>${item.description}</p>\n`;
              html += `${indent}    </div>\n`;
            });
          }
          html += `${indent}  </div>\n`;
          html += `${indent}</section>\n`;
          break;
        case 'cta':
          html += `${indent}<section${classAttribute}${styleAttribute}>\n`;
          html += `${indent}  <div class="container">\n`;
          html += `${indent}    <h2>${component.heading}</h2>\n`;
          html += `${indent}    <button>${component.buttonText}</button>\n`;
          html += `${indent}  </div>\n`;
          html += `${indent}</section>\n`;
          break;
        case 'card':
          html += `${indent}<div${classAttribute}${styleAttribute}>\n`;
          if (component.imageUrl) {
            html += `${indent}  <img src="${component.imageUrl}" alt="Card image">\n`;
          }
          html += `${indent}  <div class="card-content">\n`;
          html += `${indent}    <h3>${component.title}</h3>\n`;
          html += `${indent}    <p>${component.content}</p>\n`;
          if (component.buttonText) {
            html += `${indent}    <button>${component.buttonText}</button>\n`;
          }
          html += `${indent}  </div>\n`;
          html += `${indent}</div>\n`;
          break;
        case 'navbar':
          html += `${indent}<nav${classAttribute}${styleAttribute}>\n`;
          html += `${indent}  <div class="nav-container">\n`;
          html += `${indent}    <div class="nav-brand">${component.brand}</div>\n`;
          if (component.items && component.items.length > 0) {
            html += `${indent}    <ul class="nav-menu">\n`;
            component.items.forEach(item => {
              html += `${indent}      <li><a href="${item.href}">${item.label}</a></li>\n`;
            });
            html += `${indent}    </ul>\n`;
          }
          html += `${indent}  </div>\n`;
          html += `${indent}</nav>\n`;
          break;
        case 'footer':
          html += `${indent}<footer${classAttribute}${styleAttribute}>\n`;
          html += `${indent}  <div class="footer-container">\n`;
          html += `${indent}    <div class="footer-brand">${component.brand}</div>\n`;
          if (component.columns && component.columns.length > 0) {
            component.columns.forEach(column => {
              html += `${indent}    <div class="footer-column">\n`;
              html += `${indent}      <h4>${column.title}</h4>\n`;
              if (column.links && column.links.length > 0) {
                html += `${indent}      <ul>\n`;
                column.links.forEach(link => {
                  html += `${indent}        <li><a href="${link.href}">${link.label}</a></li>\n`;
                });
                html += `${indent}      </ul>\n`;
              }
              html += `${indent}    </div>\n`;
            });
          }
          html += `${indent}    <div class="footer-copyright">${component.copyright}</div>\n`;
          html += `${indent}  </div>\n`;
          html += `${indent}</footer>\n`;
          break;
        case 'table':
          html += `${indent}<table${classAttribute}${styleAttribute}>\n`;
          if (component.headers && component.headers.length > 0) {
            html += `${indent}  <thead>\n${indent}    <tr>\n`;
            component.headers.forEach(header => {
              html += `${indent}      <th>${header.content || header}</th>\n`;
            });
            html += `${indent}    </tr>\n${indent}  </thead>\n`;
          }
          if (component.rows && component.rows.length > 0) {
            html += `${indent}  <tbody>\n`;
            component.rows.forEach(row => {
              html += `${indent}    <tr>\n`;
              if (row.cells) {
                row.cells.forEach(cell => {
                  html += `${indent}      <td>${cell.content || cell}</td>\n`;
                });
              } else {
                row.forEach(cell => {
                  html += `${indent}      <td>${cell}</td>\n`;
                });
              }
              html += `${indent}    </tr>\n`;
            });
            html += `${indent}  </tbody>\n`;
          }
          html += `${indent}</table>\n`;
          break;
        case 'list':
          const listTag = component.listType || 'ul';
          html += `${indent}<${listTag}${classAttribute}${styleAttribute}>\n`;
          if (component.items && component.items.length > 0) {
            component.items.forEach(item => {
              html += `${indent}  <li>${item}</li>\n`;
            });
          } else {
            // Default items if none exist
            ['List item 1', 'List item 2', 'List item 3'].forEach(item => {
              html += `${indent}  <li>${item}</li>\n`;
            });
          }
          html += `${indent}</${listTag}>\n`;
          break;
        case 'contact':
          html += `${indent}<div${classAttribute}${styleAttribute}>\n`;
          html += `${indent}  <h2>${component.title || 'Contact Us'}</h2>\n`;
          html += `${indent}  <p>${component.subtitle || 'Get in touch with us'}</p>\n`;
          html += `${indent}  <form>\n`;
          html += `${indent}    <input type="text" placeholder="Name" required>\n`;
          html += `${indent}    <input type="email" placeholder="Email" required>\n`;
          html += `${indent}    <textarea placeholder="Message" rows="4" required></textarea>\n`;
          html += `${indent}    <button type="submit">${component.submitText || 'Send Message'}</button>\n`;
          html += `${indent}  </form>\n`;
          html += `${indent}</div>\n`;
          break;
        case 'testimonial':
          html += `${indent}<div${classAttribute}${styleAttribute}>\n`;
          html += `${indent}  <div class="testimonial-content">\n`;
          // Add star rating
          const rating = component.rating || 5;
          html += `${indent}    <div class="rating">\n`;
          for (let i = 0; i < rating; i++) {
            html += `${indent}      <span class="star">★</span>\n`;
          }
          html += `${indent}    </div>\n`;
          html += `${indent}    <blockquote>"${component.quote || 'Great testimonial quote goes here.'}"</blockquote>\n`;
          html += `${indent}    <div class="author-info">\n`;
          if (component.avatar) {
            html += `${indent}      <img src="${component.avatar}" alt="${component.author}" class="avatar">\n`;
          }
          html += `${indent}      <div class="author-details">\n`;
          html += `${indent}        <div class="author-name">${component.author || 'Customer Name'}</div>\n`;
          html += `${indent}        <div class="author-position">${component.position || 'Customer Title'}</div>\n`;
          html += `${indent}      </div>\n`;
          html += `${indent}    </div>\n`;
          html += `${indent}  </div>\n`;
          html += `${indent}</div>\n`;
          break;
        // Add other component types as needed...
        default:
          html += `${indent}<!-- Unknown component type: ${component.type} -->\n`;
          break;
      }
      
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
