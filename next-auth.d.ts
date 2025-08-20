import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      name: string
      email: string
      _id: string
      user_set_locale: string | null
      country: string | null
    }
    rawJwt: string //
  }

  interface User {
    _id: string
    user_set_locale: string | null
    country: string | null
  }

  interface JWT {
    rawJwt?: string
  }
}
