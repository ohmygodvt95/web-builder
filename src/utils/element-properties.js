// Định nghĩa các thuộc tính có thể chỉnh sửa cho các component
export const elementProperties = {
  // Layout
  margin: {
    label: 'Margin',
    options: ['0', '1px', '2px', '4px', '8px', '16px', '24px', '32px', '48px', '64px'],
    cssProperty: 'margin',
  },
  marginTop: {
    label: 'Margin Top',
    options: ['0', '1px', '2px', '4px', '8px', '16px', '24px', '32px', '48px', '64px'],
    cssProperty: 'marginTop',
  },
  marginBottom: {
    label: 'Margin Bottom',
    options: ['0', '1px', '2px', '4px', '8px', '16px', '24px', '32px', '48px', '64px'],
    cssProperty: 'marginBottom',
  },
  marginLeft: {
    label: 'Margin Left',
    options: ['0', '1px', '2px', '4px', '8px', '16px', '24px', '32px', '48px', '64px'],
    cssProperty: 'marginLeft',
  },
  marginRight: {
    label: 'Margin Right',
    options: ['0', '1px', '2px', '4px', '8px', '16px', '24px', '32px', '48px', '64px'],
    cssProperty: 'marginRight',
  },
  padding: {
    label: 'Padding',
    options: ['0', '1px', '2px', '4px', '8px', '16px', '24px', '32px', '48px', '64px'],
    cssProperty: 'padding',
  },
  paddingTop: {
    label: 'Padding Top',
    options: ['0', '1px', '2px', '4px', '8px', '16px', '24px', '32px', '48px', '64px'],
    cssProperty: 'paddingTop',
  },
  paddingBottom: {
    label: 'Padding Bottom',
    options: ['0', '1px', '2px', '4px', '8px', '16px', '24px', '32px', '48px', '64px'],
    cssProperty: 'paddingBottom',
  },
  paddingLeft: {
    label: 'Padding Left',
    options: ['0', '1px', '2px', '4px', '8px', '16px', '24px', '32px', '48px', '64px'],
    cssProperty: 'paddingLeft',
  },
  paddingRight: {
    label: 'Padding Right',
    options: ['0', '1px', '2px', '4px', '8px', '16px', '24px', '32px', '48px', '64px'],
    cssProperty: 'paddingRight',
  },
  width: {
    label: 'Width',
    options: ['auto', '25%', '50%', '75%', '100%', '200px', '300px', '400px', '500px', '600px', 'fit-content', 'max-content', 'min-content'],
    cssProperty: 'width',
  },
  height: {
    label: 'Height',
    options: ['auto', '100px', '200px', '300px', '400px', '500px', '100%', 'fit-content', 'max-content', 'min-content'],
    cssProperty: 'height',
  },
  maxWidth: {
    label: 'Max Width',
    options: ['none', '100%', '300px', '500px', '800px', '1000px', '1200px'],
    cssProperty: 'maxWidth',
  },
  minWidth: {
    label: 'Min Width',
    options: ['0', '100px', '200px', '300px', '400px', '500px'],
    cssProperty: 'minWidth',
  },
  
  // Typography
  fontSize: {
    label: 'Font Size',
    options: ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px', '64px'],
    cssProperty: 'fontSize',
  },
  fontWeight: {
    label: 'Font Weight',
    options: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
    cssProperty: 'fontWeight',
  },
  textAlign: {
    label: 'Text Align',
    options: ['left', 'center', 'right', 'justify'],
    cssProperty: 'textAlign',
  },
  lineHeight: {
    label: 'Line Height',
    options: ['1', '1.25', '1.5', '1.75', '2', '2.5'],
    cssProperty: 'lineHeight',
  },
  letterSpacing: {
    label: 'Letter Spacing',
    options: ['normal', '0.05em', '0.1em', '-0.05em'],
    cssProperty: 'letterSpacing',
  },
  textDecoration: {
    label: 'Text Decoration',
    options: ['none', 'underline', 'overline', 'line-through'],
    cssProperty: 'textDecoration',
  },
  textTransform: {
    label: 'Text Transform',
    options: ['none', 'uppercase', 'lowercase', 'capitalize'],
    cssProperty: 'textTransform',
  },
  fontStyle: {
    label: 'Font Style',
    options: ['normal', 'italic', 'oblique'],
    cssProperty: 'fontStyle',
  },
  
  // Colors
  color: {
    label: 'Text Color',
    options: [
      '#000000', '#ffffff', '#f44336', '#e91e63', '#9c27b0', '#673ab7',
      '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
      '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722',
      '#795548', '#9e9e9e', '#607d8b'
    ],
    cssProperty: 'color',
    type: 'color',
  },
  backgroundColor: {
    label: 'Background Color',
    options: [
      '#000000', '#ffffff', '#f44336', '#e91e63', '#9c27b0', '#673ab7',
      '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
      '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722',
      '#795548', '#9e9e9e', '#607d8b', 'transparent'
    ],
    cssProperty: 'backgroundColor',
    type: 'color',
  },
  backgroundImage: {
    label: 'Background Image',
    options: ['none', 'url("https://via.placeholder.com/1200x800")', 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)'],
    cssProperty: 'backgroundImage',
  },
  backgroundSize: {
    label: 'Background Size',
    options: ['auto', 'cover', 'contain', '100% 100%'],
    cssProperty: 'backgroundSize',
  },
  backgroundPosition: {
    label: 'Background Position',
    options: ['center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right'],
    cssProperty: 'backgroundPosition',
  },
  backgroundRepeat: {
    label: 'Background Repeat',
    options: ['repeat', 'no-repeat', 'repeat-x', 'repeat-y'],
    cssProperty: 'backgroundRepeat',
  },
  
  // Borders
  borderWidth: {
    label: 'Border Width',
    options: ['0', '1px', '2px', '4px', '8px'],
    cssProperty: 'borderWidth',
  },
  borderStyle: {
    label: 'Border Style',
    options: ['none', 'solid', 'dashed', 'dotted', 'double'],
    cssProperty: 'borderStyle',
  },
  borderColor: {
    label: 'Border Color',
    options: [
      '#000000', '#ffffff', '#f44336', '#e91e63', '#9c27b0', '#673ab7',
      '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
      '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722',
      '#795548', '#9e9e9e', '#607d8b'
    ],
    cssProperty: 'borderColor',
    type: 'color',
  },
  borderRadius: {
    label: 'Border Radius',
    options: ['0', '2px', '4px', '8px', '16px', '24px', '32px', '50%'],
    cssProperty: 'borderRadius',
  },
  
  // Display & Position
  display: {
    label: 'Display',
    options: ['block', 'inline', 'inline-block', 'flex', 'inline-flex', 'grid', 'none'],
    cssProperty: 'display',
  },
  position: {
    label: 'Position',
    options: ['static', 'relative', 'absolute', 'fixed', 'sticky'],
    cssProperty: 'position',
  },
  top: {
    label: 'Top',
    options: ['auto', '0', '50%', '100%', '10px', '20px', '30px'],
    cssProperty: 'top',
  },
  right: {
    label: 'Right',
    options: ['auto', '0', '50%', '100%', '10px', '20px', '30px'],
    cssProperty: 'right',
  },
  bottom: {
    label: 'Bottom',
    options: ['auto', '0', '50%', '100%', '10px', '20px', '30px'],
    cssProperty: 'bottom',
  },
  left: {
    label: 'Left',
    options: ['auto', '0', '50%', '100%', '10px', '20px', '30px'],
    cssProperty: 'left',
  },
  zIndex: {
    label: 'Z-Index',
    options: ['auto', '0', '1', '10', '100', '1000'],
    cssProperty: 'zIndex',
  },
  flexDirection: {
    label: 'Flex Direction',
    options: ['row', 'row-reverse', 'column', 'column-reverse'],
    cssProperty: 'flexDirection',
  },
  flexWrap: {
    label: 'Flex Wrap',
    options: ['nowrap', 'wrap', 'wrap-reverse'],
    cssProperty: 'flexWrap',
  },
  justifyContent: {
    label: 'Justify Content',
    options: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'],
    cssProperty: 'justifyContent',
  },
  alignItems: {
    label: 'Align Items',
    options: ['stretch', 'flex-start', 'flex-end', 'center', 'baseline'],
    cssProperty: 'alignItems',
  },
  alignSelf: {
    label: 'Align Self',
    options: ['auto', 'flex-start', 'flex-end', 'center', 'baseline', 'stretch'],
    cssProperty: 'alignSelf',
  },
  gap: {
    label: 'Gap',
    options: ['0', '4px', '8px', '16px', '24px', '32px', '48px'],
    cssProperty: 'gap',
  },
  
  // Effects
  opacity: {
    label: 'Opacity',
    options: ['0', '0.25', '0.5', '0.75', '1'],
    cssProperty: 'opacity',
  },
  boxShadow: {
    label: 'Box Shadow',
    options: [
      'none',
      '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
      '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
      '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
      '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
      '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)',
    ],
    cssProperty: 'boxShadow',
  },
  transform: {
    label: 'Transform',
    options: [
      'none',
      'translateX(10px)',
      'translateY(10px)',
      'scale(1.1)',
      'rotate(5deg)',
      'skew(5deg)'
    ],
    cssProperty: 'transform',
  },
  filter: {
    label: 'Filter',
    options: [
      'none',
      'blur(5px)',
      'brightness(1.2)',
      'contrast(1.2)',
      'grayscale(50%)',
      'hue-rotate(90deg)',
      'invert(75%)',
      'sepia(50%)',
    ],
    cssProperty: 'filter',
  },
  
  // Animation
  transition: {
    label: 'Transition',
    options: [
      'none',
      'all 0.3s ease',
      'all 0.5s ease',
      'opacity 0.3s ease',
      'transform 0.3s ease'
    ],
    cssProperty: 'transition',
  },
  animation: {
    label: 'Animation',
    options: [
      'none',
      'fadeIn 1s ease',
      'slideIn 0.5s ease',
      'pulse 2s infinite',
      'bounce 1s infinite',
    ],
    cssProperty: 'animation',
  },
  
  // Other
  cursor: {
    label: 'Cursor',
    options: ['auto', 'default', 'pointer', 'help', 'text', 'not-allowed', 'zoom-in', 'zoom-out', 'grab'],
    cssProperty: 'cursor',
  },
  overflow: {
    label: 'Overflow',
    options: ['visible', 'hidden', 'scroll', 'auto'],
    cssProperty: 'overflow',
  },
  userSelect: {
    label: 'User Select',
    options: ['auto', 'none', 'text', 'all'],
    cssProperty: 'userSelect',
  },
};

// Nhóm thuộc tính để hiển thị trong UI
export const propertyGroups = [
  {
    name: 'Layout',
    properties: [
      'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 
      'padding', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',
      'width', 'height', 'maxWidth', 'minWidth'
    ]
  },
  {
    name: 'Typography',
    properties: ['fontSize', 'fontWeight', 'textAlign', 'lineHeight', 'letterSpacing', 'textDecoration', 'textTransform', 'fontStyle']
  },
  {
    name: 'Colors',
    properties: ['color', 'backgroundColor', 'backgroundImage', 'backgroundSize', 'backgroundPosition', 'backgroundRepeat']
  },
  {
    name: 'Borders',
    properties: ['borderWidth', 'borderStyle', 'borderColor', 'borderRadius']
  },
  {
    name: 'Display & Position',
    properties: ['display', 'position', 'top', 'right', 'bottom', 'left', 'zIndex', 'flexDirection', 'flexWrap', 'justifyContent', 'alignItems', 'alignSelf', 'gap']
  },
  {
    name: 'Effects',
    properties: ['opacity', 'boxShadow', 'transform', 'filter', 'transition', 'animation']
  },
  {
    name: 'Other',
    properties: ['cursor', 'overflow', 'userSelect']
  }
];

// Chuyển đổi từ Tailwind classes sang inline styles
export const convertTailwindToInlineStyles = (tailwindClasses) => {
  const styles = {};
  
  // Giản lược - trong ứng dụng thực tế sẽ cần một hàm phức tạp hơn để chuyển đổi
  // từ các Tailwind class sang các inline style tương ứng
  
  return styles;
};

// Tạo CSS từ các thuộc tính đã lưu
export const generateCSSFromProperties = (properties) => {
  let css = '';
  
  for (const [key, value] of Object.entries(properties)) {
    if (value && elementProperties[key]) {
      css += `${elementProperties[key].cssProperty}: ${value};\n`;
    }
  }
  
  return css;
};
