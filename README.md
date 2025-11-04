# Todo Muebles Dashboard

A modern Angular dashboard application for managing the Todo Muebles furniture store website content, appointments, and services.

Note: This project is intended to work with it's frontend project:

```bash
https://github.com/Ferbox44/todoMueblesDashboard-backend?tab=readme-ov-file#project-structure
```

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Building](#building)
- [Project Structure](#project-structure)
- [Key Features](#key-features)

## ✨ Features

- **Authentication System**: JWT-based authentication with route guards
- **Appointment Management**: View and manage customer appointments (Citas)
- **Landing Page Content Management**: 
  - Hero section editor
  - Services carousel editor
  - Videos management
  - Compare section (before/after images)
  - Brands carousel editor
- **Service Details Editor**: Manage individual service pages with projects and images
- **File Upload**: Upload and manage images and videos
- **Modern UI**: Built with PrimeNG components using the Aura theme

## 🛠 Tech Stack

- **Framework**: Angular 19.2.0
- **UI Library**: PrimeNG 19.1.3 with Aura theme
- **Icons**: PrimeIcons 7.0.0
- **Authentication**: @auth0/angular-jwt 5.2.0
- **Language**: TypeScript 5.7.2
- **HTTP Client**: Angular HttpClient with JWT interceptor
- **State Management**: RxJS 7.8.0

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js) or **yarn**
- **Angular CLI** (will be installed as a dev dependency)

## 🚀 Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## ⚙️ Configuration

### Environment Setup

The project uses environment files for configuration:

- **Development**: `src/environments/environment.ts`
- **Production**: `src/environments/environment.prod.ts`

#### Development Configuration

The default development API URL is set to:
```typescript
apiUrl: 'http://localhost:3001/api'
```

#### Production Configuration

Before deploying, update `src/environments/environment.prod.ts` with your production API URL:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api'
};
```

#### Authentication Configuration

The authentication service is currently configured to use:
```typescript
API_URL = 'http://localhost:3001/api/auth'
```

Update this in `src/app/services/auth.service.ts` if your authentication endpoint differs.

## 💻 Development

### Start Development Server

Run the development server:
```bash
npm start
# or
ng serve
```

The application will be available at `http://localhost:4200/`

### Watch Mode

Build and watch for changes:
```bash
npm run watch
```

### Run Tests

Execute unit tests:
```bash
npm test
# or
ng test
```

## 🏗 Building

### Development Build

```bash
ng build
# or
npm run build
```

### Production Build

```bash
ng build --configuration production
```

The build artifacts will be stored in the `dist/todomuebles-dashboard/` directory.

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── citas/              # Appointments component
│   │   ├── dashboard/          # Main dashboard
│   │   ├── file-upload/        # File upload functionality
│   │   ├── layout/             # Main layout with menu
│   │   ├── login/              # Login component
│   │   ├── sections/           # Landing page sections editor
│   │   │   └── service-detail-editor/  # Service detail editor
│   │   └── shared/
│   │       └── menu/           # Navigation menu
│   ├── guards/
│   │   └── auth.guard.ts       # Authentication guard
│   ├── interceptors/
│   │   └── jwt.interceptor.ts  # JWT token interceptor
│   ├── interfaces/             # TypeScript interfaces
│   ├── services/
│   │   ├── appointments.service.ts
│   │   ├── auth.service.ts
│   │   ├── landing-page.service.ts
│   │   ├── service-details.service.ts
│   │   └── upload.service.ts
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts           # Application routes
├── environments/
│   ├── environment.ts          # Development environment
│   └── environment.prod.ts     # Production environment
└── index.html
```

## 🔑 Key Features

### Authentication

- Login with email and password
- JWT token storage in localStorage
- Protected routes with `AuthGuard`
- Automatic token injection via HTTP interceptor
- Logout functionality

### Appointments (Citas)

Manage customer appointments including:
- Customer information
- Project type selection
- Address management
- Appointment scheduling

### Content Management

Edit various sections of the landing page:
- **Hero Section**: Main banner with logo, background image, and title
- **Services Carousel**: Service cards with images and descriptions
- **Videos**: Video gallery management
- **Compare Section**: Before/after comparison images
- **Brands Carousel**: Brand logos and information

### Service Details

Edit individual service pages with:
- Service title and subtitle
- Background images
- Project galleries with multiple image types (material, accessory, main)

### File Upload

- Upload images and videos
- List existing media files
- Manage file assets

## 📝 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run watch` - Build in watch mode
- `npm test` - Run unit tests
- `ng generate component <name>` - Generate a new component
- `ng generate service <name>` - Generate a new service

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

MIT License

## 🐛 Troubleshooting

### Common Issues

**Issue**: API requests failing with CORS errors
- **Solution**: Ensure your backend API has CORS enabled for your development domain

**Issue**: Authentication not working
- **Solution**: Verify the API URL in `auth.service.ts` matches your backend authentication endpoint

**Issue**: Build errors
- **Solution**: Ensure all dependencies are installed with `npm install` and Node.js version is compatible

---

For more information about Angular, visit the [Angular documentation](https://angular.io/docs).
