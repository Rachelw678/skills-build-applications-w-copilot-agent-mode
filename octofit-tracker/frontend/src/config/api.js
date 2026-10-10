const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()

export const API_BASE_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'

export async function readCollection(response) {
  if (!response.ok) {
    throw new Error(`API returned HTTP ${response.status}`)
  }

  const payload = await response.json()
  if (Array.isArray(payload)) return payload

  for (const key of ['results', 'data', 'items']) {
    if (Array.isArray(payload?.[key])) return payload[key]
  }

  throw new Error('API response must be an array or a paginated collection')
}
