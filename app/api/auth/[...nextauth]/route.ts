import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Por favor ingresa tu email y contraseña")
        }

        try {
          console.log('Intentando autenticar usuario:', credentials.email)
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          if (!user) {
            console.log('Usuario no encontrado:', credentials.email)
            throw new Error("Usuario no encontrado")
          }

          console.log('Usuario encontrado, verificando contraseña')
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            console.log('Contraseña incorrecta para usuario:', credentials.email)
            throw new Error("Contraseña incorrecta")
          }

          console.log('Autenticación exitosa para usuario:', credentials.email)
          return {
            id: user.id,
            email: user.email,
            name: `${user.nombre} ${user.apellido}`,
          }
        } catch (error) {
          console.error("Error en autenticación:", error)
          if (error instanceof Error) {
            throw new Error(error.message)
          }
          throw new Error("Error al iniciar sesión")
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
    signUp: '/signup',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          userId: user.id,
          user: user,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hora
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.userId,
          ...token.user
        }
        session.accessToken = token.accessToken
      }
      return session
    },
    async redirect({ url, baseUrl }) {
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
    maxAge: 3600, // 1 hora
    updateAge: 300, // 5 minutos
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