export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export async function fetcher<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(endpoint, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      return {
        data: null,
        error: `HTTP error! status: ${response.status}`,
        status: response.status,
      };
    }

    const data = await response.json();
    return { data, error: null, status: response.status };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Network error occurred";
    return { data: null, error: errorMessage, status: 500 };
  }
}
