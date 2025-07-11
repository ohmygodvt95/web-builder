<script setup>
import { ref } from 'vue';
import { useEditorStore } from '../../stores/editor';

const store = useEditorStore();

// Drag and drop functionality
const handleDragStart = (componentType) => {
  // Create unique ID based on timestamp
  const id = `${componentType}-${Date.now()}`;
  
  // Set default properties based on component type
  let component = {
    id,
    type: componentType,
  };
  
  // Set component-specific default properties
  switch (componentType) {
    // Basic Elements
    case 'paragraph':
      component = {
        ...component,
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.',
        classes: 'p-4 text-gray-700',
        customStyles: {},
      };
      break;
    case 'heading':
      component = {
        ...component,
        level: 2,
        content: 'Heading Text',
        classes: 'text-2xl font-bold mb-4',
        customStyles: {},
      };
      break;
    case 'button':
      component = {
        ...component,
        content: 'Click Me',
        type: 'button',
        classes: 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600',
        customStyles: {},
      };
      break;
    case 'link':
      component = {
        ...component,
        content: 'Link Text',
        href: '#',
        target: '_self',
        classes: 'text-blue-500 hover:text-blue-700 underline',
        customStyles: {},
      };
      break;
    case 'image':
      component = {
        ...component,
        src: 'https://placehold.co/400x200/EEE/31343C',
        alt: 'Placeholder Image',
        classes: 'w-full h-auto rounded',
        customStyles: {},
      };
      break;
    case 'list':
      component = {
        ...component,
        listType: 'ul',
        items: [
          'First list item',
          'Second list item',
          'Third list item',
        ],
        classes: 'list-disc pl-6 space-y-2',
        customStyles: {},
      };
      break;
    case 'input':
      component = {
        ...component,
        inputType: 'text',
        placeholder: 'Enter text here...',
        label: 'Input Label',
        name: 'input-field',
        classes: 'w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500',
        customStyles: {},
      };
      break;
    case 'textarea':
      component = {
        ...component,
        placeholder: 'Enter your message...',
        label: 'Textarea Label',
        name: 'textarea-field',
        rows: 4,
        classes: 'w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500',
        customStyles: {},
      };
      break;
    case 'select':
      component = {
        ...component,
        label: 'Select Label',
        name: 'select-field',
        options: [
          { value: '', label: 'Choose an option...' },
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
          { value: 'option3', label: 'Option 3' },
        ],
        classes: 'w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500',
        customStyles: {},
      };
      break;
    
    // Layout Elements (Container-like elements that can hold other elements)
    case 'container':
      component = {
        ...component,
        children: [],
        classes: 'container mx-auto p-4',
        customStyles: {},
        canContainChildren: true,
      };
      break;
    case 'grid':
      component = {
        ...component,
        children: [],
        columns: 3,
        gap: '16px',
        classes: 'grid grid-cols-3 gap-4 p-4',
        customStyles: {},
        canContainChildren: true,
      };
      break;
    case 'flexbox':
      component = {
        ...component,
        children: [],
        direction: 'row',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        gap: '16px',
        classes: 'flex gap-4 p-4',
        customStyles: {},
        canContainChildren: true,
      };
      break;
    case 'table':
      component = {
        ...component,
        headers: [
          { id: 'header1', content: 'Column 1' },
          { id: 'header2', content: 'Column 2' },
          { id: 'header3', content: 'Column 3' },
        ],
        rows: [
          { 
            id: 'row1', 
            cells: [
              { id: 'cell1-1', content: 'Cell 1-1', children: [] },
              { id: 'cell1-2', content: 'Cell 1-2', children: [] },
              { id: 'cell1-3', content: 'Cell 1-3', children: [] },
            ]
          },
          { 
            id: 'row2', 
            cells: [
              { id: 'cell2-1', content: 'Cell 2-1', children: [] },
              { id: 'cell2-2', content: 'Cell 2-2', children: [] },
              { id: 'cell2-3', content: 'Cell 2-3', children: [] },
            ]
          },
        ],
        classes: 'w-full border-collapse border border-gray-300',
        customStyles: {},
        canContainChildren: true,
      };
      break;
    case 'section':
      component = {
        ...component,
        children: [],
        classes: 'py-8 px-4',
        customStyles: {},
        canContainChildren: true,
      };
      break;
    case 'card':
      component = {
        ...component,
        title: 'Card Title',
        content: 'Card content goes here. You can add any description or information.',
        imageUrl: 'https://placehold.co/300x200/EEE/31343C',
        buttonText: 'Learn More',
        children: [], // Allow custom content in card body
        classes: 'bg-white rounded-lg shadow-md overflow-hidden max-w-sm',
        customStyles: {},
        canContainChildren: true,
      };
      break;
    
    // Pre-built Components
    case 'hero':
      component = {
        ...component,
        heading: 'Hero Title',
        subheading: 'Subtitle goes here',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.',
        imageUrl: 'https://placehold.co/600x400/EEE/31343C',
        buttonText: 'Get Started',
        classes: 'flex flex-col md:flex-row items-center justify-between gap-8 py-16 px-4',
        customStyles: {},
      };
      break;
    case 'navbar':
      component = {
        ...component,
        brand: 'Brand Name',
        items: [
          { id: 'nav1', label: 'Home', href: '#home' },
          { id: 'nav2', label: 'About', href: '#about' },
          { id: 'nav3', label: 'Services', href: '#services' },
          { id: 'nav4', label: 'Contact', href: '#contact' },
        ],
        classes: 'bg-gray-800 text-white p-4',
        customStyles: {},
      };
      break;
    case 'footer':
      component = {
        ...component,
        brand: 'Company Name',
        copyright: '© 2024 Company Name. All rights reserved.',
        columns: [
          {
            id: 'col1',
            title: 'Company',
            links: [
              { id: 'link1', label: 'About Us', href: '#about' },
              { id: 'link2', label: 'Careers', href: '#careers' },
              { id: 'link3', label: 'Contact', href: '#contact' },
            ]
          },
          {
            id: 'col2',
            title: 'Services',
            links: [
              { id: 'link4', label: 'Web Design', href: '#web-design' },
              { id: 'link5', label: 'Development', href: '#development' },
              { id: 'link6', label: 'SEO', href: '#seo' },
            ]
          },
        ],
        classes: 'bg-gray-900 text-white py-12 px-4',
        customStyles: {},
      };
      break;
    case 'contact':
      component = {
        ...component,
        title: 'Contact Us',
        subtitle: 'Get in touch with us',
        fields: [
          { id: 'field1', type: 'text', name: 'name', label: 'Full Name', placeholder: 'Enter your name', required: true },
          { id: 'field2', type: 'email', name: 'email', label: 'Email', placeholder: 'Enter your email', required: true },
          { id: 'field3', type: 'tel', name: 'phone', label: 'Phone', placeholder: 'Enter your phone', required: false },
          { id: 'field4', type: 'textarea', name: 'message', label: 'Message', placeholder: 'Enter your message', required: true },
        ],
        submitText: 'Send Message',
        classes: 'bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto',
        customStyles: {},
      };
      break;
    case 'features':
      component = {
        ...component,
        title: 'Our Features',
        subtitle: 'Discover what makes us different',
        items: [
          { 
            id: 'feature1',
            title: 'Feature 1', 
            description: 'Description of feature 1',
            icon: '🚀'
          },
          { 
            id: 'feature2',
            title: 'Feature 2', 
            description: 'Description of feature 2',
            icon: '⭐'
          },
          { 
            id: 'feature3',
            title: 'Feature 3', 
            description: 'Description of feature 3',
            icon: '💎'
          },
        ],
        classes: 'py-16 px-4',
        customStyles: {},
      };
      break;
    case 'cta':
      component = {
        ...component,
        heading: 'Ready to Get Started?',
        content: 'Join thousands of satisfied customers today.',
        buttonText: 'Get Started Now',
        buttonLink: '#signup',
        classes: 'text-center py-16 bg-blue-600 text-white',
        customStyles: {},
      };
      break;
    case 'testimonial':
      component = {
        ...component,
        quote: 'This is an amazing product that has completely transformed our business!',
        author: 'John Doe',
        position: 'CEO, Company Name',
        avatar: 'https://placehold.co/100x100/EEE/31343C',
        rating: 5,
        classes: 'bg-gray-50 p-8 rounded-lg max-w-2xl mx-auto text-center',
        customStyles: {},
      };
      break;
  }
  
  // Store the component being dragged
  store.setDragging(component);
};

const handleDragEnd = () => {
  if (store.currentlyDragging) {
    // Add component to the canvas
    store.addComponent(store.currentlyDragging);
    // Clear the dragging state
    store.setDragging(null);
  }
};

// Group components by category
const componentCategories = ref([
  {
    name: 'Basic Elements',
    components: [
      { type: 'paragraph', icon: 'paragraph', label: 'Paragraph' },
      { type: 'heading', icon: 'heading', label: 'Heading (H1-H6)' },
      { type: 'button', icon: 'button', label: 'Button' },
      { type: 'link', icon: 'link', label: 'Link' },
      { type: 'image', icon: 'image', label: 'Image' },
      { type: 'list', icon: 'list', label: 'List' },
      { type: 'input', icon: 'input', label: 'Input Field' },
      { type: 'textarea', icon: 'textarea', label: 'Textarea' },
      { type: 'select', icon: 'select', label: 'Select Dropdown' },
    ]
  },
  {
    name: 'Layout Elements',
    components: [
      { type: 'container', icon: 'container', label: 'Container' },
      { type: 'grid', icon: 'grid', label: 'Grid Layout' },
      { type: 'flexbox', icon: 'flexbox', label: 'Flexbox' },
      { type: 'table', icon: 'table', label: 'Table' },
      { type: 'section', icon: 'section', label: 'Section' },
      { type: 'card', icon: 'card', label: 'Card' },
    ]
  },
  {
    name: 'Pre-built Components',
    components: [
      { type: 'hero', icon: 'hero', label: 'Hero Section' },
      { type: 'navbar', icon: 'navbar', label: 'Navigation Bar' },
      { type: 'footer', icon: 'footer', label: 'Footer' },
      { type: 'contact', icon: 'contact', label: 'Contact Form' },
      { type: 'features', icon: 'features', label: 'Features Grid' },
      { type: 'cta', icon: 'cta', label: 'Call to Action' },
      { type: 'testimonial', icon: 'testimonial', label: 'Testimonial' },
    ]
  },
]);
</script>

<template>
  <div class="p-4">
    <h2 class="text-lg font-bold mb-4">Components</h2>
    
    <div v-for="category in componentCategories" :key="category.name" class="mb-6">
      <h3 class="text-sm font-medium text-gray-500 mb-2">{{ category.name }}</h3>
      
      <div class="space-y-2">
        <div
          v-for="component in category.components"
          :key="component.type"
          class="component-item flex items-center p-2 bg-white border border-gray-200 rounded-lg cursor-grab hover:bg-blue-50"
          draggable="true"
          @dragstart="handleDragStart(component.type)"
          @dragend="handleDragEnd"
        >
          <!-- Component icon based on type -->
          <div class="w-8 h-8 mr-3 flex items-center justify-center bg-blue-100 rounded text-blue-600">
            <svg v-if="component.type === 'header'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M13.5 3a.5.5 0 0 1 .5.5V11H2V3.5a.5.5 0 0 1 .5-.5h11zm-11-1A1.5 1.5 0 0 0 1 3.5V12h14V3.5A1.5 1.5 0 0 0 13.5 2h-11zM0 12.5h16a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5z"/>
            </svg>
            <svg v-else-if="component.type === 'paragraph'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
            </svg>
            <svg v-else-if="component.type === 'heading'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M3.75 0a1 1 0 0 1 .8.4l.975 1.3a.5.5 0 0 1 0 .6L.175 9.5a.5.5 0 0 1-.8-.6L4.25 1.5H1.5a.5.5 0 0 1 0-1h3.75A1 1 0 0 1 8 1.5v4.75a.5.5 0 0 1-1 0V2H5.375L1.5 7h3a.5.5 0 0 1 0 1h-3a1 1 0 0 1-.8-1.6L4.5 1H1.732L.97.4A1 1 0 0 1 1.25 0h2.5zM3.5 11V13h-1v1.5a.5.5 0 0 1-1 0V13h-1v-2h3zm4 0V13H9v1.5a.5.5 0 0 1-1 0V13H6v-2h1.5zm4 0V13h1v1.5a.5.5 0 0 1-1 0V13h-1v-2h1z"/>
            </svg>
            <svg v-else-if="component.type === 'button'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
            </svg>
            <svg v-else-if="component.type === 'image'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
              <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
            </svg>
            <svg v-else-if="component.type === 'hero'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .488.609l-1.5 6a.5.5 0 0 1-.488.391H4.5a.5.5 0 0 1-.488-.39l-1.5-6A.5.5 0 0 1 3 0h3.5a.5.5 0 0 1 .488.609L6.5 2.648 7.51.098A.5.5 0 0 1 8 0c.29 0 .552.24.636.608l1.01 4.043L10.5 0h1a.5.5 0 0 1 .488.609l-1.5 6a.5.5 0 0 1-.488.391h-1a.5.5 0 0 1-.488-.39L8 3.68 6.99 9h-.981a.5.5 0 0 1-.488-.39l-1.5-6a.5.5 0 0 1 .49-.61z"/>
              <path d="M3 14.5A1.5 1.5 0 0 1 4.5 13h7a1.5 1.5 0 0 1 0 3h-7A1.5 1.5 0 0 1 3 14.5z"/>
            </svg>
            <svg v-else-if="component.type === 'features'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5.5 10a.5.5 0 0 0 0-1H3v-1h2.5a.5.5 0 0 0 0-1H3V8h2.5a.5.5 0 0 0 0-1H3V6h2.5a.5.5 0 0 0 0-1H3V3.5a.5.5 0 0 0-1 0v8a.5.5 0 0 0 .5.5h3zm6.351-6.839-.849-.849a.5.5 0 0 0-.707 0l-3.5 3.5a.5.5 0 0 0 0 .707l.849.849a.5.5 0 0 0 .707 0l3.5-3.5a.5.5 0 0 0 0-.707zm1.591 1.591-.849-.849a.5.5 0 0 0-.707 0l-3.5 3.5a.5.5 0 0 0 0 .707l.849.849a.5.5 0 0 0 .707 0l3.5-3.5a.5.5 0 0 0 0-.707z"/>
            </svg>
            <svg v-else-if="component.type === 'cta'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
            </svg>
            <svg v-else-if="component.type === 'container'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1z"/>
            </svg>
            <svg v-else-if="component.type === 'grid'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/>
            </svg>
            <svg v-else-if="component.type === 'link'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 9.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/>
              <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 7.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z"/>
            </svg>
            <svg v-else-if="component.type === 'dropdown'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293V2.5zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z"/>
            </svg>
            <svg v-else-if="component.type === 'table'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z"/>
            </svg>
            <svg v-else-if="component.type === 'card'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M2.5 3.5a.5.5 0 0 1 1 0v1.07a7.001 7.001 0 0 1 3.274 12.474.5.5 0 0 1-.548-.952A6.001 6.001 0 0 0 5.5 5.5a.5.5 0 0 1-.5-.5z"/>
              <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2z"/>
            </svg>
            <svg v-else-if="component.type === 'navigation'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M2 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
            </svg>
            <svg v-else-if="component.type === 'form'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm2.625.547a3 3 0 0 0-5.584.953H.5a.5.5 0 0 0 0 1h2.541A3 3 0 0 0 8 10.5a.5.5 0 0 1 1 0 4 4 0 0 1-8 0v-.5H.5a.5.5 0 0 1 0-1h2.541zm-1.168-.9c-.305.084-.57.283-.75.543H1.5a.5.5 0 0 1 0-1h2.957zm9.168.9H16v-1h-1.293L16 4.414v-1.121L14.828 2H10.5a.5.5 0 0 0-.5.5v11a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-6.086z"/>
            </svg>
            <svg v-else-if="component.type === 'list'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
            </svg>
          </div>
          
          <span>{{ component.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.component-item {
  transition: all 0.2s;
}
</style>
