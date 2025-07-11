<script setup>
import { ref, computed, onMounted } from 'vue';
import Sortable from 'sortablejs';
import { useEditorStore } from '../stores/editor';
import { toast } from 'vue3-toastify';
import ComponentToolbox from '../components/editor/ComponentToolbox.vue';
import PropertiesPanel from '../components/editor/PropertiesPanel.vue';
import RenderComponent from '../components/editor/RenderComponent.vue';
import ComponentTree from '../components/editor/ComponentTree.vue';

const store = useEditorStore();

const editorCanvas = ref(null);
const showExportModal = ref(false);
const showImportModal = ref(false);
const showTemplatesModal = ref(false);
const exportType = ref('html');
const exportedCode = ref('');
const importCode = ref('');
const newTemplateName = ref('');

const components = computed(() => store.components);
const selectedComponent = computed(() => store.getSelectedComponent);

onMounted(() => {
  // Initialize sortable for drag and drop reordering
  if (editorCanvas.value) {
    Sortable.create(editorCanvas.value, {
      animation: 150,
      handle: '.component-handle',
      ghostClass: 'bg-gray-100',
      onEnd: (evt) => {
        store.moveComponent(evt.oldIndex, evt.newIndex);
      }
    });
  }
});

const handleExport = () => {
  if (components.value.length === 0) {
    toast.error('No components to export');
    return;
  }
  
  if (exportType.value === 'html') {
    exportedCode.value = store.exportToHTML();
  } else {
    exportedCode.value = store.exportToJSON();
  }
  
  showExportModal.value = true;
};

const handleImport = () => {
  if (!importCode.value) {
    toast.error('Import code cannot be empty');
    return;
  }
  
  const success = store.importFromJSON(importCode.value);
  if (success) {
    showImportModal.value = false;
    importCode.value = '';
  }
};

const handleSaveTemplate = () => {
  if (components.value.length === 0) {
    toast.error('No components to save as template');
    return;
  }
  
  store.saveTemplate(newTemplateName.value);
  showTemplatesModal.value = false;
  newTemplateName.value = '';
};

const downloadExport = () => {
  const fileName = exportType.value === 'html' ? 'landing-page.html' : 'landing-page.json';
  const blob = new Blob([exportedCode.value], { type: exportType.value === 'html' ? 'text/html' : 'application/json' });
  
  // Create download link
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  // Clean up
  URL.revokeObjectURL(a.href);
  showExportModal.value = false;
};

const copyToClipboard = () => {
  navigator.clipboard.writeText(exportedCode.value)
    .then(() => toast.success('Copied to clipboard'))
    .catch(() => toast.error('Failed to copy'));
};

// Handle drop events for nested components
const handleDrop = (event) => {
  event.preventDefault();
  if (store.currentlyDragging) {
    if (store.currentlyDragging.from === 'existing') {
      // Handle moving existing component to root level
      const originalId = store.currentlyDragging.originalId;
      
      // Remove from original location first
      store.removeComponent(originalId);
      
      // Create new component with new ID
      const newComponent = {
        ...store.currentlyDragging,
        id: `${store.currentlyDragging.type}-${Date.now()}`,
      };
      delete newComponent.from;
      delete newComponent.originalId;
      
      // Add to root level
      store.addComponent(newComponent);
    } else {
      // Handle new component from toolbox
      store.addComponent(store.currentlyDragging);
    }
    store.setDragging(null);
  }
};

// Generate CSS for preview display
const generatePreviewCSS = () => {
  let css = '';
  
  // Add CSS for each component that has custom styles
  store.components.forEach(component => {
    if (component.customStyles && Object.keys(component.customStyles).length > 0) {
      css += `.component-${component.id} {\n`;
      
      for (const [key, value] of Object.entries(component.customStyles)) {
        // Convert camelCase to kebab-case for CSS
        const kebabKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        css += `  ${kebabKey}: ${value};\n`;
      }
      
      css += '}\n\n';
    }
  });
  
  // Add basic responsive styles
  css += '/* Basic responsive styles */\n';
  css += '.container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 15px; }\n';
  css += 'img { max-width: 100%; height: auto; }\n\n';
  css += '@media (min-width: 768px) {\n';
  css += '  .hero-content { display: flex; align-items: center; }\n';
  css += '  .hero-text, .hero-image { width: 50%; }\n';
  css += '  .feature-item { display: inline-block; width: calc(33.333% - 20px); margin: 10px; vertical-align: top; }\n';
  css += '}\n\n';
  css += '@media (max-width: 767px) {\n';
  css += '  .feature-item { margin-bottom: 20px; }\n';
  css += '}';
  
  return css;
};
</script>

<template>
  <div class="editor-container flex h-screen overflow-hidden">
    <!-- Component Toolbox -->
    <div class="w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <ComponentToolbox />
    </div>
    
    <!-- Component Tree -->
    <div class="w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <ComponentTree />
    </div>
    
    <!-- Main Editor Canvas -->
    <div class="flex-1 overflow-y-auto bg-gray-50 relative">
      <!-- Toolbar -->
      <div class="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold">HTML Builder</h1>
        </div>
        <div class="flex items-center space-x-2">
          <!-- Preview Button -->
          <button 
            @click="store.togglePreviewMode()" 
            class="py-1 px-3 rounded text-sm"
            :class="store.isPreviewMode ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'"
            title="Toggle Preview Mode"
          >
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" class="mr-1">
                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
              </svg>
              {{ store.isPreviewMode ? 'Editing' : 'Preview' }}
            </div>
          </button>
          
          <!-- Output Type Selector -->
          <select 
            v-model="store.outputType" 
            class="py-1 px-2 rounded border border-gray-300 text-sm"
            title="Select Output Type"
          >
            <option value="tailwind">Tailwind CSS</option>
            <option value="inline-styles">Inline Styles</option>
            <option value="css-classes">Custom CSS Classes</option>
          </select>
          
          <button 
            @click="store.undo()" 
            class="p-2 text-gray-700 hover:bg-gray-100 rounded"
            title="Undo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm3.5 9.5-5-5 1-1 5 5-1 1z"/>
            </svg>
          </button>
          <button 
            @click="store.redo()" 
            class="p-2 text-gray-700 hover:bg-gray-100 rounded"
            title="Redo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1zM4.5 9.5l5-5 1 1-5 5-1-1z"/>
            </svg>
          </button>
          <button 
            @click="showTemplatesModal = true" 
            class="p-2 text-gray-700 hover:bg-gray-100 rounded"
            title="Templates"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 0v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1z"/>
              <path d="M6 5v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z"/>
            </svg>
          </button>
          <button 
            @click="showImportModal = true" 
            class="p-2 text-gray-700 hover:bg-gray-100 rounded"
            title="Import"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
              <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
            </svg>
          </button>
          <button 
            @click="handleExport" 
            class="p-2 text-gray-700 hover:bg-gray-100 rounded"
            title="Export"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
              <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
            </svg>
          </button>
          <button 
            @click="store.clearCanvas()" 
            class="p-2 text-gray-700 hover:bg-gray-100 rounded"
            title="Clear Canvas"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
              <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Canvas -->
      <div class="p-4">
        <!-- Output Type Indicator when in Preview Mode -->
        <div v-if="store.isPreviewMode" class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
          <div class="flex justify-between items-center">
            <div>
              <span class="font-medium">Preview Mode:</span> 
              <span class="ml-1">{{ store.outputType === 'tailwind' ? 'Tailwind CSS' : store.outputType === 'inline-styles' ? 'Inline Styles' : 'Custom CSS Classes' }}</span>
            </div>
            <button 
              @click="store.togglePreviewMode()" 
              class="text-xs px-2 py-1 bg-blue-200 hover:bg-blue-300 rounded text-blue-700"
            >
              Exit Preview
            </button>
          </div>
        </div>
        
        <!-- Generated CSS Preview (only shown when using CSS classes and in preview mode) -->
        <div v-if="store.isPreviewMode && store.outputType === 'css-classes' && components.length > 0" class="mb-4">
          <details class="bg-gray-100 rounded-lg overflow-hidden">
            <summary class="p-3 font-medium cursor-pointer hover:bg-gray-200">
              View Generated CSS
            </summary>
            <div class="p-3 bg-gray-800 text-gray-100 overflow-x-auto">
              <pre class="text-xs">{{ generatePreviewCSS() }}</pre>
            </div>
          </details>
        </div>
        
        <div 
          ref="editorCanvas" 
          class="editor-canvas min-h-[70vh] bg-white border border-gray-200 rounded-lg p-4 shadow-sm relative"
          @click="store.clearSelection()"
          @drop="handleDrop"
          @dragover.prevent
        >
          <div v-if="components.length === 0" class="flex flex-col items-center justify-center h-64 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"/>
            </svg>
            <p class="mt-4">Drag components here to build your page</p>
          </div>
          <template v-else>
            <div 
              v-for="component in components" 
              :key="component.id" 
              class="component-wrapper relative mb-4"
              :class="{'component-selected': component.id === store.selectedComponent}"
              @click.stop="store.selectComponent(component.id)"
            >
              <div class="component-handle absolute top-0 left-0 -mt-4 -ml-4 bg-blue-500 text-white p-1 rounded cursor-move opacity-0 group-hover:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                </svg>
              </div>
              <button 
                class="absolute top-0 right-0 -mt-4 -mr-4 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100"
                @click.stop="store.removeComponent(component.id)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
              </button>
              <RenderComponent :component="component" />
            </div>
          </template>
        </div>
      </div>
    </div>
    
    <!-- Properties Panel -->
    <div class="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      <PropertiesPanel />
    </div>
    
    <!-- Export Modal -->
    <div v-if="showExportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-3/4 max-w-4xl max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">Export</h3>
          <button @click="showExportModal = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
        </div>
        
        <div class="mb-4">
          <div class="flex space-x-4 mb-4">
            <label class="inline-flex items-center">
              <input type="radio" v-model="exportType" value="html" class="form-radio">
              <span class="ml-2">HTML</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" v-model="exportType" value="json" class="form-radio">
              <span class="ml-2">JSON</span>
            </label>
          </div>
          
          <div v-if="exportType === 'html'" class="mb-4">
            <h4 class="font-medium text-sm mb-2">Output Format:</h4>
            <div class="flex space-x-4">
              <label class="inline-flex items-center">
                <input type="radio" v-model="store.outputType" value="tailwind" class="form-radio" @change="handleExport()">
                <span class="ml-2">Tailwind CSS</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" v-model="store.outputType" value="inline-styles" class="form-radio" @change="handleExport()">
                <span class="ml-2">Inline Styles</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" v-model="store.outputType" value="css-classes" class="form-radio" @change="handleExport()">
                <span class="ml-2">Custom CSS Classes</span>
              </label>
            </div>
            <p class="text-xs text-gray-500 mt-1">
              Select how you want to export your HTML. Tailwind CSS will include a CDN link, Inline Styles will add style attributes to elements, and Custom CSS Classes will generate a stylesheet.
            </p>
          </div>
        </div>
        
        <div class="bg-gray-100 p-4 rounded overflow-auto max-h-96">
          <pre class="text-sm">{{ exportedCode }}</pre>
        </div>
        
        <div class="mt-4 flex justify-end space-x-2">
          <button @click="copyToClipboard" class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
            Copy
          </button>
          <button @click="downloadExport" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Download
          </button>
        </div>
      </div>
    </div>
    
    <!-- Import Modal -->
    <div v-if="showImportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-3/4 max-w-4xl">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">Import</h3>
          <button @click="showImportModal = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
        </div>
        
        <p class="mb-2 text-sm text-gray-600">Paste your JSON configuration below:</p>
        <textarea 
          v-model="importCode" 
          class="w-full h-64 p-2 border border-gray-300 rounded mb-4"
          placeholder="Paste your JSON here..."
        ></textarea>
        
        <div class="flex justify-end">
          <button @click="handleImport" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Import
          </button>
        </div>
      </div>
    </div>
    
    <!-- Templates Modal -->
    <div v-if="showTemplatesModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-3/4 max-w-4xl">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">Templates</h3>
          <button @click="showTemplatesModal = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
        </div>
        
        <div class="mb-6">
          <h4 class="font-medium mb-2">Save current design as template</h4>
          <div class="flex">
            <input 
              v-model="newTemplateName" 
              type="text" 
              placeholder="Template name" 
              class="flex-1 p-2 border border-gray-300 rounded-l"
            />
            <button 
              @click="handleSaveTemplate" 
              class="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
              :disabled="!newTemplateName"
            >
              Save
            </button>
          </div>
        </div>
        
        <h4 class="font-medium mb-2">Available templates</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
          <div 
            v-for="template in store.templates" 
            :key="template.id"
            class="border border-gray-200 rounded p-4 hover:bg-gray-50"
          >
            <div class="flex justify-between items-center">
              <h5 class="font-medium">{{ template.name }}</h5>
              <div class="flex space-x-2">
                <button 
                  @click="store.loadTemplate(template.id); showTemplatesModal = false" 
                  class="p-1 text-blue-500 hover:text-blue-700"
                  title="Load template"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                    <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                  </svg>
                </button>
                <button 
                  @click="store.deleteTemplate(template.id)" 
                  class="p-1 text-red-500 hover:text-red-700"
                  title="Delete template"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                  </svg>
                </button>
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-1">{{ template.components.length }} component(s)</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
