// Định nghĩa các thuộc tính có thể chỉnh sửa cho các component
export const elementProperties = {
  // Layout - Value properties (có thể nhập tự do)
  margin: {
    label: 'Margin',
    type: 'value',
    defaultOptions: ['0', '4px', '8px', '16px', '24px', '32px', '48px', '64px'],
    cssProperty: 'margin',
    placeholder: 'e.g. 16px, 1rem, auto'
  },
  marginTop: {
    label: 'Margin Top',
    type: 'value',
    defaultOptions: ['0', '4px', '8px', '16px', '24px', '32px', '48px', '64px'],
    cssProperty: 'marginTop',
    placeholder: 'e.g. 16px, 1rem, auto'
  },
  marginBottom: {
    label: 'Margin Bottom',
    type: 'value',
    defaultOptions: ['0', '4px', '8px', '16px', '24px', '32px', '48px', '64px'],
    cssProperty: 'marginBottom',
    placeholder: 'e.g. 16px, 1rem, auto'
  },
  marginLeft: {
    label: 'Margin Left',
    type: 'value',
    defaultOptions: ['0', '4px', '8px', '16px', '24px', '32px', '48px', '64px'],
    cssProperty: 'marginLeft',
    placeholder: 'e.g. 16px, 1rem, auto'
  },
  marginRight: {
    label: 'Margin Right',
    type: 'value',
    defaultOptions: ['0', '4px', '8px', '16px', '24px', '32px', '48px', '64px'],
    cssProperty: 'marginRight',
    placeholder: 'e.g. 16px, 1rem, auto'
  },
  padding: {
    label: 'Padding',
    type: 'value',
    defaultOptions: ['0', '4px', '8px', '16px', '24px', '32px', '48px', '64px'],
    cssProperty: 'padding',
    placeholder: 'e.g. 16px, 1rem, 10px 20px'
  },
  paddingTop: {
    label: 'Padding Top',
    type: 'value',
    defaultOptions: ['0', '4px', '8px', '16px', '24px', '32px', '48px', '64px'],
    cssProperty: 'paddingTop',
    placeholder: 'e.g. 16px, 1rem'
  },
  paddingBottom: {
    label: 'Padding Bottom',
    type: 'value',
    defaultOptions: ['0', '4px', '8px', '16px', '24px', '32px', '48px', '64px'],
    cssProperty: 'paddingBottom',
    placeholder: 'e.g. 16px, 1rem'
  },
  paddingLeft: {
    label: 'Padding Left',
    type: 'value',
    defaultOptions: ['0', '4px', '8px', '16px', '24px', '32px', '48px', '64px'],
    cssProperty: 'paddingLeft',
    placeholder: 'e.g. 16px, 1rem'
  },
  paddingRight: {
    label: 'Padding Right',
    type: 'value',
    defaultOptions: ['0', '4px', '8px', '16px', '24px', '32px', '48px', '64px'],
    cssProperty: 'paddingRight',
    placeholder: 'e.g. 16px, 1rem'
  },
  width: {
    label: 'Width',
    type: 'value',
    defaultOptions: ['auto', '25%', '50%', '75%', '100%', '200px', '300px', '400px', '500px', '600px', 'fit-content', 'max-content', 'min-content'],
    cssProperty: 'width',
    placeholder: 'e.g. 300px, 50%, auto'
  },
  height: {
    label: 'Height',
    type: 'value',
    defaultOptions: ['auto', '100px', '200px', '300px', '400px', '500px', '100%', 'fit-content', 'max-content', 'min-content'],
    cssProperty: 'height',
    placeholder: 'e.g. 200px, 100%, auto'
  },
  maxWidth: {
    label: 'Max Width',
    type: 'value',
    defaultOptions: ['none', '100%', '300px', '500px', '800px', '1000px', '1200px'],
    cssProperty: 'maxWidth',
    placeholder: 'e.g. 1200px, 100%, none'
  },
  minWidth: {
    label: 'Min Width',
    type: 'value',
    defaultOptions: ['0', '100px', '200px', '300px', '400px', '500px'],
    cssProperty: 'minWidth',
    placeholder: 'e.g. 200px, 0'
  },
  
  // Typography - Mixed value and enum properties
  fontSize: {
    label: 'Font Size',
    type: 'value',
    defaultOptions: ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px', '64px'],
    cssProperty: 'fontSize',
    placeholder: 'e.g. 16px, 1.2rem, 1.5em'
  },
  fontWeight: {
    label: 'Font Weight',
    type: 'enum',
    options: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
    cssProperty: 'fontWeight',
  },
  textAlign: {
    label: 'Text Align',
    type: 'enum',
    options: ['left', 'center', 'right', 'justify'],
    cssProperty: 'textAlign',
  },
  lineHeight: {
    label: 'Line Height',
    type: 'value',
    defaultOptions: ['1', '1.25', '1.5', '1.75', '2', '2.5'],
    cssProperty: 'lineHeight',
    placeholder: 'e.g. 1.5, 24px, 1.2em'
  },
  letterSpacing: {
    label: 'Letter Spacing',
    type: 'value',
    defaultOptions: ['normal', '0.05em', '0.1em', '-0.05em'],
    cssProperty: 'letterSpacing',
    placeholder: 'e.g. 0.1em, 2px, normal'
  },
  textDecoration: {
    label: 'Text Decoration',
    type: 'enum',
    options: ['none', 'underline', 'overline', 'line-through'],
    cssProperty: 'textDecoration',
  },
  textTransform: {
    label: 'Text Transform',
    type: 'enum',
    options: ['none', 'uppercase', 'lowercase', 'capitalize'],
    cssProperty: 'textTransform',
  },
  fontStyle: {
    label: 'Font Style',
    type: 'enum',
    options: ['normal', 'italic', 'oblique'],
    cssProperty: 'fontStyle',
  },
  
  // Colors
  color: {
    label: 'Text Color',
    type: 'color',
    options: [
      '#000000', '#ffffff', '#f44336', '#e91e63', '#9c27b0', '#673ab7',
      '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
      '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722',
      '#795548', '#9e9e9e', '#607d8b'
    ],
    cssProperty: 'color',
  },
  backgroundColor: {
    label: 'Background Color',
    type: 'color',
    options: [
      '#000000', '#ffffff', '#f44336', '#e91e63', '#9c27b0', '#673ab7',
      '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
      '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722',
      '#795548', '#9e9e9e', '#607d8b', 'transparent'
    ],
    cssProperty: 'backgroundColor',
  },
  backgroundImage: {
    label: 'Background Image',
    type: 'value',
    defaultOptions: ['none', 'url("https://via.placeholder.com/1200x800")', 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)'],
    cssProperty: 'backgroundImage',
    placeholder: 'e.g. url("image.jpg"), linear-gradient(...)'
  },
  backgroundSize: {
    label: 'Background Size',
    type: 'enum',
    options: ['auto', 'cover', 'contain', '100% 100%'],
    cssProperty: 'backgroundSize',
  },
  backgroundPosition: {
    label: 'Background Position',
    type: 'enum',
    options: ['center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right'],
    cssProperty: 'backgroundPosition',
  },
  backgroundRepeat: {
    label: 'Background Repeat',
    type: 'enum',
    options: ['repeat', 'no-repeat', 'repeat-x', 'repeat-y'],
    cssProperty: 'backgroundRepeat',
  },
  
  // Borders
  borderWidth: {
    label: 'Border Width',
    type: 'value',
    defaultOptions: ['0', '1px', '2px', '4px', '8px'],
    cssProperty: 'borderWidth',
    placeholder: 'e.g. 1px, 2px, 0'
  },
  borderStyle: {
    label: 'Border Style',
    type: 'enum',
    options: ['none', 'solid', 'dashed', 'dotted', 'double'],
    cssProperty: 'borderStyle',
  },
  borderColor: {
    label: 'Border Color',
    type: 'color',
    options: [
      '#000000', '#ffffff', '#f44336', '#e91e63', '#9c27b0', '#673ab7',
      '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
      '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722',
      '#795548', '#9e9e9e', '#607d8b'
    ],
    cssProperty: 'borderColor',
  },
  borderRadius: {
    label: 'Border Radius',
    type: 'value',
    defaultOptions: ['0', '2px', '4px', '8px', '16px', '24px', '32px', '50%'],
    cssProperty: 'borderRadius',
    placeholder: 'e.g. 8px, 50%, 10px 20px'
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
  
  // Display & Position
  display: {
    label: 'Display',
    type: 'enum',
    options: ['block', 'inline', 'inline-block', 'flex', 'inline-flex', 'grid', 'none'],
    cssProperty: 'display',
  },
  position: {
    label: 'Position',
    type: 'enum',
    options: ['static', 'relative', 'absolute', 'fixed', 'sticky'],
    cssProperty: 'position',
  },
  top: {
    label: 'Top',
    type: 'value',
    defaultOptions: ['auto', '0', '50%', '100%', '10px', '20px', '30px'],
    cssProperty: 'top',
    placeholder: 'e.g. 10px, 50%, auto'
  },
  right: {
    label: 'Right',
    type: 'value',
    defaultOptions: ['auto', '0', '50%', '100%', '10px', '20px', '30px'],
    cssProperty: 'right',
    placeholder: 'e.g. 10px, 50%, auto'
  },
  bottom: {
    label: 'Bottom',
    type: 'value',
    defaultOptions: ['auto', '0', '50%', '100%', '10px', '20px', '30px'],
    cssProperty: 'bottom',
    placeholder: 'e.g. 10px, 50%, auto'
  },
  left: {
    label: 'Left',
    type: 'value',
    defaultOptions: ['auto', '0', '50%', '100%', '10px', '20px', '30px'],
    cssProperty: 'left',
    placeholder: 'e.g. 10px, 50%, auto'
  },
  zIndex: {
    label: 'Z-Index',
    type: 'value',
    defaultOptions: ['auto', '0', '1', '10', '100', '1000'],
    cssProperty: 'zIndex',
    placeholder: 'e.g. 10, 999, auto'
  },
  flexDirection: {
    label: 'Flex Direction',
    type: 'enum',
    options: ['row', 'row-reverse', 'column', 'column-reverse'],
    cssProperty: 'flexDirection',
  },
  flexWrap: {
    label: 'Flex Wrap',
    type: 'enum',
    options: ['nowrap', 'wrap', 'wrap-reverse'],
    cssProperty: 'flexWrap',
  },
  justifyContent: {
    label: 'Justify Content',
    type: 'enum',
    options: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'],
    cssProperty: 'justifyContent',
  },
  alignItems: {
    label: 'Align Items',
    type: 'enum',
    options: ['stretch', 'flex-start', 'flex-end', 'center', 'baseline'],
    cssProperty: 'alignItems',
  },
  alignSelf: {
    label: 'Align Self',
    type: 'enum',
    options: ['auto', 'flex-start', 'flex-end', 'center', 'baseline', 'stretch'],
    cssProperty: 'alignSelf',
  },
  gap: {
    label: 'Gap',
    type: 'value',
    defaultOptions: ['0', '4px', '8px', '16px', '24px', '32px', '48px'],
    cssProperty: 'gap',
    placeholder: 'e.g. 16px, 1rem, 10px 20px'
  },
  
  // Effects
  opacity: {
    label: 'Opacity',
    type: 'value',
    defaultOptions: ['0', '0.25', '0.5', '0.75', '1'],
    cssProperty: 'opacity',
    placeholder: 'e.g. 0.8, 1, 0.5'
  },
  boxShadow: {
    label: 'Box Shadow',
    type: 'value',
    defaultOptions: [
      'none',
      '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
      '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
      '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
      '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
      '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)',
    ],
    cssProperty: 'boxShadow',
    placeholder: 'e.g. 0 4px 8px rgba(0,0,0,0.1)'
  },
  transform: {
    label: 'Transform',
    type: 'value',
    defaultOptions: [
      'none',
      'translateX(10px)',
      'translateY(10px)',
      'scale(1.1)',
      'rotate(5deg)',
      'skew(5deg)'
    ],
    cssProperty: 'transform',
    placeholder: 'e.g. scale(1.1), rotate(45deg)'
  },
  filter: {
    label: 'Filter',
    type: 'value',
    defaultOptions: [
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
    placeholder: 'e.g. blur(5px), brightness(1.2)'
  },
  
  // Animation
  transition: {
    label: 'Transition',
    type: 'value',
    defaultOptions: [
      'none',
      'all 0.3s ease',
      'all 0.5s ease',
      'opacity 0.3s ease',
      'transform 0.3s ease'
    ],
    cssProperty: 'transition',
    placeholder: 'e.g. all 0.3s ease, opacity 0.5s'
  },
  animation: {
    label: 'Animation',
    type: 'value',
    defaultOptions: [
      'none',
      'fadeIn 1s ease',
      'slideIn 0.5s ease',
      'pulse 2s infinite',
      'bounce 1s infinite',
    ],
    cssProperty: 'animation',
    placeholder: 'e.g. fadeIn 1s ease, pulse 2s infinite'
  },
  
  // Other - Mixed types
  cursor: {
    label: 'Cursor',
    type: 'enum',
    options: ['auto', 'default', 'pointer', 'help', 'text', 'not-allowed', 'zoom-in', 'zoom-out', 'grab'],
    cssProperty: 'cursor',
  },
  overflow: {
    label: 'Overflow',
    type: 'enum',
    options: ['visible', 'hidden', 'scroll', 'auto'],
    cssProperty: 'overflow',
  },
  userSelect: {
    label: 'User Select',
    type: 'enum',
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
