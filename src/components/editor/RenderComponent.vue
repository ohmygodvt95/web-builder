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
    >
      <template v-if="component.children && component.children.length">
        <div v-for="child in component.children" :key="child.id">
          <RenderComponent :component="child" />
        </div>
      </template>
      <div v-else class="p-4 border-2 border-dashed border-gray-300 text-gray-400 text-center">
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
</style>
