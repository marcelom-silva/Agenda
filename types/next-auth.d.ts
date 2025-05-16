import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Estendendo o tipo User padrão do NextAuth
   */
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }

  /**
   * Estendendo o tipo Session padrão do NextAuth
   */
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
