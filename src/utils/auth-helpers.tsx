import jwt from 'jsonwebtoken'
import type { NextAuthOptions, Profile, Session } from 'next-auth'
import { type Account, type User as AuthUser } from 'next-auth'
import { type JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'
import { serverUrl } from './config'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (credentials) {
            // /api/check-password
            const res = await fetch(`${serverUrl}/api/auth/check-password`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            })
            const { isMatch, user } = await res.json()
            console.log('user in auth-helpers', user)
            if (res.status === 200 && isMatch) {
              return user
            }
          }
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message)
          } else {
            throw new Error(String(error))
          }
        }
        return null // Return null when credentials are invalid or an error occurs
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? ('' as string),
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? ('' as string),
    }),
  ],
  callbacks: {
    async signIn({
      // user,
      account,
    }: {
      user: AuthUser
      account: Account | null
      profile?: Profile | undefined
    }) {
      // console.log("authOptions user", user);
      // console.log("authOptions account", account);

      if (account) {
        if (account.provider === 'credentials') {
          return true
        }
      }
      return false
    },
    async jwt({
      user,
      token,
      // account,
      // profile,
    }: {
      user: AuthUser
      token: JWT
      account: Account | null
      profile?: Profile | undefined
    }) {
      // account and profile are only available on sign in with social
      // Persist the OAuth access_token and or the user id to the token right after signin

      if (user) {
        console.log('Creating new token for user:', user.email)
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.email = user.email
        token._id = user._id

        // Include the raw JWT in the token payload for session use
        token.rawJwt = jwt.sign(token, process.env.JWT_SECRET as string)
      } else {
        console.log('Using existing token for user:', token.email)
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      console.log('Setting session for user:', token.email)

      session.user = {
        ...session.user,
        firstName: token.firstName,
        lastName: token.lastName,
        email: token.email,
        _id: token._id,
      } as {
        firstName: string
        lastName: string
        email: string
        _id: string
      }
      if (token.rawJwt && typeof token.rawJwt === 'string') {
        session.rawJwt = token.rawJwt
      }
      return session
    },
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === 'production'
          ? `__Secure-next-auth.session-token`
          : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET as string,
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
}
