import { hashSecret, randomSalt, verifySecret } from './crypto'

export type UserProfile = {
  id: string
  username: string
  email: string
  phone: string
  displayName: string
  passwordHash: string
  salt: string
  createdAt: string
}

export type Session = {
  userId: string
  username: string
  displayName: string
}

const USERS_KEY = 'framekit.users.v1'
const SESSION_KEY = 'framekit.session.v1'

function readUsers(): UserProfile[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as UserProfile[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeUsers(users: UserProfile[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Session
  } catch {
    return null
  }
}

export function setSession(session: Session | null) {
  if (!session) localStorage.removeItem(SESSION_KEY)
  else localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function findUserByUsername(username: string) {
  const key = username.trim().toLowerCase()
  return readUsers().find((u) => u.username.toLowerCase() === key) ?? null
}

export function findUserByEmail(email: string) {
  const key = email.trim().toLowerCase()
  return readUsers().find((u) => u.email.toLowerCase() === key) ?? null
}

export type RegisterInput = {
  username: string
  email: string
  phone: string
  displayName: string
  code: string
}

export async function registerUser(input: RegisterInput) {
  const username = input.username.trim()
  const email = input.email.trim()
  const phone = input.phone.trim()
  const displayName = input.displayName.trim() || username
  const code = input.code

  if (username.length < 3) throw new Error('auth.usernameMin')
  if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
    throw new Error('auth.usernameChars')
  }
  if (!email.includes('@') || email.length < 5) {
    throw new Error('auth.emailInvalid')
  }
  if (phone && phone.replace(/\D/g, '').length < 8) {
    throw new Error('auth.phoneInvalid')
  }
  if (code.length < 4) throw new Error('auth.codeMin')

  if (findUserByUsername(username)) {
    throw new Error('auth.usernameTaken')
  }
  if (findUserByEmail(email)) {
    throw new Error('auth.emailTaken')
  }

  const salt = randomSalt()
  const passwordHash = await hashSecret(code, salt)
  const user: UserProfile = {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    username,
    email,
    phone,
    displayName,
    passwordHash,
    salt,
    createdAt: new Date().toISOString(),
  }

  const users = readUsers()
  users.push(user)
  writeUsers(users)

  const session: Session = {
    userId: user.id,
    username: user.username,
    displayName: user.displayName,
  }
  setSession(session)
  return session
}

export async function loginUser(usernameOrEmail: string, code: string) {
  const key = usernameOrEmail.trim().toLowerCase()
  const user =
    readUsers().find(
      (u) =>
        u.username.toLowerCase() === key || u.email.toLowerCase() === key,
    ) ?? null

  if (!user) throw new Error('auth.userNotFound')
  const ok = await verifySecret(code, user.salt, user.passwordHash)
  if (!ok) throw new Error('auth.badCode')

  const session: Session = {
    userId: user.id,
    username: user.username,
    displayName: user.displayName,
  }
  setSession(session)
  return session
}

export function logoutUser() {
  setSession(null)
}

export function getUserById(id: string) {
  return readUsers().find((u) => u.id === id) ?? null
}
