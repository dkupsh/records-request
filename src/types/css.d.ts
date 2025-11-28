import "next-auth";
import { DefaultSession } from "next-auth";

declare module 'bootstrap/dist/css/bootstrap.min.css';
declare module 'bootstrap/dist/css/bootstrap.css';

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: string;
    user: {
      id?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    error?: string;
  }
}
