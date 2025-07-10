<script setup>
import { computed, ref } from 'vue';
import { useEditorStore } from '../../stores/editor';
import { elementProperties, propertyGroups } from '../../utils/element-properties';

const store = useEditorStore();
const selectedComponent = computed(() => store.getSelectedComponent);
const activeTab = ref('content'); // 'content', 'styles', or 'advanced'

// Update component content properties
const updateProperty = (key, value) => {
  if (selectedComponent.value) {
    const update = {};
    update[key] = value;
    store.updateComponent(selectedComponent.value.id, update);
  }
};

// Update component custom styles
const updateStyleProperty = (key, value) => {
  if (selectedComponent.value) {
    const update = {};
    update[key] = value;
    store.updateComponentStyles(selectedComponent.value.id, update);
  }
};

// Handle array property updates for features component
const updateFeatureItem = (index, key, value) => {
  if (selectedComponent.value && selectedComponent.value.items && selectedComponent.value.items[index]) {
    const items = [...selectedComponent.value.items];
    items[index] = { ...items[index], [key]: value };
    updateProperty('items', items);
  }
};

// Add new feature item
const addFeatureItem = () => {
  if (selectedComponent.value) {
    const items = [...(selectedComponent.value.items || [])];
    items.push({ title: 'New Feature', description: 'Description goes here' });
    updateProperty('items', items);
  }
};

// Remove feature item
const removeFeatureItem = (index) => {
  if (selectedComponent.value && selectedComponent.value.items) {
    const items = [...selectedComponent.value.items];
    items.splice(index, 1);
    updateProperty('items', items);
  }
};
</script>

<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-bold">Properties</h3>
      <button @click="store.clearSelection" class="text-gray-500 hover:text-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
        </svg>
      </button>
    </div>
    
    <div v-if="selectedComponent" class="space-y-4">
      <!-- Component Type -->
      <div class="bg-blue-50 p-2 rounded text-blue-800 text-sm font-medium mb-4">
        {{ selectedComponent.type.charAt(0).toUpperCase() + selectedComponent.type.slice(1) }}
      </div>
      
      <!-- Tabs -->
      <div class="flex border-b">
        <button 
          @click="activeTab = 'content'" 
          class="py-2 px-4 mr-2 text-sm" 
          :class="activeTab === 'content' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-800'"
        >
          Content
        </button>
        <button 
          @click="activeTab = 'styles'" 
          class="py-2 px-4 mr-2 text-sm" 
          :class="activeTab === 'styles' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-800'"
        >
          Styles
        </button>
        <button 
          @click="activeTab = 'advanced'" 
          class="py-2 px-4 text-sm" 
          :class="activeTab === 'advanced' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-800'"
        >
          Advanced
        </button>
      </div>
      
      <!-- Content Tab -->
      <div v-if="activeTab === 'content'">
        <!-- Specific properties based on component type -->
        <template v-if="selectedComponent.type === 'header' || selectedComponent.type === 'paragraph' || selectedComponent.type === 'heading' || selectedComponent.type === 'button'">
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea 
              v-model="selectedComponent.content" 
              @input="updateProperty('content', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
              rows="3"
            ></textarea>
          </div>
        </template>
        
        <!-- Heading specific -->
        <template v-if="selectedComponent.type === 'heading'">
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Level</label>
            <select 
              v-model="selectedComponent.level" 
              @change="updateProperty('level', Number($event.target.value))"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option v-for="n in 6" :key="n" :value="n">H{{ n }}</option>
            </select>
          </div>
        </template>
        
        <!-- Image specific -->
        <template v-if="selectedComponent.type === 'image'">
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input 
              type="text" 
              v-model="selectedComponent.src" 
              @input="updateProperty('src', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
            <input 
              type="text" 
              v-model="selectedComponent.alt" 
              @input="updateProperty('alt', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
        </template>
        
        <!-- Hero specific -->
        <template v-if="selectedComponent.type === 'hero'">
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Heading</label>
            <input 
              type="text" 
              v-model="selectedComponent.heading" 
              @input="updateProperty('heading', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Subheading</label>
            <input 
              type="text" 
              v-model="selectedComponent.subheading" 
              @input="updateProperty('subheading', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea 
              v-model="selectedComponent.content" 
              @input="updateProperty('content', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
              rows="3"
            ></textarea>
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input 
              type="text" 
              v-model="selectedComponent.imageUrl" 
              @input="updateProperty('imageUrl', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
        </template>
        
        <!-- Features specific -->
        <template v-if="selectedComponent.type === 'features'">
          <div class="mb-2 flex justify-between items-center">
            <label class="block text-sm font-medium text-gray-700">Features</label>
            <button 
              @click="addFeatureItem" 
              class="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Feature
            </button>
          </div>
          
          <div 
            v-for="(item, index) in selectedComponent.items" 
            :key="index"
            class="bg-gray-50 p-3 rounded mb-3 border border-gray-200"
          >
            <div class="flex justify-between items-center mb-2">
              <h4 class="text-sm font-medium">Feature {{ index + 1 }}</h4>
              <button 
                @click="removeFeatureItem(index)" 
                class="text-red-500 hover:text-red-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
              </button>
            </div>
            
            <div class="space-y-2">
              <div class="form-group">
                <label class="block text-xs text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  :value="item.title" 
                  @input="updateFeatureItem(index, 'title', $event.target.value)"
                  class="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div class="form-group">
                <label class="block text-xs text-gray-700 mb-1">Description</label>
                <textarea 
                  :value="item.description" 
                  @input="updateFeatureItem(index, 'description', $event.target.value)"
                  class="w-full p-2 border border-gray-300 rounded text-sm"
                  rows="2"
                ></textarea>
              </div>
            </div>
          </div>
        </template>
        
        <!-- CTA specific -->
        <template v-if="selectedComponent.type === 'cta'">
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Heading</label>
            <input 
              type="text" 
              v-model="selectedComponent.heading" 
              @input="updateProperty('heading', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
            <input 
              type="text" 
              v-model="selectedComponent.buttonText" 
              @input="updateProperty('buttonText', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
        </template>
      </div>
      
      <!-- Styles Tab -->
      <div v-if="activeTab === 'styles'" class="space-y-6">
        <!-- Initialize customStyles object if it doesn't exist -->
        <div v-if="!selectedComponent.customStyles">
          {{ selectedComponent.customStyles = {} }}
        </div>
        
        <!-- Style Preview -->
        <div v-if="Object.keys(selectedComponent.customStyles || {}).length > 0" class="mb-6">
          <h4 class="text-sm font-medium text-gray-700 mb-2 border-b pb-1">Style Preview</h4>
          <div class="p-4 border border-gray-200 rounded">
            <div 
              class="w-full h-32 flex items-center justify-center text-sm"
              :style="selectedComponent.customStyles"
            >
              <div v-if="['header', 'paragraph', 'heading', 'button'].includes(selectedComponent.type)">
                {{ selectedComponent.content || selectedComponent.type }}
              </div>
              <div v-else-if="selectedComponent.type === 'image'">
                <img :src="selectedComponent.src" :alt="selectedComponent.alt || ''" class="max-h-full" />
              </div>
              <div v-else class="text-gray-500">
                {{ selectedComponent.type }} preview
              </div>
            </div>
          </div>
        </div>
        
        <!-- Output Type Selection -->
        <div class="mb-6">
          <h4 class="text-sm font-medium text-gray-700 mb-2 border-b pb-1">Output Format</h4>
          <div class="space-y-2">
            <label class="flex items-center">
              <input type="radio" v-model="store.outputType" value="tailwind" class="mr-2" />
              <span>Tailwind CSS</span>
            </label>
            <label class="flex items-center">
              <input type="radio" v-model="store.outputType" value="inline-styles" class="mr-2" />
              <span>Inline Styles</span>
            </label>
            <label class="flex items-center">
              <input type="radio" v-model="store.outputType" value="css-classes" class="mr-2" />
              <span>Custom CSS Classes</span>
            </label>
          </div>
        </div>
        
        <!-- Style property groups -->
        <div v-for="group in propertyGroups" :key="group.name" class="mb-4">
          <h4 class="text-sm font-medium text-gray-700 mb-2 border-b pb-1">{{ group.name }}</h4>
          
          <div class="space-y-3">
            <div 
              v-for="propName in group.properties" 
              :key="propName"
              class="form-group"
            >
              <label class="block text-xs text-gray-700 mb-1">{{ elementProperties[propName].label }}</label>
              
              <!-- Color picker for color properties -->
              <template v-if="elementProperties[propName].type === 'color'">
                <div class="flex space-x-2">
                  <div class="relative">
                    <input 
                      type="color" 
                      :value="selectedComponent.customStyles[propName] || '#000000'" 
                      @input="updateStyleProperty(propName, $event.target.value)"
                      class="h-8 w-10 opacity-0 absolute inset-0 cursor-pointer z-10"
                    />
                    <div 
                      class="h-8 w-10 rounded border border-gray-300" 
                      :style="{ backgroundColor: selectedComponent.customStyles[propName] || '#ffffff' }"
                    ></div>
                  </div>
                  <input 
                    type="text" 
                    :value="selectedComponent.customStyles[propName]" 
                    @input="updateStyleProperty(propName, $event.target.value)"
                    class="w-full p-2 border border-gray-300 rounded text-xs"
                    placeholder="Enter color value"
                  />
                </div>
              </template>
              
              <!-- Select dropdown for properties with options -->
              <template v-else-if="elementProperties[propName].options?.length">
                <div class="flex space-x-2">
                  <select
                    :value="selectedComponent.customStyles[propName]"
                    @change="updateStyleProperty(propName, $event.target.value)"
                    class="w-full p-2 border border-gray-300 rounded text-xs"
                  >
                    <option value="">-- Select {{ elementProperties[propName].label }} --</option>
                    <option v-for="option in elementProperties[propName].options" :key="option" :value="option">
                      {{ option }}
                    </option>
                  </select>
                  <button 
                    @click="updateStyleProperty(propName, '')"
                    class="px-2 py-1 bg-gray-200 text-xs text-gray-700 rounded hover:bg-gray-300" 
                    title="Clear value"
                  >
                    Clear
                  </button>
                </div>
              </template>
              
              <!-- Text input for properties without options -->
              <template v-else>
                <input 
                  type="text" 
                  :value="selectedComponent.customStyles[propName]" 
                  @input="updateStyleProperty(propName, $event.target.value)"
                  class="w-full p-2 border border-gray-300 rounded text-xs"
                  :placeholder="`Enter ${elementProperties[propName].label.toLowerCase()}`"
                />
              </template>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Advanced Tab -->
      <div v-if="activeTab === 'advanced'">
        <div class="form-group mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">CSS Classes (Tailwind)</label>
          <input 
            type="text" 
            v-model="selectedComponent.classes" 
            @input="updateProperty('classes', $event.target.value)"
            class="w-full p-2 border border-gray-300 rounded text-sm"
          />
          <p class="mt-1 text-xs text-gray-500">Add Tailwind CSS classes separated by spaces</p>
        </div>
        
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">Custom CSS</label>
          <textarea 
            :value="selectedComponent.customCSS || ''"
            @input="updateProperty('customCSS', $event.target.value)"
            class="w-full p-2 border border-gray-300 rounded text-sm font-mono"
            rows="6"
            placeholder="background-color: #f1f1f1;\npadding: 10px;\n/* Add your custom CSS here */"
          ></textarea>
          <p class="mt-1 text-xs text-gray-500">Write custom CSS properties (without selectors)</p>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center text-gray-500 py-8">
      <p>Select a component to edit its properties</p>
    </div>
  </div>
</template>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}
</style>
