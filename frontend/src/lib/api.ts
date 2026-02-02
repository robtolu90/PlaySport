export const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5555';

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init
  });
  if (!res.ok) throw new Error('Erro de requisição');
  return res.json();
}

export async function post<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
  return api<T>(path, { method: 'POST', body: JSON.stringify(body), ...(init || {}) });
}
