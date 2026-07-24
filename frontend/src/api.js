const API_BASE = 'http://localhost:8000'

let _token = localStorage.getItem('ag_token') || null

export const getToken = () => _token

export const setToken = (t) => {
  _token = t
  if (t) localStorage.setItem('ag_token', t)
  else localStorage.removeItem('ag_token')
}

// Decode JWT payload client-side (no verification — just for reading claims)
export const parseJwt = (token) => {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(json)
  } catch {
    return null
  }
}

const authHeaders = () =>
  _token ? { Authorization: `Bearer ${_token}` } : {}

const handle401 = () => {
  setToken(null)
  window.location.href = '/login'
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(options.headers || {}),
    },
  })
  if (res.status === 401) {
    handle401()
    throw new Error('Unauthorized')
  }
  return res
}

// ── Auth ──────────────────────────────────────────────────────────────────────
// FIX (confirmed from main.py): auth_router and logout_router are BOTH
// included with no prefix - app.include_router(auth_router) and
// app.include_router(logout_router), no prefix= argument on either. So the
// real paths are exactly the routes each router defines internally, with
// nothing prepended. My earlier "/auth/..." guess was wrong - reverted.

// POST /token — OAuth2 form data, returns { access_token, token_type }
export const apiLogin = (username, password) =>
  request('/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username, password }),
  })

// POST /  — JSON body { name, username, email, password }, returns { message }
export const apiRegister = (data) =>
  request('/', { method: 'POST', body: JSON.stringify(data) })

// POST /logout — not /auth/logout. logout_router defines the route as
// "/logout" internally and main.py mounts it with no prefix, so this is
// the real path. JWTs are stateless so this invalidates nothing server-side,
// but it still expects a Bearer token, so call it before wiping local state.
export const apiLogout = () => request('/logout', { method: 'POST' })

// ── Chat ──────────────────────────────────────────────────────────────────────
// POST /chat — { session_id?: int, message: str }
// Response: { session_id: int, answer: str, sentiment: str, intent: str }
// When intent === "END_CHAT" the backend marks the session RESOLVED automatically.
export const apiChat = (message, session_id) =>
  request('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message, session_id: session_id ?? null }),
  })

// ── Upload ────────────────────────────────────────────────────────────────────
// POST /load_kb — multipart, field name "uploaded_files"
// Response: [{ file_name, status, chunks_added? }]
export const apiUpload = (file, onProgress) => {
  const formData = new FormData()
  formData.append('uploaded_files', file)

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${API_BASE}/load_kb`)
    if (_token) xhr.setRequestHeader('Authorization', `Bearer ${_token}`)
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload = () => {
      if (xhr.status === 401) { handle401(); reject(new Error('Unauthorized')); return }
      if (xhr.status >= 400) { reject(new Error(`Server error: ${xhr.status}`)); return }
      const data = JSON.parse(xhr.responseText)
      resolve(Array.isArray(data) ? data[0] : data)
    }
    xhr.onerror = () => reject(new Error('Upload failed'))
    xhr.send(formData)
  })
}

// ── Feedback ──────────────────────────────────────────────────────────────────
// POST /feedback — { session_id: int, rating: int 1-5, helpful: "yes"|"no", comment?: str }
// Response: { message: str, feedback_id: int }
// feedback_router is also included with no prefix, so this assumes
// api/feedback.py defines the route as "/feedback" internally. Check
// that file if this still 404s - I haven't seen its contents.
export const apiFeedback = ({ session_id, rating, helpful, comment }) =>
  request('/feedback', {
    method: 'POST',
    body: JSON.stringify({ session_id, rating, helpful, comment: comment || null }),
  })