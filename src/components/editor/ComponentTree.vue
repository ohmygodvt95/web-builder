<script setup>
import { computed } from 'vue';
import { useEditorStore } from '../../stores/editor';

const store = useEditorStore();

const components = computed(() => store.components);

const getComponentIcon = (type) => {
  const icons = {
    header: '📄',
    paragraph: '📝',
    heading: '🔤',
    button: '🔘',
    image: '🖼️',
    link: '🔗',
    table: '📊',
    input: '📝',
    textarea: '📝',
    select: '📋',
    container: '📦',
    grid: '🏗️',
    flexbox: '↔️',
    section: '📄',
    card: '🃏',
    list: '📋',
    hero: '🦸',
    features: '⭐',
    cta: '📢',
    navbar: '🧭',
    footer: '👣',
    contact: '📞',
    testimonial: '💬'
  };
  return icons[type] || '❓';
};

const selectComponent = (id) => {
  store.selectComponent(id);
};

const removeComponent = (id) => {
  store.removeComponent(id);
};

const removeChildComponent = (parentId, childId) => {
  store.removeChildFromContainer(parentId, childId);
};

// Recursive component tree rendering
const renderComponentTree = (componentList, level = 0) => {
  return componentList;
};
</script>

<template>
  <div class="bg-white border-r border-gray-200 h-full overflow-y-auto">
    <div class="p-4 border-b border-gray-200">
      <h3 class="text-lg font-bold text-gray-800">Component Tree</h3>
      <p class="text-xs text-gray-500 mt-1">{{ components.length }} component(s)</p>
    </div>
    
    <div class="p-2">
      <div v-if="components.length === 0" class="text-center text-gray-400 py-8">
        <div class="text-4xl mb-2">🌳</div>
        <p class="text-sm">No components yet</p>
        <p class="text-xs">Drag components to the canvas</p>
      </div>
      
      <!-- Root level components -->
      <div v-else class="space-y-1">
        <div 
          v-for="(component, index) in components" 
          :key="component.id"
          class="component-tree-item"
        >
          <!-- Root component -->
          <div 
            class="flex items-center p-2 rounded cursor-pointer group transition-all"
            :class="{
              'bg-blue-100 border border-blue-300': component.id === store.selectedComponent,
              'hover:bg-gray-100': component.id !== store.selectedComponent
            }"
            @click="selectComponent(component.id)"
          >
            <div class="flex items-center flex-1 min-w-0">
              <span class="text-sm mr-2">{{ getComponentIcon(component.type) }}</span>
              <span class="text-sm font-medium text-gray-700 truncate">
                {{ component.type }}
              </span>
              <span class="text-xs text-gray-400 ml-2">
                #{{ index + 1 }}
              </span>
            </div>
            <div class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                @click.stop="removeComponent(component.id)"
                class="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                title="Delete component"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Child components -->
          <div v-if="component.children && component.children.length > 0" class="ml-6 mt-1 space-y-1">
            <div 
              v-for="(child, childIndex) in component.children" 
              :key="child.id"
              class="flex items-center p-2 rounded cursor-pointer group transition-all"
              :class="{
                'bg-blue-100 border border-blue-300': child.id === store.selectedComponent,
                'hover:bg-gray-100': child.id !== store.selectedComponent
              }"
              @click="selectComponent(child.id)"
            >
              <div class="flex items-center flex-1 min-w-0">
                <span class="text-xs text-gray-400 mr-2">└─</span>
                <span class="text-sm mr-2">{{ getComponentIcon(child.type) }}</span>
                <span class="text-sm font-medium text-gray-700 truncate">
                  {{ child.type }}
                </span>
                <span class="text-xs text-gray-400 ml-2">
                  #{{ childIndex + 1 }}
                </span>
              </div>
              <div class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  @click.stop="removeChildComponent(component.id, child.id)"
                  class="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                  title="Remove from container"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.component-tree-item {
  font-family: system-ui, sans-serif;
}

.component-tree-item .group:hover .opacity-0 {
  opacity: 1;
}
</style>
