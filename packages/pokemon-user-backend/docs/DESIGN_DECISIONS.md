# Pokémon User Backend
## Design Decisions Documentation

### Module / Folder Structure

```
pokemon-user-backend/
├── scripts/
│   └── seed-pokemon.js
├── data/
│   └── pokemon.gen1.json
├── src/
│   ├── modules/
│   │   ├── profiles/
│   │   │   ├── profiles.module.ts
│   │   │   ├── profiles.controller.ts
│   │   │   └── profiles.service.ts
│   │   └── pokemon/
│   │       ├── pokemon.module.ts
│   │       ├── pokemon.controller.ts
│   │       └── pokemon.service.ts
│   └── database/
│       ├── db.module.ts
│       ├── db-config.service.ts
│       ├── db.ts
│       ├── data-source.ts
│       └── entities/
│           ├── profile.entity.ts
│           └── pokemon.entity.ts
└── docs/
    ├── ARCHITECTURE.md
    └── DESIGN_DECISIONS.md
```

### Feature Requirements Assumptions
- **Profiles:** 
    - A 'profile' is like a 'visitor' and not a 'user'
        - The visitor does not need login/auth (currently)
        - They do not have exclusive access to profiles (or the teams they create)
    - A visitor may create a new profile or temporarily select a pre-existing profile and team from that profile (this enables future options of multi-user, realtime play)
    - When a visitor creates a profile, that profile may create multiple teams of up to 6 Pokémon each (TODO: we will ultimately need some limits for security and usability)
    - Teams only exist because the profile exists and persists
    - Teams are public; any visitor can view or associate with existing teams
- **Pokémon:**
    - For now, the only specific fields for identifying Pokémon are name and pokédex number
    - We don't (yet) need regions, moves, evolutions, types, et. al.
    - Pokémon are only incidentally included in certain profiles. They know nothing about profiles.
    - Pokémon are immutable reference objects; they do not track which profiles or teams include them
 
### Design Goals
- **Need-to-have:** Observability — clear CRUD endpoints, well-documented input/output schemas, helpful error messages, auditable async transactions. Storage of 150 Pokémon is a hard scope marker. Emphasize functionality and robustness before increasing data volume or complexity.
- **Nice-to-have:** Scalability — while high-volume or distributed systems are out of scope, design choices should allow future expansion beyond 150 Pokémon without major refactoring.

### Data Sources, DB Seeding, TypeORM, & Migrations
Our database is seeded from a JSON files fetched from PokéAPI. This approach gives us a canonical data source, an established indexing strategy, and a clear version structure.
#### To seed the database:
```bash
pnpm nx run pokemon-user-backend:seed:pokemon
```  

### Swagger API & Endpoints
Swagger is configured and can be found at the `/api/docs` endpoint from the local server. This setup is minimal for now and intended to assist feature development and improve observability.  

### Status Messages
TODO: Provide detail here in the upcoming dev phase focused on API code.