# MineSentry Design Guidelines

## Design Approach
**System-Based with Environmental Theme**: Utilizing modern web design patterns with a specialized environmental monitoring aesthetic inspired by GIS/mapping platforms like Google Earth Engine, ArcGIS Online, and NASA Worldview.

## Core Design Principles
1. **Data Clarity**: Prioritize information hierarchy for environmental data visualization
2. **Mission-Critical UX**: Design for rapid decision-making in environmental monitoring contexts
3. **Eco-Conscious Aesthetics**: Visual language that reflects environmental stewardship
4. **Accessibility First**: WCAG 2.1 AA compliance for global reach

---

## Color Palette

### Light Mode
- **Primary (Forest Green)**: 120 71% 34% - Main actions, healthy vegetation indicators
- **Secondary (Ocean Blue)**: 211 100% 56% - Water features, informational elements  
- **Alert High Risk**: 16 100% 50% - Critical warnings, galamsey detection zones
- **Alert Medium Risk**: 33 100% 50% - Moderate risk indicators
- **Background**: 0 0% 98% - Main canvas
- **Surface**: 0 0% 100% - Cards, panels
- **Text Primary**: 0 0% 13% - Headings, labels
- **Text Secondary**: 0 0% 45% - Descriptions, metadata

### Dark Mode
- **Primary**: 120 45% 48% - Adjusted for dark backgrounds
- **Secondary**: 211 75% 58% - Enhanced visibility
- **Alert High Risk**: 16 90% 55% - Softened for reduced eye strain
- **Alert Medium Risk**: 33 85% 52%
- **Background**: 0 0% 10% - Deep charcoal base
- **Surface**: 0 0% 14% - Elevated panels
- **Text Primary**: 0 0% 95% - High contrast headings
- **Text Secondary**: 0 0% 70% - Readable descriptions

---

## Typography

### Font Families
- **Primary (Interface)**: Inter (Google Fonts) - Clean, technical readability for data-heavy UI
- **Secondary (Display)**: Space Grotesk (Google Fonts) - Headlines, branding, emphasis

### Type Scale
- **Hero/Display**: text-5xl (3rem) font-bold tracking-tight - "MineSentry" branding
- **Page Headings**: text-3xl (1.875rem) font-semibold - Section titles
- **Panel Headings**: text-xl (1.25rem) font-semibold - Sidebar/panel titles
- **Body Large**: text-base (1rem) font-normal - Primary content
- **Body Small**: text-sm (0.875rem) font-normal - Metadata, captions
- **Labels/Buttons**: text-sm (0.875rem) font-medium uppercase tracking-wide - CTAs, labels

---

## Layout System

### Spacing Primitives
Use Tailwind units: **2, 4, 6, 8, 12, 16** for consistent rhythm
- Tight spacing: p-2, gap-2 (8px) - Compact data displays
- Standard spacing: p-4, gap-4 (16px) - Form fields, list items
- Generous spacing: p-6, gap-6 (24px) - Card padding, section gaps
- Major sections: p-8, p-12 (32-48px) - Panel separations
- Hero/landing: py-16, py-20 (64-80px) - Major visual breaks

### Grid Structure
**Application Layout**:
- Map viewport: 70% width (lg:w-[70%]) - Central focus
- Left sidebar: 20% width (lg:w-[20%]) - Controls, tools
- Right panel: 10% width expandable to max-w-md - Details, predictions
- Mobile: Stack vertically, map at h-[50vh], controls in bottom sheet

**Responsive Breakpoints**:
- Mobile: Base (< 640px) - Single column, bottom drawer navigation
- Tablet: md (768px+) - Partial sidebar, collapsible panels
- Desktop: lg (1024px+) - Full three-panel layout
- Wide: xl (1280px+) - Maximum detail density

---

## Component Library

### Navigation
**Top Navbar** (h-16):
- Logo section: SVG icon of satellite eye over mine pit + "MineSentry" wordmark (Space Grotesk font-bold)
- Slogan: "Guarding Earth's Ecosystems" (text-sm text-secondary)
- Search bar: Fuzzy search with dropdown suggestions (max-w-md)
- User menu: Avatar, login/logout, alert subscriptions badge
- Mode switch: Detection/Analysis tabs with active indicator (border-b-2)
- Date/time display: "October 05, 2025, 08:38 AM GMT" (text-xs)
- Dark mode toggle: Moon/sun icon with smooth transition

**Sidebar** (Left, 20%):
- Accordion sections with chevron icons (React-Accordion pattern)
- "Monitor Hotspots" tool with polygon draw controls
- Filter toggles: Landsat RGB/NIR, Sentinel-1 SAR, VIIRS overlays
- Time-lapse slider (2020-2025) with play/pause controls
- Compact tile size selector: 128/256/512px pills

### Data Displays
**Interactive Map**:
- OpenStreetMap base layer with Ghana boundary outline
- Cluster markers: Green (<33 risk), Orange (33-66), Red (>66)
- Heatmap overlay (Leaflet.heat) with opacity 0.6
- Click interactions: Auto-fill coordinates, show prediction panel
- Hover tooltips: Location name, risk preview (React-Popper)
- Mini-map inset (bottom-right, 150x150px)
- Drawing tools: Polygon selector with dashed stroke

**Risk Prediction Panel** (Right, expandable):
- Loading state: Spinner with "Analyzing satellite data..." text
- Risk score: Radial gauge (Chart.js) with percentage, color-coded
- Confidence breakdown: Horizontal bars (80% optical, 20% SAR)
- Change mask preview: Thumbnail with red overlay at 70% opacity
- Timestamp: "Last updated: 08:38 AM GMT"
- Action buttons: "View Details", "Subscribe to Alerts"

**Explainable AI Section**:
- Saliency heatmap: Grad-CAM overlay on satellite tile
- Feature contribution: Pie chart with legend (NDVI drop, SAR backscatter)
- Summary card: "High risk at Damang due to 40% NDVI drop, 05/10/2025"
- Expandable accordion for technical details

### Forms & Inputs
**Community Reporting Modal**:
- Auto-filled location with map picker
- Photo upload zone (drag-drop with preview, Firebase Storage)
- Category dropdown: Water Pollution, Deforestation, Land Degradation
- Description textarea (max 500 chars)
- Submit button: Primary green with loading spinner

**Alert Subscription**:
- Region selector: Map drawing or predefined dropdown (Tarkwa, Obuasi, Damang)
- Frequency: Radio buttons (Daily, Weekly)
- Delivery: Checkboxes (In-app, Email, SMS)
- Subscribe CTA with notification permission prompt

### Feedback & Status
- Toast notifications: React-Toastify with eco-themed colors
- Success: Green background with check icon
- Error: Red background with alert triangle
- Info: Blue background with info circle
- Progress indicators: Linear bars for batch analysis queue

### Charts & Visualizations
- Trend charts: Line graph (risk over time) with gridlines, Chart.js
- Impact bars: Hectares affected (stacked bar, exportable)
- Comparison views: Side-by-side tiles with React-Split divider
- Forecast bands: Shaded uncertainty regions (6/12 month projections)

---

## Interaction Patterns

### Micro-Interactions
- Hover glow: `bg-opacity-20` with 0.3s transition on cards
- Button states: Scale transform (hover: scale-105) with shadow-lg
- Map markers: Pulse animation for active alerts (keyframes in Tailwind)
- Accordion expand: Smooth height transition with rotate chevron
- Modal entry: Fade-in backdrop (opacity 0 → 100) + slide-up content

### Animations (Minimal Use)
- Page transitions: Fade between Detection/Analysis modes (300ms)
- Prediction reveal: Slide-in from right for results panel (400ms)
- Time-lapse: Crossfade between satellite composite layers (500ms)
- Loading states: Subtle skeleton screens, no aggressive spinners
- Avoid: Parallax, continuous loops, distracting effects

---

## Accessibility

- **Contrast Ratios**: All text >4.5:1, large text >3:1
- **Keyboard Navigation**: Tabindex for all interactive elements, visible focus rings (ring-2 ring-primary)
- **Screen Readers**: Alt text for all map markers, ARIA labels for icon buttons
- **Color Blindness**: Use patterns/icons alongside risk colors (red/green/orange)
- **Dark Mode**: Maintained throughout with same contrast standards

---

## Images

### Required Imagery
1. **Navbar Logo**: SVG illustration of satellite eye over mine pit - stylized, 40x40px, eco-themed colors
2. **Hero Section**: Not applicable (map-centric application, no landing hero)
3. **Satellite Tiles**: 256x256px raster images from GEE - programmatically loaded
4. **Community Reports**: User-uploaded photos in Firebase Storage - thumbnails at 100x100px
5. **Tutorial/Onboarding**: Step-by-step screenshots with annotations (Intro.js)

### Image Treatment
- Map overlays: 70% opacity for change masks
- Photo uploads: Rounded corners (rounded-lg), subtle shadow
- Thumbnails: Lazy load with blur-up placeholder
- Icons: Use Heroicons for consistent, minimal vector graphics

---

## Footer
**Simple, Informative** (py-6 border-t):
- External links: NASA Earth Data, ESA Sentinel, Ghana EPA (new tab icons)
- Internal links: About, Legal, Privacy Policy
- Social proof: "Trusted by 300+ environmental monitors in Ghana"
- Copyright: "© 2025 MineSentry - Guarding Earth's Ecosystems"
- Background: Subtle surface color, text-secondary for links

---

## Branding Elements
- **Name**: MineSentry (capitalized S)
- **Tagline**: "Guarding Earth's Ecosystems" - always paired with logo
- **Voice**: Authoritative yet accessible, mission-driven, data-informed
- **Tone**: Professional environmental monitoring, urgent but not alarmist