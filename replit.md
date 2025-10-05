# MineSentry - Environmental Monitoring Platform

## Overview

MineSentry is an AI-powered environmental monitoring web application designed to detect and track illegal mining (galamsey) activities in Ghana using satellite imagery and community reporting. The platform combines machine learning predictions with crowdsourced data to provide real-time environmental risk assessments and alert systems.

**Core Purpose**: Enable environmental monitoring teams, researchers, and local communities to identify, track, and respond to illegal mining activities through interactive map visualization, ML-based risk prediction, and collaborative reporting.

**Key Capabilities**:
- Interactive map-based visualization of mining hotspots with risk indicators
- AI-powered analysis using satellite imagery (Landsat, Sentinel, VIIRS)
- Community reporting system with photo uploads and geolocation
- Alert subscription system for region-based notifications
- Explainable AI insights with visualization of detection factors

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with TypeScript using Vite as the build tool

**UI Component System**: 
- **shadcn/ui** components built on Radix UI primitives for accessible, composable interface elements
- **Tailwind CSS** for utility-first styling with custom environmental color palette (greens for forests, blues for water, red/orange for alerts)
- Custom theme system with light/dark mode support stored in localStorage

**State Management**:
- **TanStack Query (React Query)** for server state management, caching, and API data fetching
- **Context API** for global state (authentication, theme preferences)
- Local component state with React hooks for UI interactions

**Key Design Decisions**:
- Component-based architecture with clear separation between presentational and container components
- Type-safe development with TypeScript across client and shared code
- Path aliases (@/, @shared/, @assets/) for clean imports and better code organization
- Mobile-first responsive design with Tailwind breakpoints

### Backend Architecture

**Runtime**: Node.js with Express.js server

**API Design**: RESTful API endpoints under `/api` namespace
- `/api/reports` - CRUD operations for community reports
- `/api/alerts` - Alert subscription management
- `/api/predict` - ML prediction endpoint (placeholder implementation)

**Storage Strategy**:
- **In-Memory Storage** (current): MemStorage class implementing IStorage interface for development
- **Database Ready**: Drizzle ORM configured for PostgreSQL migration with schema definitions
- Interface-based storage pattern allows seamless switching between storage implementations

**Key Design Decisions**:
- Express middleware for request logging and error handling
- Environment-based configuration (development vs production)
- Session management ready (connect-pg-simple configured)
- Type-safe schema validation using Zod for request/response data

### Data Models

**Core Entities** (defined in shared/schema.ts):
- **Users**: Authentication with username/password
- **Hotspots**: Mining locations with risk scores, coordinates, and metadata
- **Community Reports**: User-submitted observations with geolocation, photos, categories, and validation votes
- **Alert Subscriptions**: Region-based notification preferences with frequency settings

**Type Safety**: Shared TypeScript types between frontend and backend using Drizzle ORM schema inference and Zod validation

### Authentication & Authorization

**Provider**: Firebase Authentication
- Google OAuth integration with redirect-based flow
- User context management with real-time auth state tracking
- Protected routes and conditional UI rendering based on auth status

**Session Management**: Firebase session tokens with automatic refresh

### Map & Visualization

**Mapping Library**: Leaflet 1.9+ with React-Leaflet wrappers
- Marker clustering for hotspot density visualization
- Custom marker icons with color-coded risk levels (green <33, orange 33-66, red >66)
- OpenStreetMap base layer with optional satellite overlays

**Data Visualization**: Chart.js 4+ for analytics
- Doughnut charts for confidence breakdowns
- Bar charts for impact metrics
- Trend analysis with time-series data

### ML Integration Architecture

**Model**: Pre-trained Siamese U-Net for galamsey detection
- Input: 256x256 pixel tiles with 8 channels (RGB, NIR, NDVI, NDWI, SAR VV/VH, VIIRS)
- Output: Risk scores, change masks, confidence metrics

**Inference Flow** (placeholder implementation):
1. User selects location/draws polygon on map
2. Frontend sends coordinates to `/api/predict`
3. Backend (future): Fetch satellite data from Google Earth Engine
4. Backend (future): Preprocess and run ML inference
5. Return prediction results with explainability data

## External Dependencies

### Third-Party Services

**Firebase** (Authentication, Storage, Firestore):
- **Purpose**: User authentication via Google OAuth, image storage for community reports, real-time database for reports/alerts
- **Configuration**: Environment variables for API key, project ID, app ID
- **Integration Points**: AuthContext for auth state, ReportModal for file uploads

**Google Earth Engine API** (Future Integration):
- **Purpose**: Satellite imagery data source (Landsat, Sentinel-1, VIIRS)
- **Data**: Monthly composites 2020-2025 for Ghana mining regions
- **Usage**: Backend preprocessing for ML model inputs

**Twilio** (Future Integration):
- **Purpose**: SMS/email notifications for alert subscriptions
- **Configuration**: Requires SID and auth token environment variables

### Database

**Current**: In-memory storage with interface pattern
**Target**: PostgreSQL via Neon Database (@neondatabase/serverless)
- **ORM**: Drizzle ORM with type-safe queries
- **Migration Tool**: drizzle-kit for schema management
- **Connection**: Connection pooling via Neon serverless driver

**Schema Highlights**:
- UUID primary keys with PostgreSQL gen_random_uuid()
- JSONB fields for flexible location/region data
- Timestamp tracking for reports and updates

### UI Component Libraries

**Core Dependencies**:
- **@radix-ui/** primitives: 20+ accessible component primitives (dialog, dropdown, accordion, etc.)
- **class-variance-authority**: Type-safe variant styling
- **cmdk**: Command palette component
- **react-hook-form** + **@hookform/resolvers**: Form management with Zod validation
- **react-dropzone**: File upload handling
- **leaflet.markercluster**: Map marker clustering

### Development Tools

- **Vite**: Fast development server with HMR, optimized production builds
- **TypeScript**: Type safety across entire stack
- **ESBuild**: Production bundling for server code
- **PostCSS + Autoprefixer**: CSS processing pipeline

### Asset Management

**Fonts**: Google Fonts CDN
- Inter: Primary interface font
- Space Grotesk: Display/branding font

**Icons**: 
- Heroicons React components
- Lucide React icons for UI elements

**Map Tiles**: OpenStreetMap tiles via CDN