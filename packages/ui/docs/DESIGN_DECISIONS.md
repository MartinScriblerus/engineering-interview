# Standalone UI System
## Design Decisions Documentation

### Module / Folder Structure

```
pokemon-user-backend/
├── src/
│   ├── lib/                # Atomic components (each subfolder below contains a component and a test)
│   │   ├── button/         
│   │   ├── canvas/
│   │   ├── container/      
│   │   ├── dropdown/
│   │   ├── footer/
│   │   ├── form/
│   │   ├── grid/
│   │   ├── header/
│   │   ├── image/
│   │   ├── main/
│   │   ├── modal/
│   │   ├── panel/
│   │   ├── portal/
│   │   ├── section/
│   │   ├── spacer/
│   │   ├── stack/
│   │   ├── typography
│   │   └── viewport
│   │   
│   └── utils/              # Shared helpers (non-visual)
│   │   └── portal.ts       # React Portal helper
│   │   
│   └── index.ts
│   
└── docs/
    ├── ARCHITECTURE.md
    └── DESIGN_DECISIONS.md
```

### UI Library
The UI System is a standalone, reusable design system built for the NX monorepo. It provides:
- **Atomic components** (buttons, inputs, dropdowns, containers, modals, etc.)
- **Utility functions** (portal, classNames, etc.)
- **Composable building blocks** for feature-specific implementations like Pokémon-UI.
- Consistency in styling, accessibility, and theming across all subprojects.

### Design Goals
- **Need-to-have:** Accessible — available across nx monorepo, enforces norms (of usage, theming, clarity, and baselines) across a set of default components.
- **Nice-to-have:** Atomic — offers primitive forms that are composable into more complex structures. Separates baseline principles and modular components from specific implementations in packages. 

