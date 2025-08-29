import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      firstName: string
      lastName: string
      email: string
      _id: string
    }
    rawJwt: string //
  }

  interface User {
    _id: string
    firstName: string
    lastName: string
  }

  interface JWT {
    rawJwt?: string
    firstName?: string
    lastName?: string
    _id?: string
  }
}
