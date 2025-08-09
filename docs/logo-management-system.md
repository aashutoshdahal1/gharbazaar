# Logo Management System Documentation

## Overview

The GharBazaar application now has a centralized logo management system that allows admins to upload a logo from the admin dashboard, and it will automatically update across the entire website (navbar and footer).

## How It Works

### 1. Global Logo State Management (`src/utils/logoManager.jsx`)

- **Custom Hook**: `useLogo()` - Manages global logo state across all components
- **Component**: `LogoDisplay` - Reusable logo display component
- **Storage**: Uses localStorage to persist logo across sessions
- **Events**: Custom event system to notify all components when logo changes

### 2. Logo Types Supported

- **Text Logo**: Default "🏠 GharBazaar" emoji + text combination
- **Image Logo**: Uploaded image files (JPG, PNG, SVG, GIF up to 2MB)

### 3. Components Updated

- **Navbar** (`src/components/Navbar.jsx`) - Header logo
- **Homepage Footer** (`src/pages/HomePage.jsx`) - Footer logo
- **Admin Dashboard** (`src/pages/adminDashboard.jsx`) - Admin logo management

### 4. Admin Logo Upload Process

1. Admin logs in at `/admin` with credentials: `admin@gharbazaar.com` / `admin123`
2. Navigate to "Homepage Management" section in admin dashboard
3. Upload new logo file (validates file type and size)
4. Preview the logo before saving
5. Click "Save Logo" to apply globally
6. Logo updates immediately across all website components

### 5. Technical Implementation

#### Logo State Structure

```javascript
{
  text: "🏠 GharBazaar",    // Text version of logo
  image: null,              // Data URL for uploaded image
  useImage: false           // Whether to display image or text
}
```

#### Key Functions

- `useLogo()` - Hook for components to access logo state
- `updateLogo(logoData)` - Updates logo globally
- `LogoDisplay` - Component for displaying logo with different sizes

#### Event System

- Storage events: Detect changes across browser tabs
- Custom events: Immediate updates within same tab
- Real-time sync: All logo instances update simultaneously

### 6. Features

- **Real-time Updates**: Logo changes appear instantly across all components
- **Persistent Storage**: Logo persists across browser sessions
- **File Validation**: Size and type validation for uploaded images
- **Responsive Design**: Logo adapts to different sizes (small, medium, large)
- **Fallback System**: Graceful fallback to default logo if issues occur

### 7. Usage Examples

#### In Components:

```jsx
import { LogoDisplay } from "../utils/logoManager.jsx";

// Basic usage
<LogoDisplay />

// With custom styling and size
<LogoDisplay
  style={{ color: "#blue" }}
  size="large"
  onClick={() => navigate("/")}
/>

// Access logo state directly
const { logo, updateLogo } = useLogo();
```

#### Admin Logo Update:

```jsx
const { updateLogo } = useLogo();

// Update with new image
updateLogo(imageDataURL);

// Update with new text
updateLogo("🏠 MyNewBrand");
```

### 8. File Structure

```
src/
├── utils/
│   └── logoManager.jsx     # Logo management system
├── components/
│   └── Navbar.jsx          # Uses LogoDisplay
├── pages/
│   ├── HomePage.jsx        # Uses LogoDisplay in footer
│   └── adminDashboard.jsx  # Logo upload interface
```

### 9. Future Enhancements

- Backend API integration for logo storage
- Image optimization and resizing
- Multiple logo variants (dark/light themes)
- Logo history and version management
- Batch logo updates for multi-tenant systems

### 10. Testing

1. Visit homepage - check navbar and footer logos
2. Login to admin panel
3. Upload different logo types
4. Verify real-time updates across all pages
5. Test logo persistence after page refresh
6. Test logo sync across multiple browser tabs
