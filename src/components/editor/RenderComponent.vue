<script setup>
import { defineProps, computed } from 'vue';
import { useEditorStore } from '../../stores/editor';

const store = useEditorStore();
const props = defineProps({
  component: {
    type: Object,
    required: true
  }
});

// Compute styling based on store's output type and preview mode
const componentStyle = computed(() => {
  if (store.isPreviewMode || store.outputType !== 'tailwind') {
    if (store.outputType === 'inline-styles' && props.component.customStyles) {
      return props.component.customStyles;
    }
    return {};
  }
  return {};
});

// Determine which classes to apply based on the output type
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

// Handle drop for container components
const handleContainerDrop = (event, containerId) => {
  event.stopPropagation();
  event.preventDefault();
  
  if (store.currentlyDragging) {
    store.addChildToContainer(containerId, store.currentlyDragging);
    store.setDragging(null);
  }
};

const handleDragOver = (event) => {
  event.preventDefault();
  event.stopPropagation();
};
</script>

<template>
  <div class="component-preview">
    <!-- Header Component -->
    <header 
      v-if="component.type === 'header'" 
      :class="componentClasses"
      :style="componentStyle"
    >
      {{ component.content }}
    </header>
    
    <!-- Paragraph Component -->
    <p 
      v-else-if="component.type === 'paragraph'" 
      :class="componentClasses"
      :style="componentStyle"
    >
      {{ component.content }}
    </p>
    
    <!-- Heading Component -->
    <component
      v-else-if="component.type === 'heading'"
      :is="'h' + (component.level || 1)"
      :class="componentClasses"
      :style="componentStyle"
    >
      {{ component.content }}
    </component>
    
    <!-- Button Component -->
    <button 
      v-else-if="component.type === 'button'" 
      :class="componentClasses"
      :style="componentStyle"
    >
      {{ component.content }}
    </button>
    
    <!-- Image Component -->
    <img
      v-else-if="component.type === 'image'"
      :src="component.src"
      :alt="component.alt || ''"
      :class="componentClasses"
      :style="componentStyle"
    >
    
    <!-- Hero Component -->
    <section 
      v-else-if="component.type === 'hero'" 
      :class="componentClasses"
      :style="componentStyle"
    >
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-4">{{ component.heading }}</h2>
        <p class="text-xl mb-8">{{ component.subheading }}</p>
        <div class="flex flex-col md:flex-row">
          <div class="md:w-1/2 mb-8 md:mb-0">
            <p>{{ component.content }}</p>
          </div>
          <div class="md:w-1/2">
            <img :src="component.imageUrl" alt="Hero image" class="w-full h-auto rounded">
          </div>
        </div>
      </div>
    </section>
    
    <!-- Features Component -->
    <section 
      v-else-if="component.type === 'features'" 
      :class="componentClasses"
      :style="componentStyle"
    >
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="(item, index) in component.items" :key="index" class="bg-white p-6 rounded shadow">
            <h3 class="text-xl font-bold mb-2">{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Call to Action Component -->
    <section 
      v-else-if="component.type === 'cta'" 
      :class="componentClasses"
      :style="componentStyle"
    >
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-8">{{ component.heading }}</h2>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          {{ component.buttonText }}
        </button>
      </div>
    </section>
    
    <!-- Container Component -->
    <div 
      v-else-if="component.type === 'container'" 
      :class="componentClasses"
      :style="componentStyle"
      @drop="handleContainerDrop($event, component.id)"
      @dragover="handleDragOver"
    >
      <template v-if="component.children && component.children.length">
        <div 
          v-for="child in component.children" 
          :key="child.id" 
          class="relative component-wrapper mb-2"
          :class="{'component-selected': child.id === store.selectedComponent}"
          @click.stop="store.selectComponent(child.id)"
        >
          <!-- Child component controls -->
          <div class="component-handle absolute top-0 left-0 -mt-4 -ml-4 bg-blue-500 text-white p-1 rounded cursor-move opacity-0 group-hover:opacity-100 z-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
            </svg>
          </div>
          <button 
            class="absolute top-0 right-0 -mt-4 -mr-4 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 z-10"
            @click.stop="removeChildComponent(component.id, child.id)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
          <RenderComponent :component="child" />
        </div>
      </template>
      <div 
        v-else 
        class="p-8 border-2 border-dashed border-gray-300 text-gray-400 text-center min-h-[120px] flex items-center justify-center"
      >
        Container (drop components here)
      </div>
    </div>
    
    <!-- Default - Unknown Component Type -->
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

.component-wrapper:hover .component-handle,
.component-wrapper:hover button {
  opacity: 1;
}
</style>
