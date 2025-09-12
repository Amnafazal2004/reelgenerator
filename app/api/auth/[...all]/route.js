import { auth, initializeAuth  } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";

await initializeAuth()
//betterauth will handle everything on its own
export const { POST, GET } = toNextJsHandler(auth);