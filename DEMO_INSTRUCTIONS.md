# Demo Instructions - Enhanced Vue HTML Builder with New Elements

## 🆕 **Các Element Mới Đã Thêm:**

### **1. Basic Elements:**
- **Link** - Tạo liên kết với URL, target options
- **List** - Danh sách có thứ tự (ol) hoặc không có thứ tự (ul)

### **2. Layout Elements:**
- **Grid** - Layout dạng lưới với số cột và khoảng cách tùy chỉnh
- **Card** - Thẻ với hình ảnh, tiêu đề, nội dung và button

### **3. Form Elements:**
- **Form** - Biểu mẫu với nhiều loại input field
- **Dropdown** - Select dropdown với options tùy chỉnh

### **4. Navigation Elements:**
- **Navigation** - Thanh điều hướng với brand và menu items

### **5. Data Elements:**
- **Table** - Bảng dữ liệu với headers và rows

## 🎯 **Cách Test Các Element Mới:**

### **Grid Element:**
1. Drag **Grid** từ Layout category
2. Properties → Content tab:
   - Sửa số cột (columns)
   - Sửa khoảng cách (gap)
   - Add/remove grid items
3. Test responsive với different breakpoints

### **Link Element:**
1. Drag **Link** từ Basic category
2. Properties → Content tab:
   - Sửa Link Text
   - Sửa URL (href)
   - Chọn Target (Same Window/_blank)
3. Styles tab: Customize màu sắc, underline, hover effects

### **Dropdown Element:**
1. Drag **Dropdown** từ Forms category
2. Properties → Content tab:
   - Sửa Label
   - Add/Remove Options với Value và Label khác nhau
   - Test nhiều options
3. Styles tab: Customize border, padding, background

### **Table Element:**
1. Drag **Table** từ Data category
2. Properties → Content tab (sẽ thêm trong phiên bản tiếp theo):
   - Xem headers: Name, Email, Role
   - Xem data rows mẫu
3. Styles tab: Customize borders, padding, background

### **Card Element:**
1. Drag **Card** từ Layout category
2. Properties → Content tab:
   - Sửa Title
   - Sửa Content
   - Sửa Image URL
   - Sửa Button Text
3. Test responsive design

### **Navigation Element:**
1. Drag **Navigation** từ Navigation category
2. Properties → Content tab (sẽ thêm trong phiên bản tiếp theo):
   - Sửa Brand name
   - Add/Remove navigation items
3. Test mobile responsive menu

### **Form Element:**
1. Drag **Form** từ Forms category
2. Properties → Content tab:
   - Sửa Form Title
   - Xem các field types: text, email, textarea
   - Sửa Submit button text
3. Styles tab: Customize form styling

### **List Element:**
1. Drag **List** từ Basic category
2. Properties → Content tab:
   - Chọn List Type (ul/ol)
   - Add/Remove list items
   - Edit item text
3. Styles tab: Customize list styling, spacing

## 🔧 **Advanced Features:**

### **Multi-Element Layouts:**
- Combine **Container** + **Grid** + **Card** cho gallery layouts
- Use **Navigation** + **Hero** + **Features** cho complete landing pages
- Mix **Form** + **Table** cho data management interfaces

### **Export Testing:**
1. Build layout với mixed elements
2. Test tất cả 3 output modes:
   - **Tailwind CSS** - Classes-based
   - **Inline Styles** - Style attributes
   - **CSS Classes** - Custom CSS classes
3. Verify HTML export quality và responsive design

### **Template System:**
- Save layouts với new elements as templates
- Test template loading/saving functionality

## 🎨 **Style Customization Examples:**

### **Grid Styling:**
- Gap: `16px`, `1rem`, `2em`
- Grid columns: `3`, `4`, `auto-fit`
- Custom grid-template-columns: `1fr 2fr 1fr`

### **Table Styling:**
- Border: `1px solid #ddd`, `2px solid #333`
- Cell padding: `8px`, `12px 16px`
- Header background: `#f5f5f5`, `#e3f2fd`

### **Form Styling:**
- Input padding: `8px 12px`, `10px 15px`
- Border radius: `4px`, `8px`, `0`
- Focus colors: `#007bff`, `#28a745`

### **Navigation Styling:**
- Background: `#333`, `#2c3e50`, `linear-gradient(...)`
- Text color: `white`, `#ecf0f1`
- Hover effects: `rgba(255,255,255,0.1)`

## 🚀 **Tips & Best Practices:**

1. **Responsive Design**: Test các element ở different screen sizes
2. **Accessibility**: Ensure proper form labels và table headers
3. **Performance**: Optimize images trong cards và hero sections
4. **Semantic HTML**: Các element export proper semantic tags
5. **Cross-browser**: Test exported HTML trong different browsers

## 📊 **Element Categories Overview:**

| Category | Elements | Use Cases |
|----------|----------|-----------|
| **Basic** | Header, Paragraph, Button, Image, Link, List | Content creation, basic layouts |
| **Layout** | Container, Grid, Card | Page structure, content organization |
| **Forms** | Form, Dropdown | User interaction, data collection |
| **Navigation** | Navigation | Site navigation, menus |
| **Data** | Table | Data display, comparisons |
| **Sections** | Hero, Features, CTA | Landing pages, marketing |

Với các element mới này, bạn có thể tạo ra những website hoàn chỉnh và professional hơn nhiều! 🎉
