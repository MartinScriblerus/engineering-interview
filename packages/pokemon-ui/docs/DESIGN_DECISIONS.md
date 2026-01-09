# Pokémon-UI
## Design Decisions Documentation

### Framework and Tooling
The pokemon-ui code implements React 18.3 with some specific implementations for rendering and maintainability. 

* Router – Currently using routes to toggle components. This supports future scaling to multi-page or multi-microservice setups.
* Context – Lightweight state management to avoid prop drilling, simpler than Redux for this MVP.
* Portals – Planned for rendering components outside the normal React tree (modals, tooltips). Implementation in the UI System.
* Suspense – Planned for lazy-loading components to improve initial render performance. Implementation TBD.

This repository will contain ** specific implementations ** for Pokémon-UI. See the UI System for generic components shared across subprojects.

### Module / Folder Structure
```
packages/pokemon-ui/
├── index.html
├── project.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.spec.json
├── vite.config.ts
├── docs/
│   └── DESIGN_DECISIONS.md
├── public/
├── src/
│   ├── main.tsx
│   ├── app/
│   │   ├── app.spec.tsx
│   │   ├── app.tsx
│   │   ├── nx-welcome.tsx
│   │   ├── providers.tsx
│   │   └── router.tsx
│   ├── assets/
│   ├── components/
│   │   ├── history-dashboard/
│   │   │   └── HistoryDashboard.tsx
│   │   ├── home/
│   │   │   └── Home.tsx
│   │   ├── profile-selection/
│   │   │   └── ProfileSelection.tsx
│   │   ├── team-selection/
│   │   │   └── TeamSelection.tsx
│   │   └── layout/
│   │       └── AppFrame.tsx
│   ├── contexts/
│   │   └── MainContext.tsx
│   └── utils/
│       utils/
│        ├── portal.ts
│        ├── api.ts
│        └── helpers.ts
└── README.md (optional)
```

### Key Components:
- AppFrame – global layout wrapper
- ProfileSelection – select/create a profile
- TeamSelection – select up to 6 Pokémon for a team
- HistoryDashboard – view previously created teams

### Design Goals
- **Need-to-have:** Users must be able to create teams of up to 6 Pokémon. UI ensures semantic clarity for profile selection, team selection, and Pokémon selection. Styling is minimal, focusing on functional layout and accessibility.
- **Nice-to-have:** Ease-of-use enhancements, e.g., search-enabled dropdowns for Pokémon and Profiles to quickly find options. This improves the UX without impacting core functionality.
