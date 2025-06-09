export {};

// Create a type for the roles
export type Roles = "admin" | "customer";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}
