import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get("authorization");

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const decoded = atob(authValue);
    const colonIndex = decoded.indexOf(":");
    const user = colonIndex !== -1 ? decoded.substring(0, colonIndex) : decoded;
    const pwd = colonIndex !== -1 ? decoded.substring(colonIndex + 1) : "";

    // Utilisation stricte des variables d'environnement (plus de valeurs en dur)
    const validUser = process.env.BASIC_AUTH_USER;
    const validPassword = process.env.BASIC_AUTH_PASSWORD;

    if (validUser && validPassword && user === validUser && pwd === validPassword) {
      return NextResponse.next();
    }
  }

  // Si l'authentification échoue ou n'est pas présente, on renvoie une 401
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    },
  });
}

// Configuration du matcher pour exclure les fichiers statiques et images
export const config = {
  matcher: [
    /*
     * Protège toutes les routes SAUF :
     * - api (routes API si besoin de les exclure, sinon on peut l'enlever)
     * - _next/static (fichiers statiques)
     * - _next/image (images optimisées)
     * - favicon.ico (favicon)
     * - Fichiers avec extensions d'images (.svg, .png, .jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
