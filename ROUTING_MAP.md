# Routing Map - Exact Links from remix-of-district-35

## Main Routes (from App.tsx)

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Index | Home page |
| `/tree-solutions` | TreeSolutions | Tree solutions page |
| `/services` | Services | Main services page |
| `/services/plantscaping` | Services | Plantscaping service |
| `/services/tree-customization` | Services | Tree customization service |
| `/services/tree-restoration` | Services | Tree restoration service |
| `/services/green-walls` | Services | Green walls service |
| `/services/planters` | Services | Custom planters service |
| `/services/maintenance` | Services | Maintenance service |
| `/collection` | Collection | Collection page |
| `/projects` | Projects | Projects/Portfolio page |
| `/about` | About | About page |
| `/contact` | Contact | Contact page |
| `/hospitality` | Hospitality | Hospitality page |
| `/flowers` | Flowers | Flowers page |
| `/styling` | Styling | Styling page |
| `/privacy` | NotFound | Privacy policy (not implemented) |
| `/terms` | NotFound | Terms of service (not implemented) |

## Header Navigation Links

### Main Nav Items:
- **DISTRICT** → `/`
- **FLOWERS** → `/flowers`
- **GREENERY** → `/services` (has dropdown)
  - PLANTSCAPING → `/services/plantscaping`
  - TREE SOLUTIONS → `/tree-solutions`
  - PLANT MAINTENANCE → `/services/maintenance`
  - CUSTOM PLANTERS → `/services/planters`
  - GREEN WALLS → `/services/green-walls`
- **STYLING** → `/styling`
- **COLLECTION** → `/collection`
- **CTA Button** → `/projects`

## Footer Links

### Quick Links:
- Services → `/services`
- Collection → `/collection`
- Projects → `/projects`
- About → `/about`
- Contact → `/contact`

### Service Links:
- Plantscaping → `/services/plantscaping`
- Tree Customization → `/services/tree-customization`
- Tree Restoration → `/services/tree-restoration`
- Green Walls → `/services/green-walls`
- Custom Planter Design → `/services/planters`
- Maintenance → `/services/maintenance`

### Legal Links:
- Privacy Policy → `/privacy`
- Terms of Service → `/terms`

## Internal Page Links (from sections/components)

### Home Page Sections:
- **PortfolioSection** → `/projects` (View All Projects button)
- **TreeConsultationPreview** → `/tree-solutions` (Learn More button)
- **TreeConsultationPreview** → `/collection` (View Collection button)
- **ContactSection** → `/contact` (Request Consultation button)
- **OurApproachSection** → `/contact` (CTA button)
- **DifferentiationSection** → `/contact` (CTA link)

### Other Pages:
- **Services page** → `/contact` (CTA button)
- **About page** → `/contact` (CTA button)
- **Hospitality page** → `/contact` (CTA button)
- **Hospitality page** → `/` (Back to home)

## Hero Pages (Transparent Header)
These pages use transparent header with dark hero:
- `/`
- `/flowers`
- `/hospitality`
- `/projects`
- `/tree-solutions`

## Notes
- All service routes (`/services/*`) use the same `Services` component
- Privacy and Terms pages are not implemented (will show 404)
- Admin routes are separate (`/admin/*`)

