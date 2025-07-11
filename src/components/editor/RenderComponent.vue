<script setup>
import { defineProps, computed, ref, onMounted, nextTick, watch } from 'vue';
import { useEditorStore } from '../../stores/editor';
import Sortable from 'sortablejs';

const store = useEditorStore();
const props = defineProps({
  component: {
    type: Object,
    required: true
  }
});

// Hover management for controls
const hoveredComponent = ref(null);

const handleComponentHover = (componentId, event) => {
  event.stopPropagation();
  hoveredComponent.value = componentId;
};

const handleComponentLeave = (componentId, event) => {
  event.stopPropagation();
  if (hoveredComponent.value === componentId) {
    hoveredComponent.value = null;
  }
};

const componentStyle = computed(() => {
  if (store.isPreviewMode || store.outputType !== 'tailwind') {
    if (store.outputType === 'inline-styles' && props.component.customStyles) {
      return props.component.customStyles;
    }
    return {};
  }
  return {};
});

const componentClasses = computed(() => {
  if (store.outputType === 'tailwind' || !store.isPreviewMode) {
    return props.component.classes || '';
  } else if (store.outputType === 'css-classes') {
    return `component-${props.component.id}`;
  }
  return '';
});

const removeChildComponent = (parentId, childId) => {
  store.removeChildFromContainer(parentId, childId);
};

const handleContainerDrop = (event, containerId) => {
  event.stopPropagation();
  event.preventDefault();
  
  // Only handle drops from toolbox (new components), not from sortable drag operations
  if (store.currentlyDragging && !store.currentlyDragging.from) {
    store.addChildToContainer(containerId, store.currentlyDragging);
    store.setDragging(null);
  }
};

const handleDragOver = (event) => {
  event.preventDefault();
  event.stopPropagation();
};

// Setup sortable for container elements
const setupContainerSortable = async () => {
  await nextTick();
  
  // Find all container elements and setup sortable
  const containerElements = document.querySelectorAll('[data-container-id]');
  
  containerElements.forEach(container => {
    const containerId = container.getAttribute('data-container-id');
    
    // Destroy existing sortable if exists
    if (container.sortable) {
      container.sortable.destroy();
    }
    
    // Create new sortable instance
    container.sortable = Sortable.create(container, {
      animation: 150,
      handle: '.component-handle',
      ghostClass: 'bg-gray-100',
      group: 'nested',
      filter: '.no-drag', // Exclude elements with no-drag class
      preventOnFilter: false,
      onStart: (evt) => {
        // Prevent drag/drop handler from interfering
        store.setDragging(null);
      },
      onEnd: (evt) => {
        // Handle reordering within same container
        if (evt.from === evt.to) {
          const parent = store.findComponentById(containerId);
          if (parent && parent.children && evt.oldIndex !== evt.newIndex) {
            // Save state for undo/redo
            store.saveState();
            
            // Move the component
            const movedComponent = parent.children.splice(evt.oldIndex, 1)[0];
            parent.children.splice(evt.newIndex, 0, movedComponent);
          }
        }
      }
    });
  });
};

onMounted(() => {
  setupContainerSortable();
});

// Watch for changes in component children and re-setup sortable
watch(() => props.component.children, () => {
  setupContainerSortable();
}, { deep: true });
</script>

<template>
  <div 
    class="component-wrapper relative"
    @mouseenter="handleComponentHover(component.id, $event)"
    @mouseleave="handleComponentLeave(component.id, $event)"
  >
    <!-- Control buttons for the main component -->
    <div 
      v-if="!store.isPreviewMode"
      class="component-handle absolute top-0 left-0 -mt-4 -ml-4 bg-blue-500 text-white p-1 rounded cursor-move z-10 transition-opacity" 
      :style="{ opacity: hoveredComponent === component.id ? 1 : 0 }"
    >
      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 3L8.59 4.41 13.17 9H3v2h10.17l-4.58 4.59L10 17l6-6z"></path>
      </svg>
    </div>
    
    <button 
      v-if="!store.isPreviewMode"
      @click="store.removeComponent(component.id)"
      class="absolute top-0 right-0 -mt-4 -mr-4 bg-red-500 text-white p-1 rounded z-10 transition-opacity" 
      :style="{ opacity: hoveredComponent === component.id ? 1 : 0 }"
    >
      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
      </svg>
    </button>

    <header v-if="component.type === 'header'" :class="componentClasses" :style="componentStyle">
      {{ component.content }}
    </header>
    
    <p v-else-if="component.type === 'paragraph'" :class="componentClasses" :style="componentStyle">
      {{ component.content }}
    </p>
    
    <component 
      v-else-if="component.type === 'heading'"
      :is="`h${component.level || 1}`"
      :class="componentClasses"
      :style="componentStyle"
    >
      {{ component.content }}
    </component>
    
    <button v-else-if="component.type === 'button'" :class="componentClasses" :style="componentStyle">
      {{ component.content }}
    </button>
    
    <img 
      v-else-if="component.type === 'image'" 
      :src="component.src"
      :alt="component.alt"
      :class="componentClasses"
      :style="componentStyle"
    />
    
    <a 
      v-else-if="component.type === 'link'" 
      :class="componentClasses"
      :style="componentStyle"
      :href="component.href || '#'"
      :target="component.target || '_self'"
    >
      {{ component.content || 'Link Text' }}
    </a>

    <div v-else-if="component.type === 'input'" :class="componentClasses" :style="componentStyle">
      <label v-if="component.label" class="block text-sm font-medium text-gray-700 mb-1">
        {{ component.label }}
      </label>
      <input 
        :type="component.inputType || 'text'"
        :placeholder="component.placeholder || ''"
        :required="component.required"
        class="w-full p-2 border border-gray-300 rounded"
      />
    </div>

    <div v-else-if="component.type === 'textarea'" :class="componentClasses" :style="componentStyle">
      <label v-if="component.label" class="block text-sm font-medium text-gray-700 mb-1">
        {{ component.label }}
      </label>
      <textarea 
        :placeholder="component.placeholder || ''"
        :rows="component.rows || 4"
        :required="component.required"
        class="w-full p-2 border border-gray-300 rounded"
      ></textarea>
    </div>

    <div v-else-if="component.type === 'select'" :class="componentClasses" :style="componentStyle">
      <label v-if="component.label" class="block text-sm font-medium text-gray-700 mb-1">
        {{ component.label }}
      </label>
      <select class="w-full p-2 border border-gray-300 rounded">
        <option value="">{{ component.placeholder || 'Choose an option' }}</option>
        <option v-for="option in component.options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>

    <table v-else-if="component.type === 'table'" :class="componentClasses" :style="componentStyle">
      <thead v-if="component.headers">
        <tr>
          <th v-for="header in component.headers" :key="header.id" class="border border-gray-300 px-4 py-2">
            {{ header.content }}
          </th>
        </tr>
      </thead>
      <tbody v-if="component.rows">
        <tr v-for="row in component.rows" :key="row.id">
          <td v-for="cell in row.cells" :key="cell.id" class="border border-gray-300 px-4 py-2">
            {{ cell.content }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Container Component -->
    <div 
      v-else-if="component.type === 'container'" 
      :class="componentClasses"
      :style="componentStyle"
      @drop="handleContainerDrop($event, component.id)"
      @dragover="handleDragOver"
      :data-container-id="component.id"
    >
      <template v-if="component.children && component.children.length">
        <div 
          v-for="child in component.children" 
          :key="child.id" 
          class="relative component-wrapper mb-2"
          :class="{'component-selected': child.id === store.selectedComponent}"
          @click.stop="store.selectComponent(child.id)"
        >
          <div class="component-handle absolute top-0 left-0 -mt-4 -ml-4 bg-blue-500 text-white p-1 rounded cursor-move z-10 transition-opacity" :style="{ opacity: hoveredComponent === child.id ? 1 : 0 }">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
            </svg>
          </div>
          <button 
            class="absolute top-0 right-0 -mt-4 -mr-4 bg-red-500 text-white p-1 rounded z-10 transition-opacity" :style="{ opacity: hoveredComponent === child.id ? 1 : 0 }"
            @click.stop="removeChildComponent(component.id, child.id)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
          <RenderComponent :component="child" />
        </div>
      </template>
      <div v-else class="p-8 border-2 border-dashed border-gray-300 text-gray-400 text-center min-h-[120px] flex items-center justify-center">
        Container (drop components here)
      </div>
    </div>

    <!-- Flexbox Layout Component -->
    <div 
      v-else-if="component.type === 'flexbox'" 
      :class="componentClasses"
      :style="componentStyle"
      @drop="handleContainerDrop($event, component.id)"
      @dragover="handleDragOver"
      :data-container-id="component.id"
    >
      <template v-if="component.children && component.children.length">
        <div 
          v-for="child in component.children" 
          :key="child.id" 
          class="relative component-wrapper mb-2"
          :class="{'component-selected': child.id === store.selectedComponent}"
          @click.stop="store.selectComponent(child.id)"
        >
          <div class="component-handle absolute top-0 left-0 -mt-4 -ml-4 bg-blue-500 text-white p-1 rounded cursor-move z-10 transition-opacity" :style="{ opacity: hoveredComponent === child.id ? 1 : 0 }">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
            </svg>
          </div>
          <button 
            class="absolute top-0 right-0 -mt-4 -mr-4 bg-red-500 text-white p-1 rounded z-10 transition-opacity" :style="{ opacity: hoveredComponent === child.id ? 1 : 0 }"
            @click.stop="removeChildComponent(component.id, child.id)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
          <RenderComponent :component="child" />
        </div>
      </template>
      <div v-else class="flex gap-4 p-4 min-h-[100px] border-2 border-dashed border-gray-300">
        <div class="flex-1 border-2 border-dashed border-gray-300 p-4 rounded text-center text-gray-400 min-h-[80px] flex items-center justify-center">
          Flex Item 1 (drop here)
        </div>
        <div class="flex-1 border-2 border-dashed border-gray-300 p-4 rounded text-center text-gray-400 min-h-[80px] flex items-center justify-center">
          Flex Item 2 (drop here)
        </div>
      </div>
    </div>

    <!-- Section Component -->
    <section 
      v-else-if="component.type === 'section'" 
      :class="componentClasses"
      :style="componentStyle"
      @drop="handleContainerDrop($event, component.id)"
      @dragover="handleDragOver"
      :data-container-id="component.id"
    >
      <template v-if="component.children && component.children.length">
        <div 
          v-for="child in component.children" 
          :key="child.id" 
          class="relative component-wrapper mb-2"
          :class="{'component-selected': child.id === store.selectedComponent}"
          @click.stop="store.selectComponent(child.id)"
        >
          <div class="component-handle absolute top-0 left-0 -mt-4 -ml-4 bg-blue-500 text-white p-1 rounded cursor-move z-10 transition-opacity" :style="{ opacity: hoveredComponent === child.id ? 1 : 0 }">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
            </svg>
          </div>
          <button 
            class="absolute top-0 right-0 -mt-4 -mr-4 bg-red-500 text-white p-1 rounded z-10 transition-opacity" :style="{ opacity: hoveredComponent === child.id ? 1 : 0 }"
            @click.stop="removeChildComponent(component.id, child.id)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
          <RenderComponent :component="child" />
        </div>
      </template>
      <div v-else class="p-8 border-2 border-dashed border-gray-300 text-gray-400 text-center min-h-[120px] flex items-center justify-center">
        Section (drop components here)
      </div>
    </section>

    <!-- Card Component -->
    <div v-else-if="component.type === 'card'" :class="componentClasses" :style="componentStyle">
      <img v-if="component.imageUrl" :src="component.imageUrl" :alt="component.title" class="w-full h-48 object-cover" />
      <div class="p-4">
        <h3 class="text-lg font-bold mb-2">{{ component.title || 'Card Title' }}</h3>
        <p class="text-gray-600 mb-4">{{ component.content || 'Card content goes here...' }}</p>
        <button v-if="component.buttonText" class="bg-blue-500 text-white px-4 py-2 rounded">
          {{ component.buttonText }}
        </button>
      </div>
    </div>

    <!-- List Component -->
    <component 
      v-else-if="component.type === 'list'" 
      :is="component.listType || 'ul'"
      :class="componentClasses"
      :style="componentStyle"
    >
      <li v-for="(item, index) in component.items || ['List item 1', 'List item 2', 'List item 3']" :key="index" class="mb-1">
        {{ item }}
      </li>
    </component>

    <!-- Hero Component -->
    <section v-else-if="component.type === 'hero'" :class="componentClasses" :style="componentStyle">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="text-4xl font-bold mb-4">{{ component.heading || 'Hero Title' }}</h1>
          <h2 class="text-xl text-gray-600 mb-4">{{ component.subheading || 'Hero Subtitle' }}</h2>
          <p class="text-gray-700 mb-6">{{ component.content || 'Hero description text goes here.' }}</p>
          <button v-if="component.buttonText" class="bg-blue-500 text-white px-6 py-3 rounded">
            {{ component.buttonText }}
          </button>
        </div>
        <div v-if="component.imageUrl" class="hero-image">
          <img :src="component.imageUrl" alt="Hero image" class="w-full h-auto" />
        </div>
      </div>
    </section>

    <!-- Features Component -->
    <section v-else-if="component.type === 'features'" :class="componentClasses" :style="componentStyle">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold mb-4">{{ component.title || 'Features' }}</h2>
        <p class="text-gray-600">{{ component.subtitle || 'Our amazing features' }}</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="item in component.items || []" :key="item.id" class="text-center">
          <div class="text-4xl mb-4">{{ item.icon || '⭐' }}</div>
          <h3 class="text-xl font-bold mb-2">{{ item.title || 'Feature Title' }}</h3>
          <p class="text-gray-600">{{ item.description || 'Feature description' }}</p>
        </div>
      </div>
    </section>

    <!-- CTA Component -->
    <section v-else-if="component.type === 'cta'" :class="componentClasses" :style="componentStyle">
      <div class="text-center">
        <h2 class="text-3xl font-bold mb-4">{{ component.heading || 'Call to Action' }}</h2>
        <p class="text-gray-600 mb-6">{{ component.content || 'Call to action description' }}</p>
        <button class="bg-blue-500 text-white px-6 py-3 rounded">
          {{ component.buttonText || 'Get Started' }}
        </button>
      </div>
    </section>

    <!-- Navbar Component -->
    <nav v-else-if="component.type === 'navbar'" :class="componentClasses" :style="componentStyle">
      <div class="nav-container flex justify-between items-center">
        <div class="nav-brand font-bold text-lg">{{ component.brand || 'Brand' }}</div>
        <ul class="nav-menu flex space-x-4" v-if="component.items">
          <li v-for="item in component.items" :key="item.id">
            <a :href="item.href" class="hover:text-blue-500">{{ item.label }}</a>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Footer Component -->
    <footer v-else-if="component.type === 'footer'" :class="componentClasses" :style="componentStyle">
      <div class="footer-container text-center">
        <div class="footer-brand font-bold text-lg mb-4">{{ component.brand || 'Brand' }}</div>
        <p class="text-gray-600">{{ component.copyright || '© 2024 All rights reserved' }}</p>
      </div>
    </footer>

    <!-- Contact Form Component -->
    <div v-else-if="component.type === 'contact'" :class="componentClasses" :style="componentStyle">
      <h2 class="text-2xl font-bold mb-2">{{ component.title || 'Contact Us' }}</h2>
      <p class="text-gray-600 mb-6">{{ component.subtitle || 'Get in touch with us' }}</p>
      <form class="space-y-4">
        <input type="text" placeholder="Name" class="w-full p-3 border border-gray-300 rounded" />
        <input type="email" placeholder="Email" class="w-full p-3 border border-gray-300 rounded" />
        <textarea placeholder="Message" rows="4" class="w-full p-3 border border-gray-300 rounded"></textarea>
        <button type="submit" class="bg-blue-500 text-white px-6 py-3 rounded">
          {{ component.submitText || 'Send Message' }}
        </button>
      </form>
    </div>

    <!-- Testimonial Component -->
    <div v-else-if="component.type === 'testimonial'" :class="componentClasses" :style="componentStyle">
      <div class="text-center">
        <div class="mb-4">
          <span v-for="i in (component.rating || 5)" :key="i" class="text-yellow-400 text-xl">★</span>
        </div>
        <blockquote class="text-lg italic mb-4">"{{ component.quote || 'Great testimonial quote goes here.' }}"</blockquote>
        <div class="flex items-center justify-center">
          <img v-if="component.avatar" :src="component.avatar" :alt="component.author" class="w-12 h-12 rounded-full mr-4" />
          <div>
            <div class="font-bold">{{ component.author || 'Customer Name' }}</div>
            <div class="text-gray-600">{{ component.position || 'Customer Title' }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="p-4 bg-red-100 text-red-600 rounded">
      Unknown component type: {{ component.type }}
    </div>
  </div>
</template>

<style scoped>
.component-preview {
  position: relative;
  width: 100%;
}

.component-wrapper {
  position: relative;
  transition: all 0.2s;
}

.component-wrapper:hover {
  outline: 2px dashed #93c5fd;
}

.component-selected {
  outline: 2px solid #3b82f6;
}

.component-handle {
  cursor: move;
  z-index: 10;
}
</style>
