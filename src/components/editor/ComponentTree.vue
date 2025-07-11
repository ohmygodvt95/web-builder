<script setup>
import { computed, ref } from 'vue';
import { useEditorStore } from '../../stores/editor';

const store = useEditorStore();

const components = computed(() => store.components);

// Collapsed state for each component
const collapsedComponents = ref(new Set());

const toggleCollapse = (componentId, event) => {
  event.stopPropagation();
  if (collapsedComponents.value.has(componentId)) {
    collapsedComponents.value.delete(componentId);
  } else {
    collapsedComponents.value.add(componentId);
  }
};

const isCollapsed = (componentId) => {
  return collapsedComponents.value.has(componentId);
};

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

const getIndentIcon = (level) => {
  if (level === 0) return '';
  const icons = ['└─', '├─', '├─', '├─', '├─'];
  return icons[Math.min(level - 1, icons.length - 1)];
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

// Check if component has children
const hasChildren = (component) => {
  return component.children && component.children.length > 0;
};

// Flatten components into a tree structure with levels, respecting collapsed state
const flattenComponents = (componentList, level = 0, parentId = null) => {
  const result = [];
  
  componentList.forEach((component, index) => {
    result.push({
      ...component,
      level,
      index,
      parentId
    });
    
    // Only add children if this component is not collapsed
    if (component.children && component.children.length > 0 && !isCollapsed(component.id)) {
      result.push(...flattenComponents(component.children, level + 1, component.id));
    }
  });
  
  return result;
};

const flattenedComponents = computed(() => flattenComponents(components.value));

// Hover management với absolute control
const hoveredItemId = ref(null);

const handleItemHover = (itemId, event) => {
  event.stopPropagation();
  hoveredItemId.value = itemId;
};

const handleItemLeave = (itemId, event) => {
  event.stopPropagation();
  // Chỉ clear nếu đang hover item này
  if (hoveredItemId.value === itemId) {
    hoveredItemId.value = null;
  }
};
</script>

<template>
  <div class="bg-white h-full flex flex-col">
    <div class="flex-shrink-0 p-4 border-b border-gray-200">
      <h3 class="text-lg font-bold text-gray-800">Component Tree</h3>
      <p class="text-xs text-gray-500 mt-1">{{ components.length }} component(s)</p>
    </div>
    
    <div class="flex-1 overflow-y-auto p-2">
      <div v-if="components.length === 0" class="text-center text-gray-400 py-8">
        <div class="text-4xl mb-2">🌳</div>
        <p class="text-sm">No components yet</p>
        <p class="text-xs">Drag components to the canvas</p>
      </div>
      
      <!-- Flattened tree with proper indentation and collapse/expand -->
      <div v-else class="space-y-1 pb-4">
        <div 
          v-for="item in flattenedComponents" 
          :key="item.id"
          class="component-tree-item"
          @mouseenter="handleItemHover(item.id, $event)"
          @mouseleave="handleItemLeave(item.id, $event)"
        >
          <div 
            class="component-row flex items-center p-2 rounded cursor-pointer transition-all relative"
            :class="{
              'bg-blue-100 border border-blue-300': item.id === store.selectedComponent,
              'hover:bg-gray-100': item.id !== store.selectedComponent
            }"
            :style="{ marginLeft: item.level * 20 + 'px' }"
            @click="selectComponent(item.id)"
          >
            <div class="flex items-center flex-1 min-w-0">
              <!-- Collapse/Expand button for components with children -->
              <button 
                v-if="hasChildren(item)"
                @click.stop="toggleCollapse(item.id, $event)"
                class="w-4 h-4 mr-1 flex items-center justify-center hover:bg-gray-200 rounded text-xs"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="10" 
                  height="10" 
                  fill="currentColor" 
                  viewBox="0 0 16 16"
                  :class="['transition-transform', isCollapsed(item.id) ? '' : 'rotate-90']"
                >
                  <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                </svg>
              </button>
              <div v-else class="w-4 mr-1"></div>
              
              <!-- Indentation icon -->
              <span v-if="item.level > 0" class="text-xs text-gray-400 mr-2">
                {{ getIndentIcon(item.level) }}
              </span>
              
              <!-- Component icon -->
              <span class="text-sm mr-2">{{ getComponentIcon(item.type) }}</span>
              
              <!-- Component type -->
              <span class="text-sm font-medium text-gray-700 truncate">
                {{ item.type }}
              </span>
              
              <!-- Children count for collapsed items -->
              <span v-if="hasChildren(item) && isCollapsed(item.id)" class="text-xs text-gray-400 ml-2">
                ({{ item.children.length }})
              </span>
              
              <!-- Component index -->
              <span class="text-xs text-gray-400 ml-2">
                #{{ item.index + 1 }}
              </span>
            </div>
            
            <!-- Actions -->
            <div 
              class="component-actions flex items-center space-x-1 transition-opacity"
              :style="{ opacity: hoveredItemId === item.id ? 1 : 0 }"
            >
              <button 
                @click.stop="item.parentId ? removeChildComponent(item.parentId, item.id) : removeComponent(item.id)"
                class="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                :title="item.parentId ? 'Remove from container' : 'Delete component'"
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
</template>

<style scoped>
.component-tree-item {
  font-family: system-ui, sans-serif;
}

.component-actions {
  transition: opacity 0.15s ease-in-out;
}
</style>
