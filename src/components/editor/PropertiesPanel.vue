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

// Handle dropdown options
const addDropdownOption = () => {
  if (selectedComponent.value) {
    const options = [...(selectedComponent.value.options || [])];
    options.push({ value: '', label: 'New Option' });
    updateProperty('options', options);
  }
};

const removeDropdownOption = (index) => {
  if (selectedComponent.value && selectedComponent.value.options) {
    const options = [...selectedComponent.value.options];
    options.splice(index, 1);
    updateProperty('options', options);
  }
};

const updateDropdownOption = (index, key, value) => {
  if (selectedComponent.value && selectedComponent.value.options && selectedComponent.value.options[index]) {
    const options = [...selectedComponent.value.options];
    options[index] = { ...options[index], [key]: value };
    updateProperty('options', options);
  }
};

// Handle list items
const addListItem = () => {
  if (selectedComponent.value) {
    const items = [...(selectedComponent.value.items || [])];
    items.push('New item');
    updateProperty('items', items);
  }
};

const removeListItem = (index) => {
  if (selectedComponent.value && selectedComponent.value.items) {
    const items = [...selectedComponent.value.items];
    items.splice(index, 1);
    updateProperty('items', items);
  }
};

const updateListItem = (index, value) => {
  if (selectedComponent.value && selectedComponent.value.items && selectedComponent.value.items[index] !== undefined) {
    const items = [...selectedComponent.value.items];
    items[index] = value;
    updateProperty('items', items);
  }
};

// Handle table updates
const updateTableHeader = (index, value) => {
  if (selectedComponent.value && selectedComponent.value.headers && selectedComponent.value.headers[index]) {
    const headers = [...selectedComponent.value.headers];
    headers[index] = { ...headers[index], content: value };
    updateProperty('headers', headers);
  }
};

const updateTableCell = (rowIndex, cellIndex, value) => {
  if (selectedComponent.value && selectedComponent.value.rows && selectedComponent.value.rows[rowIndex] && selectedComponent.value.rows[rowIndex].cells[cellIndex]) {
    const rows = [...selectedComponent.value.rows];
    rows[rowIndex] = { ...rows[rowIndex] };
    rows[rowIndex].cells = [...rows[rowIndex].cells];
    rows[rowIndex].cells[cellIndex] = { ...rows[rowIndex].cells[cellIndex], content: value };
    updateProperty('rows', rows);
  }
};

const addTableColumn = () => {
  if (selectedComponent.value) {
    const headers = [...(selectedComponent.value.headers || [])];
    const columnIndex = headers.length;
    headers.push({ id: `header${Date.now()}`, content: `Column ${columnIndex + 1}` });
    
    // Add cell to each row
    const rows = [...(selectedComponent.value.rows || [])];
    rows.forEach(row => {
      row.cells.push({ id: `cell${Date.now()}`, content: 'New Cell' });
    });
    
    updateProperty('headers', headers);
    updateProperty('rows', rows);
  }
};

const removeTableColumn = (columnIndex) => {
  if (selectedComponent.value && selectedComponent.value.headers.length > 1) {
    const headers = [...selectedComponent.value.headers];
    headers.splice(columnIndex, 1);
    
    // Remove cell from each row
    const rows = [...selectedComponent.value.rows];
    rows.forEach(row => {
      if (row.cells.length > columnIndex) {
        row.cells.splice(columnIndex, 1);
      }
    });
    
    updateProperty('headers', headers);
    updateProperty('rows', rows);
  }
};

const addTableRow = () => {
  if (selectedComponent.value) {
    const rows = [...(selectedComponent.value.rows || [])];
    const columnCount = selectedComponent.value.headers?.length || 3;
    const newCells = [];
    
    for (let i = 0; i < columnCount; i++) {
      newCells.push({ id: `cell${Date.now()}-${i}`, content: `Cell ${rows.length + 1}-${i + 1}` });
    }
    
    rows.push({ id: `row${Date.now()}`, cells: newCells });
    updateProperty('rows', rows);
  }
};

const removeTableRow = (rowIndex) => {
  if (selectedComponent.value && selectedComponent.value.rows.length > 1) {
    const rows = [...selectedComponent.value.rows];
    rows.splice(rowIndex, 1);
    updateProperty('rows', rows);
  }
};

// Handle navbar items
const addNavItem = () => {
  if (selectedComponent.value) {
    const items = [...(selectedComponent.value.items || [])];
    items.push({ id: `nav${Date.now()}`, label: 'New Item', href: '#' });
    updateProperty('items', items);
  }
};

const removeNavItem = (index) => {
  if (selectedComponent.value && selectedComponent.value.items) {
    const items = [...selectedComponent.value.items];
    items.splice(index, 1);
    updateProperty('items', items);
  }
};

const updateNavItem = (index, key, value) => {
  if (selectedComponent.value && selectedComponent.value.items && selectedComponent.value.items[index]) {
    const items = [...selectedComponent.value.items];
    items[index] = { ...items[index], [key]: value };
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
        
        <!-- Link specific -->
        <template v-if="selectedComponent.type === 'link'">
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Link Text</label>
            <input 
              type="text" 
              v-model="selectedComponent.content" 
              @input="updateProperty('content', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">URL</label>
            <input 
              type="text" 
              v-model="selectedComponent.href" 
              @input="updateProperty('href', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Target</label>
            <select 
              v-model="selectedComponent.target" 
              @change="updateProperty('target', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="_self">Same Window</option>
              <option value="_blank">New Window</option>
            </select>
          </div>
        </template>
        
        <!-- Input Field specific -->
        <template v-if="selectedComponent.type === 'input'">
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Label</label>
            <input 
              type="text" 
              v-model="selectedComponent.label" 
              @input="updateProperty('label', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
            <input 
              type="text" 
              v-model="selectedComponent.placeholder" 
              @input="updateProperty('placeholder', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Input Type</label>
            <select 
              v-model="selectedComponent.inputType" 
              @change="updateProperty('inputType', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="password">Password</option>
              <option value="number">Number</option>
              <option value="tel">Phone</option>
              <option value="url">URL</option>
            </select>
          </div>
          <div class="form-group">
            <label class="flex items-center">
              <input 
                type="checkbox" 
                v-model="selectedComponent.required" 
                @change="updateProperty('required', $event.target.checked)"
                class="mr-2"
              />
              Required Field
            </label>
          </div>
        </template>
        
        <!-- Textarea specific -->
        <template v-if="selectedComponent.type === 'textarea'">
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Label</label>
            <input 
              type="text" 
              v-model="selectedComponent.label" 
              @input="updateProperty('label', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
            <input 
              type="text" 
              v-model="selectedComponent.placeholder" 
              @input="updateProperty('placeholder', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Rows</label>
            <input 
              type="number" 
              v-model.number="selectedComponent.rows" 
              @input="updateProperty('rows', Number($event.target.value))"
              class="w-full p-2 border border-gray-300 rounded text-sm"
              min="2"
              max="10"
            />
          </div>
          <div class="form-group">
            <label class="flex items-center">
              <input 
                type="checkbox" 
                v-model="selectedComponent.required" 
                @change="updateProperty('required', $event.target.checked)"
                class="mr-2"
              />
              Required Field
            </label>
          </div>
        </template>
        
        <!-- Select Dropdown specific -->
        <template v-if="selectedComponent.type === 'select'">
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Label</label>
            <input 
              type="text" 
              v-model="selectedComponent.label" 
              @input="updateProperty('label', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
            <input 
              type="text" 
              v-model="selectedComponent.placeholder" 
              @input="updateProperty('placeholder', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          
          <div class="mb-2 flex justify-between items-center">
            <label class="block text-sm font-medium text-gray-700">Options</label>
            <button 
              @click="addDropdownOption" 
              class="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Option
            </button>
          </div>
          
          <div v-for="(option, index) in selectedComponent.options" :key="index" class="mb-2 p-2 border rounded">
            <div class="flex gap-2 mb-1">
              <input 
                type="text" 
                v-model="option.label" 
                @input="updateDropdownOption(index, 'label', $event.target.value)"
                placeholder="Option Label"
                class="flex-1 p-1 border border-gray-300 rounded text-sm"
              />
              <input 
                type="text" 
                v-model="option.value" 
                @input="updateDropdownOption(index, 'value', $event.target.value)"
                placeholder="Option Value"
                class="flex-1 p-1 border border-gray-300 rounded text-sm"
              />
              <button 
                @click="removeDropdownOption(index)" 
                class="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
              >
                ×
              </button>
            </div>
          </div>
        </template>
        
        <!-- Grid Layout specific -->
        <template v-if="selectedComponent.type === 'grid'">
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Columns</label>
            <input 
              type="number" 
              v-model.number="selectedComponent.columns" 
              @input="updateProperty('columns', Number($event.target.value))"
              class="w-full p-2 border border-gray-300 rounded text-sm"
              min="1"
              max="12"
            />
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Gap (px)</label>
            <input 
              type="text" 
              v-model="selectedComponent.gap" 
              @input="updateProperty('gap', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
        </template>
        
        <!-- Flexbox specific -->
        <template v-if="selectedComponent.type === 'flexbox'">
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Direction</label>
            <select 
              v-model="selectedComponent.direction" 
              @change="updateProperty('direction', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="row">Row</option>
              <option value="column">Column</option>
              <option value="row-reverse">Row Reverse</option>
              <option value="column-reverse">Column Reverse</option>
            </select>
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Justify Content</label>
            <select 
              v-model="selectedComponent.justifyContent" 
              @change="updateProperty('justifyContent', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="flex-start">Start</option>
              <option value="center">Center</option>
              <option value="flex-end">End</option>
              <option value="space-between">Space Between</option>
              <option value="space-around">Space Around</option>
              <option value="space-evenly">Space Evenly</option>
            </select>
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Align Items</label>
            <select 
              v-model="selectedComponent.alignItems" 
              @change="updateProperty('alignItems', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="stretch">Stretch</option>
              <option value="flex-start">Start</option>
              <option value="center">Center</option>
              <option value="flex-end">End</option>
              <option value="baseline">Baseline</option>
            </select>
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Gap</label>
            <input 
              type="text" 
              v-model="selectedComponent.gap" 
              @input="updateProperty('gap', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
        </template>
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
            <label class="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea 
              v-model="selectedComponent.content" 
              @input="updateProperty('content', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
              rows="2"
            ></textarea>
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
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
            <input 
              type="text" 
              v-model="selectedComponent.buttonLink" 
              @input="updateProperty('buttonLink', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
        </template>
        
        <!-- Hero specific (updated) -->
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
        
        <!-- Features specific (updated) -->
        <template v-if="selectedComponent.type === 'features'">
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input 
              type="text" 
              v-model="selectedComponent.title" 
              @input="updateProperty('title', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <input 
              type="text" 
              v-model="selectedComponent.subtitle" 
              @input="updateProperty('subtitle', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          
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
                <label class="block text-xs text-gray-700 mb-1">Icon</label>
                <input 
                  type="text" 
                  :value="item.icon" 
                  @input="updateFeatureItem(index, 'icon', $event.target.value)"
                  class="w-full p-2 border border-gray-300 rounded text-sm"
                  placeholder="🚀"
                />
              </div>
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
        
        <!-- Card specific -->
        <template v-if="selectedComponent.type === 'card'">
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input 
              type="text" 
              v-model="selectedComponent.title" 
              @input="updateProperty('title', $event.target.value)"
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
        
        <!-- Table specific -->
        <template v-if="selectedComponent.type === 'table'">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Table Headers</label>
            <div 
              v-for="(header, index) in selectedComponent.headers" 
              :key="header.id"
              class="bg-gray-50 p-2 rounded mb-2 border border-gray-200 flex items-center gap-2"
            >
              <input 
                type="text" 
                :value="header.content" 
                @input="updateTableHeader(index, $event.target.value)"
                class="flex-1 p-2 border border-gray-300 rounded text-sm"
                placeholder="Header text"
              />
              <button 
                @click="removeTableColumn(index)"
                class="p-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                title="Remove column"
                :disabled="selectedComponent.headers.length <= 1"
              >
                ✕
              </button>
            </div>
            <button 
              @click="addTableColumn"
              class="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              + Add Column
            </button>
          </div>
          
          <div class="mb-4">
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-medium text-gray-700">Table Rows</label>
              <button 
                @click="addTableRow"
                class="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                + Add Row
              </button>
            </div>
            <div 
              v-for="(row, rowIndex) in selectedComponent.rows" 
              :key="row.id"
              class="bg-gray-50 p-3 rounded mb-3 border border-gray-200"
            >
              <div class="flex justify-between items-center mb-2">
                <h4 class="text-sm font-medium">Row {{ rowIndex + 1 }}</h4>
                <button 
                  @click="removeTableRow(rowIndex)"
                  class="p-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                  title="Remove row"
                  :disabled="selectedComponent.rows.length <= 1"
                >
                  ✕
                </button>
              </div>
              <div 
                v-for="(cell, cellIndex) in row.cells" 
                :key="cell.id"
                class="mb-2"
              >
                <label class="block text-xs text-gray-700 mb-1">Cell {{ cellIndex + 1 }}</label>
                <input 
                  type="text" 
                  :value="cell.content" 
                  @input="updateTableCell(rowIndex, cellIndex, $event.target.value)"
                  class="w-full p-2 border border-gray-300 rounded text-sm"
                  placeholder="Cell content"
                />
              </div>
            </div>
          </div>
        </template>
        
        <!-- Navbar specific -->
        <template v-if="selectedComponent.type === 'navbar'">
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
            <input 
              type="text" 
              v-model="selectedComponent.brand" 
              @input="updateProperty('brand', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          
          <div class="mb-2 flex justify-between items-center">
            <label class="block text-sm font-medium text-gray-700">Navigation Items</label>
            <button 
              @click="addNavItem" 
              class="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Item
            </button>
          </div>
          
          <div 
            v-for="(item, index) in selectedComponent.items" 
            :key="item.id"
            class="bg-gray-50 p-3 rounded mb-3 border border-gray-200"
          >
            <div class="flex justify-between items-center mb-2">
              <h4 class="text-sm font-medium">Nav Item {{ index + 1 }}</h4>
              <button 
                @click="removeNavItem(index)" 
                class="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
            
            <div class="space-y-2">
              <div class="form-group">
                <label class="block text-xs text-gray-700 mb-1">Label</label>
                <input 
                  type="text" 
                  :value="item.label" 
                  @input="updateNavItem(index, 'label', $event.target.value)"
                  class="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div class="form-group">
                <label class="block text-xs text-gray-700 mb-1">Link</label>
                <input 
                  type="text" 
                  :value="item.href" 
                  @input="updateNavItem(index, 'href', $event.target.value)"
                  class="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          </div>
        </template>
        
        <!-- Footer specific -->
        <template v-if="selectedComponent.type === 'footer'">
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
            <input 
              type="text" 
              v-model="selectedComponent.brand" 
              @input="updateProperty('brand', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Copyright</label>
            <input 
              type="text" 
              v-model="selectedComponent.copyright" 
              @input="updateProperty('copyright', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
        </template>
        
        <!-- Contact Form specific -->
        <template v-if="selectedComponent.type === 'contact'">
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input 
              type="text" 
              v-model="selectedComponent.title" 
              @input="updateProperty('title', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <input 
              type="text" 
              v-model="selectedComponent.subtitle" 
              @input="updateProperty('subtitle', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Submit Button Text</label>
            <input 
              type="text" 
              v-model="selectedComponent.submitText" 
              @input="updateProperty('submitText', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
        </template>
        
        <!-- Testimonial specific -->
        <template v-if="selectedComponent.type === 'testimonial'">
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Quote</label>
            <textarea 
              v-model="selectedComponent.quote" 
              @input="updateProperty('quote', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
              rows="3"
            ></textarea>
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
            <input 
              type="text" 
              v-model="selectedComponent.author" 
              @input="updateProperty('author', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Author Position</label>
            <input 
              type="text" 
              v-model="selectedComponent.position" 
              @input="updateProperty('position', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
            <input 
              type="text" 
              v-model="selectedComponent.avatar" 
              @input="updateProperty('avatar', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
            <input 
              type="number" 
              v-model.number="selectedComponent.rating" 
              @input="updateProperty('rating', Number($event.target.value))"
              class="w-full p-2 border border-gray-300 rounded text-sm"
              min="1"
              max="5"
            />
          </div>
        </template>
        
        <!-- Link specific -->
        <template v-if="selectedComponent.type === 'link'">
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Link Text</label>
            <input 
              type="text" 
              v-model="selectedComponent.content" 
              @input="updateProperty('content', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">URL</label>
            <input 
              type="text" 
              v-model="selectedComponent.href" 
              @input="updateProperty('href', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
              placeholder="https://example.com"
            />
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Target</label>
            <select 
              v-model="selectedComponent.target" 
              @change="updateProperty('target', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="_self">Same Window</option>
              <option value="_blank">New Window</option>
            </select>
          </div>
        </template>
        
        <!-- Dropdown specific -->
        <template v-if="selectedComponent.type === 'dropdown'">
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Label</label>
            <input 
              type="text" 
              v-model="selectedComponent.label" 
              @input="updateProperty('label', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div class="mb-2 flex justify-between items-center">
            <label class="block text-sm font-medium text-gray-700">Options</label>
            <button 
              @click="addDropdownOption" 
              class="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Option
            </button>
          </div>
          <div 
            v-for="(option, index) in selectedComponent.options" 
            :key="index"
            class="bg-gray-50 p-3 rounded mb-2 border border-gray-200"
          >
            <div class="flex justify-between items-center mb-2">
              <h4 class="text-sm font-medium">Option {{ index + 1 }}</h4>
              <button 
                @click="removeDropdownOption(index)" 
                class="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
            <div class="space-y-2">
              <div class="form-group">
                <label class="block text-xs text-gray-700 mb-1">Value</label>
                <input 
                  type="text" 
                  :value="option.value" 
                  @input="updateDropdownOption(index, 'value', $event.target.value)"
                  class="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div class="form-group">
                <label class="block text-xs text-gray-700 mb-1">Label</label>
                <input 
                  type="text" 
                  :value="option.label" 
                  @input="updateDropdownOption(index, 'label', $event.target.value)"
                  class="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          </div>
        </template>
        
        <!-- List specific -->
        <template v-if="selectedComponent.type === 'list'">
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">List Type</label>
            <select 
              v-model="selectedComponent.listType" 
              @change="updateProperty('listType', $event.target.value)"
              class="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="ul">Unordered List</option>
              <option value="ol">Ordered List</option>
            </select>
          </div>
          <div class="mb-2 flex justify-between items-center">
            <label class="block text-sm font-medium text-gray-700">Items</label>
            <button 
              @click="addListItem" 
              class="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Item
            </button>
          </div>
          <div 
            v-for="(item, index) in selectedComponent.items" 
            :key="index"
            class="bg-gray-50 p-3 rounded mb-2 border border-gray-200"
          >
            <div class="flex items-center space-x-2">
              <input 
                type="text" 
                :value="item" 
                @input="updateListItem(index, $event.target.value)"
                class="flex-1 p-2 border border-gray-300 rounded text-sm"
                placeholder="List item text"
              />
              <button 
                @click="removeListItem(index)" 
                class="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
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
              
              <!-- Dropdown for enum properties -->
              <template v-else-if="elementProperties[propName].type === 'enum'">
                <div class="flex space-x-2">
                  <select
                    :value="selectedComponent.customStyles[propName]"
                    @change="updateStyleProperty(propName, $event.target.value)"
                    class="w-full p-2 border border-gray-300 rounded text-xs focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
                  >
                    <option value="">-- Select {{ elementProperties[propName].label }} --</option>
                    <option v-for="option in elementProperties[propName].options" :key="option" :value="option">
                      {{ option }}
                    </option>
                  </select>
                  <button 
                    @click="updateStyleProperty(propName, '')"
                    class="px-2 py-1 bg-gray-200 text-xs text-gray-700 rounded hover:bg-gray-300 transition-colors" 
                    title="Clear value"
                  >
                    ✕
                  </button>
                </div>
              </template>
              
              <!-- Value input with suggestions for value properties -->
              <template v-else-if="elementProperties[propName].type === 'value'">
                <div class="space-y-2">
                  <div class="flex space-x-2">
                    <input 
                      type="text" 
                      :value="selectedComponent.customStyles[propName]" 
                      @input="updateStyleProperty(propName, $event.target.value)"
                      :placeholder="elementProperties[propName].placeholder || `Enter ${elementProperties[propName].label.toLowerCase()}`"
                      class="w-full p-2 border border-gray-300 rounded text-xs focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
                      list="`suggestions-${propName}`"
                    />
                    <button 
                      @click="updateStyleProperty(propName, '')"
                      class="px-2 py-1 bg-gray-200 text-xs text-gray-700 rounded hover:bg-gray-300 transition-colors" 
                      title="Clear value"
                    >
                      ✕
                    </button>
                  </div>
                  <!-- Quick options for value properties -->
                  <div v-if="elementProperties[propName].defaultOptions?.length" class="flex flex-wrap gap-1">
                    <button
                      v-for="option in elementProperties[propName].defaultOptions"
                      :key="option"
                      @click="updateStyleProperty(propName, option)"
                      class="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                      :class="selectedComponent.customStyles[propName] === option ? 'bg-blue-100 border-blue-400 text-blue-700' : 'bg-white text-gray-700'"
                    >
                      {{ option }}
                    </button>
                  </div>
                  <!-- Datalist for suggestions -->
                  <datalist :id="`suggestions-${propName}`">
                    <option v-for="option in elementProperties[propName].defaultOptions" :key="option" :value="option" />
                  </datalist>
                </div>
              </template>
              
              <!-- Fallback: Text input for properties without specific type -->
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
      <div class="mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16" class="mx-auto text-gray-300">
          <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
        </svg>
      </div>
      <h4 class="font-medium text-gray-700 mb-2">No Component Selected</h4>
      <p class="text-sm text-gray-500 mb-4">Select a component from the canvas or component tree to edit its properties</p>
      <div class="text-left bg-gray-50 p-4 rounded">
        <h5 class="font-medium text-gray-700 mb-2">Quick Tips:</h5>
        <ul class="text-sm text-gray-600 space-y-1">
          <li>• Click any component in the canvas to select it</li>
          <li>• Use the Component Tree to see page structure</li>
          <li>• Drag components from Toolbox to add them</li>
          <li>• Use Preview mode to test your design</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}
</style>
