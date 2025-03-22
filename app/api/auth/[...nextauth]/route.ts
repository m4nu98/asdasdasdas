import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { Adapter } from "next-auth/adapters"

// Verificar variables de entorno
const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET

if (!googleClientId || !googleClientSecret) {
  throw new Error('Las credenciales de Google no están configuradas correctamente')
}

console.log('Verificando variables de entorno de Google:');
console.log('GOOGLE_CLIENT_ID:', googleClientId);
console.log('GOOGLE_CLIENT_SECRET:', googleClientSecret ? 'Presente' : 'No encontrado');

// Crear un adaptador personalizado que funcione con nuestros modelos en español
function customPrismaAdapter(prisma): Adapter {
  return {
    createUser: async (data) => {
      console.log('Creando usuario con datos:', data);
      try {
        const user = await prisma.usuarios.create({
          data: {
            email: data.email,
            nombre: data.name?.split(' ')[0] || '',
            apellido: data.name?.split(' ').slice(1).join(' ') || '',
            proveedor: 'google',
            id_proveedor: data.id,
            // Valores por defecto para campos requeridos
            telefono: 'No especificado',
            fechaDeNacimiento: new Date('2000-01-01'), // Fecha por defecto
          }
        });
        console.log('Usuario creado exitosamente:', user);
        return {
          id: user.id,
          email: user.email,
          name: `${user.nombre} ${user.apellido}`,
          emailVerified: null,
          image: data.image
        };
      } catch (error) {
        console.error('Error al crear usuario:', error);
        throw error;
      }
    },
    getUser: async (id) => {
      const user = await prisma.usuarios.findUnique({
        where: { id }
      });
      if (!user) return null;
      return {
        id: user.id,
        email: user.email,
        name: `${user.nombre} ${user.apellido}`,
        emailVerified: null,
        image: null
      };
    },
    getUserByEmail: async (email) => {
      const user = await prisma.usuarios.findUnique({
        where: { email }
      });
      if (!user) return null;
      return {
        id: user.id,
        email: user.email,
        name: `${user.nombre} ${user.apellido}`,
        emailVerified: null,
        image: null
      };
    },
    getUserByAccount: async ({ providerAccountId, provider }) => {
      // Buscar usuario por id_proveedor
      const user = await prisma.usuarios.findFirst({
        where: { 
          id_proveedor: providerAccountId,
          proveedor: provider
        }
      });
      if (!user) return null;
      return {
        id: user.id,
        email: user.email,
        name: `${user.nombre} ${user.apellido}`,
        emailVerified: null,
        image: null
      };
    },
    updateUser: async (data) => {
      const user = await prisma.usuarios.update({
        where: { id: data.id },
        data: {
          email: data.email,
          nombre: data.name?.split(' ')[0] || '',
          apellido: data.name?.split(' ').slice(1).join(' ') || '',
        }
      });
      return {
        id: user.id,
        email: user.email,
        name: `${user.nombre} ${user.apellido}`,
        emailVerified: null,
        image: null
      };
    },
    linkAccount: async (data) => {
      // Actualizar el usuario con la información del proveedor
      await prisma.usuarios.update({
        where: { id: data.userId },
        data: {
          proveedor: data.provider,
          id_proveedor: data.providerAccountId
        }
      });
      return data;
    },
    createSession: async () => { return {} as any },
    getSessionAndUser: async () => { return null },
    updateSession: async () => { return {} as any },
    deleteSession: async () => {},
    createVerificationToken: async () => { return {} as any },
    useVerificationToken: async () => { return null },
  };
}

export const authOptions = {
  adapter: customPrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      },
      profile(profile) {
        console.log('Perfil de Google recibido:', profile);
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        }
      }
    }),
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
          const user = await prisma.usuarios.findUnique({
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

          // Verificar si el usuario ha confirmado su email
          if (user.proveedor === 'email') {
            console.log('Verificando confirmación de email para usuario con proveedor email')
            const tokenConfirmacion = await prisma.tokenConfirmacionEmail.findFirst({
              where: {
                userId: user.id,
                utilizado: true
              }
            })

            if (!tokenConfirmacion) {
              console.log('Email no verificado para el usuario:', credentials.email)
              throw new Error("Por favor, verifica tu email antes de iniciar sesión")
            }
          }
          // Si el proveedor es Google, no es necesario verificar el email

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
  ],
  pages: {
    signIn: '/login',
    signUp: '/signup',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        console.log('JWT Callback - Usuario autenticado:', { user, account });
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
        console.log('Session Callback - Token recibido:', token);
        session.user = {
          ...session.user,
          id: token.userId,
          ...token.user
        }
        session.accessToken = token.accessToken
      }
      return session
    },
    async signIn({ user, account, profile, email, credentials }) {
      console.log('SignIn Callback - Intento de inicio de sesión:', { 
        user, account, profile: !!profile, email, hasCredentials: !!credentials 
      });
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log('Redirect Callback - URL:', url, 'BaseURL:', baseUrl);
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