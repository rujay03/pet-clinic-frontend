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

export async function apiFetch<TResponse>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<TResponse> {
  const { method = "GET", body, headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    credentials: "include", // 🔑 keep session cookie
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
  // if it's not JSON, just keep the raw text
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
