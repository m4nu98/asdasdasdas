import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Credenciales requeridas')
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user) {
          throw new Error('Email no registrado')
        }

        if (!user.emailVerified) {
          throw new Error('Por favor verifica tu email antes de iniciar sesión')
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isCorrectPassword) {
          throw new Error('Contraseña incorrecta')
        }

        return user
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/auth/error', // Página personalizada de error
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        // Añadir información adicional útil al token
        token.role = user.role // Si tienes roles de usuario
        token.emailVerified = user.emailVerified
      }
      // Añadir el tipo de proveedor al token
      if (account) {
        token.provider = account.provider
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        // Pasar información adicional a la sesión
        session.user.role = token.role
        session.user.emailVerified = token.emailVerified
        session.provider = token.provider
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Validación más estricta de URLs
      if (url.startsWith(baseUrl)) {
        return url
      } else if (url.startsWith('/')) {
        return `${baseUrl}${url}`
      }
      return baseUrl
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hora en segundos
    updateAge: 30 * 60, // Actualizar la sesión cada 30 minutos
  },
  jwt: {
    maxAge: 60 * 60, // 1 hora en segundos
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Configuraciones adicionales de seguridad
  useSecureCookies: process.env.NODE_ENV === "production", // Usar cookies seguras en producción
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production"
      }
    }
  },
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }