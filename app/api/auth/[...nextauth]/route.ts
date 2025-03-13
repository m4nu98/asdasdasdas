import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Para desarrollo, siempre devolver un usuario de prueba
        return {
          id: "1",
          email: "usuario@test.com",
          name: "Usuario de Prueba",
          image: "https://ui-avatars.com/api/?name=Usuario+Test",
          firstName: "Usuario",
          lastName: "Test"
        }

        // Código original para producción
        // if (!credentials?.email || !credentials?.password) {
        //   throw new Error('Please enter an email and password')
        // }
        // return null
      }
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.firstName = user.firstName
        token.lastName = user.lastName
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id
        (session.user as any).firstName = token.firstName
        (session.user as any).lastName = token.lastName
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }