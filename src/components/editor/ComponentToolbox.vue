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
    case 'header':
      component = {
        ...component,
        content: 'Header Text',
        classes: 'text-2xl font-bold p-4 bg-blue-500 text-white text-center',
      };
      break;
    case 'paragraph':
      component = {
        ...component,
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.',
        classes: 'p-4 text-gray-700',
      };
      break;
    case 'heading':
      component = {
        ...component,
        level: 2,
        content: 'Heading',
        classes: 'text-xl font-bold mb-4',
      };
      break;
    case 'button':
      component = {
        ...component,
        content: 'Click Me',
        classes: 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600',
      };
      break;
    case 'image':
      component = {
        ...component,
        src: 'https://placehold.co/400x200/EEE/31343C',
        alt: 'Placeholder Image',
        classes: 'w-full h-auto rounded',
      };
      break;
    case 'hero':
      component = {
        ...component,
        heading: 'Hero Title',
        subheading: 'Subtitle goes here',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.',
        imageUrl: 'https://placehold.co/600x400/EEE/31343C',
        classes: 'flex flex-col md:flex-row items-center justify-between gap-8 py-16 px-4',
      };
      break;
    case 'features':
      component = {
        ...component,
        items: [
          { title: 'Feature 1', description: 'Description of feature 1' },
          { title: 'Feature 2', description: 'Description of feature 2' },
          { title: 'Feature 3', description: 'Description of feature 3' },
        ],
        classes: 'grid grid-cols-1 md:grid-cols-3 gap-8 py-16 px-4',
      };
      break;
    case 'cta':
      component = {
        ...component,
        heading: 'Call to Action',
        buttonText: 'Take Action',
        classes: 'text-center py-16 bg-gray-100',
      };
      break;
    case 'container':
      component = {
        ...component,
        classes: 'container mx-auto p-4',
        children: [],
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
    name: 'Basic',
    components: [
      { type: 'header', icon: 'header', label: 'Header' },
      { type: 'heading', icon: 'heading', label: 'Heading' },
      { type: 'paragraph', icon: 'paragraph', label: 'Paragraph' },
      { type: 'button', icon: 'button', label: 'Button' },
      { type: 'image', icon: 'image', label: 'Image' },
    ]
  },
  {
    name: 'Layout',
    components: [
      { type: 'container', icon: 'container', label: 'Container' },
    ]
  },
  {
    name: 'Sections',
    components: [
      { type: 'hero', icon: 'hero', label: 'Hero' },
      { type: 'features', icon: 'features', label: 'Features' },
      { type: 'cta', icon: 'cta', label: 'Call to Action' },
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
