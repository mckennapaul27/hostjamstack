export const fetcher = (url: string) => fetch(url).then((res) => res.json())

export const fetchWithToken = async (url: string, jwt: string) => {
  try {
    console.log('fetchWithToken - URL:', url)
    console.log(
      'fetchWithToken - JWT (first 20 chars):',
      jwt?.substring(0, 20) + '...',
    )

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })

    console.log('fetchWithToken - Response status:', res.status)
    console.log(
      'fetchWithToken - Response headers:',
      Object.fromEntries(res.headers.entries()),
    )

    if (!res.ok) {
      const errorText = await res.text()
      console.log('fetchWithToken - Error response:', errorText)
      throw new Error(`HTTP ${res.status}: ${errorText}`)
    }

    return res.json()
  } catch (error) {
    console.log('error in fetchWithToken', error)
    throw error
  }
}

//SERVER URL
export const serverUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5001'
    : process.env.NEXT_PUBLIC_SERVER_URL
