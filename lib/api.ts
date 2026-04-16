const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiFetchOptions extends RequestInit {
  method?: HttpMethod;
  body?: any;
}

export class ApiError extends Error {
  status: number;
  details?: any;

  constructor(status: number, message: string, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

function buildApiUrl(path: string): string {
  const trimmedBase = API_BASE_URL.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // Join then collapse accidental '/api/api/*' duplication.
  // This supports all combinations:
  // - base: http://localhost:8081        + path: /api/auth/login
  // - base: http://localhost:8081/api    + path: /auth/login
  // - base: http://localhost:8081/api    + path: /api/auth/login
  const joined = `${trimmedBase}${normalizedPath}`;
  return joined.replace(/\/api\/api(?=\/|$)/g, "/api");
}

export async function apiFetch<TResponse>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<TResponse> {
  const { method = "GET", body, headers, ...rest } = options;

  const response = await fetch(buildApiUrl(path), {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  });

  const text = await response.text();
  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const message =
      (data && (data.message || data.error)) ||
      (typeof data === "string" ? data : "") ||
      `Request failed with status ${response.status}`;
    throw new ApiError(response.status, message, data);
  }

  return data as TResponse;
}

/** For multipart/form-data requests (file uploads) — do NOT set Content-Type manually */
export async function apiFetchMultipart<TResponse>(
  path: string,
  method: "POST" | "PUT",
  formData: FormData
): Promise<TResponse> {
  const response = await fetch(buildApiUrl(path), {
    method,
    credentials: "include",
    body: formData,
    // Do NOT set Content-Type header — browser sets it with boundary automatically
  });

  const text = await response.text();
  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const message =
      (data && (data.message || data.error)) ||
      (typeof data === "string" ? data : "") ||
      `Request failed with status ${response.status}`;
    throw new ApiError(response.status, message, data);
  }

  return data as TResponse;
}

export function getPetImageUrl(imageUrl?: string | null): string | null {
  if (!imageUrl) return null;
  // If it's already a full URL, return as-is
  if (imageUrl.startsWith("http")) return imageUrl;
  return buildApiUrl(imageUrl);
}
