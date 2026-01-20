# Architecture Decision Records (ADRs)

This document records the architectural decisions made during the personal website project development.

---

## ADR-001: Repository Structure - Monorepo vs Multi-repo

**Date**: 2026-01-20  
**Status**: Accepted  
**Context**: Need to decide on repository structure for Vue frontend, FastAPI backend, and Strapi CMS

### Decision
Use a **monorepo structure** with packages for each service.

### Rationale
**Pros of Monorepo:**
- Single developer project - reduced management overhead
- Shared TypeScript types between frontend and backend
- Atomic commits across all services
- Simplified CI/CD pipeline
- Easier dependency coordination
- Single clone for development setup

**Cons Considered:**
- Larger repository size
- Potential for unrelated changes in same commit
- Less granular access control

**Alternative Rejected**: Separate repositories for each service
- Would complicate shared type management
- Requires complex coordination for API changes
- Multiple repositories to maintain for single developer

### Consequences
- Developers need to clone only one repository
- Shared types package enables type safety across services
- CI/CD can deploy all services atomically
- Dependency updates affect entire project

---

## ADR-002: Authentication Strategy - Unified vs Separate

**Date**: 2026-01-20  
**Status**: Accepted  
**Context**: Need authentication system for FastAPI backend while using Strapi CMS

### Decision
Use **Strapi's native JWT authentication** for both Strapi and FastAPI with shared secret validation.

### Rationale
**Benefits:**
- Single source of truth for user management
- No duplicate authentication systems
- Leverages Strapi's built-in refresh token support
- Professional security with 15-minute access tokens
- FastAPI validates tokens without additional auth logic

**Implementation:**
- Strapi configured with `jwtManagement: 'refresh'` mode
- FastAPI middleware validates Strapi JWTs using shared `JWT_SECRET`
- Frontend manages token refresh automatically

**Alternative Rejected**: Separate FastAPI authentication
- Would duplicate user management
- Complex user synchronization between services
- Additional maintenance overhead

### Consequences
- Simplified user management through Strapi admin
- Consistent authentication across all services
- Enhanced security with refresh token pattern
- FastAPI depends on Strapi for user validation

---

## ADR-003: Database Architecture - Single vs Multiple Databases

**Date**: 2026-01-20  
**Status**: Accepted  
**Context**: Need database design for Strapi content and custom FastAPI data

### Decision
Use **single PostgreSQL instance** with separate schemas for `strapi` and `app` data.

### Rationale
**Benefits:**
- Reduced infrastructure complexity
- Shared connection pooling
- Simplified backup and maintenance
- Clear data separation through schemas
- Cost-effective for single deployment

**Schema Design:**
- `strapi` schema: CMS content (blog posts, projects, media, users)
- `app` schema: Custom application data (analytics, preferences, logs)

**Alternative Rejected**: Separate databases per service
- Increased infrastructure complexity
- Higher resource usage
- More complex backup strategies
- Potential for connection pool fragmentation

### Consequences
- Single database instance to maintain
- Schema-level permissions for security
- Simplified deployment and backup procedures
- Both services share database resources

---

## ADR-004: Storage Strategy - Abstract Interface

**Date**: 2026-01-20  
**Status**: Accepted  
**Context**: Need flexible file storage supporting development and cloud scaling

### Decision
Implement **abstract storage interface** with pluggable providers.

### Rationale
**Benefits:**
- Start with local storage for development
- Easy migration to S3/CloudFlare R2 for production
- No vendor lock-in
- Configuration-driven provider switching
- Consistent API across storage types

**Providers Implemented:**
- **LocalFileStorage**: Development and small deployments
- **S3Storage**: AWS cloud storage (factory ready)
- **CloudflareR2Storage**: Cost-effective alternative (factory ready)

**Design Pattern**: Factory pattern for provider instantiation based on environment configuration

**Alternative Rejected**: Direct S3 integration
- Would lock into specific cloud provider
- No flexibility for cost optimization
- Difficult local development

### Consequences
- Easy switching between storage providers
- Consistent file management API
- Future-proof for cloud migration
- Additional abstraction layer to maintain

---

## ADR-005: Frontend State Management - Pinia vs Vuex

**Date**: 2026-01-20  
**Status**: Accepted  
**Context**: Need state management solution for Vue 3 application

### Decision
Use **Pinia** as the state management solution.

### Rationale
**Benefits:**
- Official recommendation for Vue 3
- Better TypeScript support than Vuex
- Simpler API with composition functions
- Built-in DevTools support
- Modular store design

**Store Structure:**
- `useAppStore`: Global app state, notifications, loading
- `useAuthStore`: Authentication state, user management

**Alternative Rejected**: Vuex 4
- More verbose syntax
- Less optimal TypeScript integration
- Legacy approach for Vue 3

### Consequences
- Modern, maintainable state management
- Excellent TypeScript integration
- Simplified store definition and usage
- Better development experience

---

## ADR-006: Content Management Strategy - Direct vs Proxy

**Date**: 2026-01-20  
**Status**: Accepted  
**Context**: How should frontend consume content from Strapi and FastAPI?

### Decision
Use **hybrid approach** mixing direct Strapi calls with FastAPI proxy.

### Rationale
**Direct Strapi for:**
- Simple CRUD operations
- File uploads and media management
- Basic content retrieval
- User authentication

**FastAPI Proxy for:**
- Complex business logic
- Data aggregation and transformation
- Third-party service integration
- Custom analytics and metrics

**Benefits:**
- Leverages Strapi's strengths for content management
- Maintains flexibility for custom operations
- Optimal performance for simple operations
- Centralized complex logic in FastAPI

**Alternative Rejected**: All through FastAPI proxy
- Would duplicate Strapi's built-in features
- Additional development overhead
- Potential performance bottleneck

### Consequences
- Frontend needs to know about both APIs
- More complex service layer in frontend
- Optimal performance and feature utilization
- Clear separation of concerns

---

## ADR-007: Containerization - Docker Compose vs Kubernetes

**Date**: 2026-01-20  
**Status**: Accepted  
**Context**: Container orchestration for development and initial production

### Decision
Use **Docker Compose** for both development and initial production deployment.

### Rationale
**Benefits for Current Scope:**
- Simpler configuration and management
- Suitable for single-node deployment
- Excellent development experience
- Clear service dependencies
- Easy environment variable management

**Development Features:**
- Hot reload with volume mounts
- Service networking
- Health checks
- Environment isolation

**Production Features:**
- Multi-stage builds for optimization
- Non-root users for security
- Persistent volumes for data
- Resource constraints

**Alternative Considered**: Kubernetes
- Overkill for single-developer project
- Complex setup and maintenance
- Higher learning curve
- Can migrate later if scaling needs arise

### Consequences
- Simple deployment and maintenance
- Easy local development setup
- Single-node deployment limitation
- Future Kubernetes migration possible

---

## ADR-008: Styling Strategy - Tailwind CSS vs CSS Modules

**Date**: 2026-01-20  
**Status**: Accepted  
**Context**: CSS strategy for Vue 3 frontend with maintainability and performance

### Decision
Use **Tailwind CSS** with custom component classes.

### Rationale
**Benefits:**
- Utility-first approach for rapid development
- Consistent design system
- Excellent purging for production builds
- Great developer experience with IntelliSense
- Easy responsive design

**Implementation:**
- Base Tailwind configuration
- Custom component classes in `@layer components`
- Dark mode support
- Custom color palette and typography

**Alternative Rejected**: CSS Modules or styled-components
- More verbose for utility patterns
- Requires more custom CSS writing
- Less design system consistency

### Consequences
- Fast UI development with utility classes
- Consistent spacing and color usage
- Optimized production bundles
- Learning curve for utility-first approach

---

## Summary of Key Decisions

1. **Monorepo**: Single repository with shared TypeScript types
2. **Authentication**: Unified Strapi JWT with FastAPI validation
3. **Database**: PostgreSQL with separate schemas
4. **Storage**: Abstract interface supporting multiple providers
5. **State Management**: Pinia for Vue 3 stores
6. **Content Strategy**: Hybrid direct Strapi + FastAPI proxy
7. **Orchestration**: Docker Compose for simplicity
8. **Styling**: Tailwind CSS for utility-first development

These decisions prioritize **simplicity**, **maintainability**, and **flexibility** while providing a **professional foundation** for scaling the personal website.