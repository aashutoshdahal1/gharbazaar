# GharBazaar Architecture Overview

## System Summary

GharBazaar is a comprehensive real estate platform built for the Nepalese market, allowing users to list, search, and manage property rentals and sales. The system follows a modern full-stack architecture with React frontend and Node.js backend.

## Documentation Index

### 📐 [Wireframes](./wireframes.md)

Complete wireframe designs for all major pages including:

- Homepage with hero section and recent listings
- Property search and filter interface
- Property detail pages with image galleries
- User dashboard and management panels
- Mobile-responsive designs
- Authentication flows

### 🏗️ [UML Diagrams](./uml-diagrams.md)

Comprehensive system design diagrams including:

- System architecture overview
- Database entity relationship diagram
- Class diagrams for backend and frontend
- Sequence diagrams for key user flows
- Component interaction diagrams
- State management visualization

### 📊 [Flowcharts](./flowcharts.md)

Detailed process flows covering:

- User registration and authentication
- Property search and filtering
- Property management (add/edit/delete)
- Messaging system between users
- File upload and image handling
- Dashboard navigation and features
- Application startup sequence

## Key Features Documented

### Core Functionality

- **User Management**: Registration, login, profile management
- **Property Listings**: Add, edit, delete, and browse properties
- **Search & Filter**: Advanced filtering by type, purpose, price, location
- **Image Management**: Multiple image upload with optimization
- **Messaging System**: Communication between property seekers and owners
- **User Dashboard**: Comprehensive management interface
- **Responsive Design**: Mobile and desktop optimized layouts

### Technical Architecture

- **Frontend**: React with Vite, React Router, CSS modules
- **Backend**: Node.js with Express.js REST API
- **Database**: MySQL with normalized schema design
- **Authentication**: JWT-based authentication system
- **File Storage**: Server-side image storage with optimization
- **Security**: Password hashing, token validation, input sanitization

### User Roles & Permissions

- **Regular Users**: Can browse, search, list properties, and communicate
- **Property Owners**: Can manage their listings and respond to inquiries
- **Admin Users**: Have elevated permissions for system management

## Getting Started with Documentation

1. **For UI/UX Design**: Start with [Wireframes](./wireframes.md) to understand the user interface layout
2. **For System Design**: Review [UML Diagrams](./uml-diagrams.md) to understand the technical architecture
3. **For Process Understanding**: Study [Flowcharts](./flowcharts.md) to understand business logic flows
4. **For Development**: Use all three documents together for comprehensive system understanding

## Technology Stack Covered

### Frontend Technologies

- React 18 with functional components and hooks
- React Router for client-side navigation
- CSS modules for styling
- Responsive design principles
- Image lazy loading and optimization

### Backend Technologies

- Node.js runtime environment
- Express.js web framework
- MySQL database with connection pooling
- JWT for authentication
- Multer for file upload handling
- bcrypt for password security

### Development Tools

- Vite for fast development builds
- ESLint for code quality
- Environment variable management
- CORS configuration for cross-origin requests

This documentation provides a complete blueprint for understanding, developing, and maintaining the GharBazaar real estate platform.
