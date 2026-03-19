import { cookies } from 'next/headers'

export async function getCurrentUser() {
  const cookieStore = cookies()
  const userId = cookieStore.get('userId')?.value
  const userName = cookieStore.get('userName')?.value
  const userInitials = cookieStore.get('userInitials')?.value

  if (!userId) return null

  return {
    id: userId,
    name: userName || '',
    initials: userInitials || '',
  }
}

export async function setAuthCookies(user: { id: string; name: string; initials: string }) {
  const cookieStore = cookies()
  cookieStore.set('userId', user.id, { httpOnly: true, path: '/' })
  cookieStore.set('userName', user.name, { httpOnly: true, path: '/' })
  cookieStore.set('userInitials', user.initials, { httpOnly: true, path: '/' })
}

export async function clearAuthCookies() {
  const cookieStore = cookies()
  cookieStore.delete('userId')
  cookieStore.delete('userName')
  cookieStore.delete('userInitials')
}
