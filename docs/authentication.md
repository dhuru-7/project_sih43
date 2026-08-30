# 🔒 Authentication & Role-Based Access Control (RBAC)

## Lifecycle Flow

1. **User Authentication**:
   - User posts credentials to `/api/v1/auth/login`.
   - Backend signs and issues an asymmetric/HMAC HS256 JWT containing `sub`, `role`, `organization`, and `exp`.

2. **Client Redirection**:
   - Frontend stores token in `localStorage`.
   - `AuthContext` parses role and redirects to appropriate portal (`/government/dashboard`, `/university/dashboard`, or `/industry/dashboard`).

3. **Route Guards**:
   - `ProtectedRoute`: Rejects unauthenticated visits.
   - `RoleGuard`: Rejects users attempting to access portals outside their allowed roles.
