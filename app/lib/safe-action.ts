import { createSafeActionClient } from "next-safe-action";

/** Client que solamente valida acciones del login */
const loginClient = createSafeActionClient();
/** Client de validacion general (usuario logueado) */
export const actionClient = loginClient;