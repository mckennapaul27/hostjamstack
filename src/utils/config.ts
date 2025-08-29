export const fetcher = (url: string) => fetch(url).then((res) => res.json())

export const fetchWithToken = async (url: string, jwt: string) => {
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    return res.json()
  } catch (error) {
    console.log(error)
  }
}

//SERVER URL
export const serverUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5001'
    : process.env.NEXT_PUBLIC_SERVER_URL
