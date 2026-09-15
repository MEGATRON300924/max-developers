export type MaxClientOptions = {
  baseUrl?: string;
  accessToken?: string;
  clientId?: string;
  clientSecret?: string;
  fetch?: typeof globalThis.fetch;
};

export type MaxRequestOptions = Omit<RequestInit, "body"> & { body?: unknown };

export class MaxApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: unknown;

  constructor(status: number, message: string, code?: string, details?: unknown) {
    super(message);
    this.name = "MaxApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export class MaxClient {
  private readonly baseUrl: string;
  private readonly accessToken?: string;
  private readonly clientId?: string;
  private readonly clientSecret?: string;
  private readonly requestFetch: typeof globalThis.fetch;

  constructor(options: MaxClientOptions = {}) {
    this.baseUrl = (options.baseUrl ?? "https://auth.max-ai.name.ng/api/v1").replace(/\/$/, "");
    this.accessToken = options.accessToken;
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.requestFetch = options.fetch ?? globalThis.fetch;
    if (!this.requestFetch) throw new Error("A fetch implementation is required");
  }

  async request<T = unknown>(path: string, options: MaxRequestOptions = {}): Promise<T> {
    const headers = new Headers(options.headers);
    headers.set("accept", "application/json");
    if (options.body !== undefined) headers.set("content-type", "application/json");
    if (this.accessToken) headers.set("authorization", `Bearer ${this.accessToken}`);
    const response = await this.requestFetch(`${this.baseUrl}/${path.replace(/^\//, "")}`, {
      ...options,
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
    return this.parseResponse<T>(response);
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const text = await response.text();
    let data: unknown = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    if (!response.ok) {
      const payload = data && typeof data === "object" ? data as Record<string, unknown> : {};
      throw new MaxApiError(response.status, String(payload.message ?? "MAX API request failed"), typeof payload.code === "string" ? payload.code : undefined, payload);
    }
    return data as T;
  }

  private clientCredentialsBody() {
    if (!this.clientId) throw new Error("clientId is required for this OAuth operation");
    return {
      client_id: this.clientId,
      ...(this.clientSecret ? { client_secret: this.clientSecret } : {}),
    };
  }

  userinfo<T = Record<string, unknown>>() { return this.request<T>("oauth/userinfo"); }

  introspect<T = Record<string, unknown>>(token: string) {
    return this.request<T>("oauth/introspect", {
      method: "POST",
      body: { token },
    });
  }

  revoke<T = Record<string, unknown>>(token: string) {
    return this.request<T>("oauth/revoke", {
      method: "POST",
      body: { token, ...this.clientCredentialsBody() },
    });
  }
}

export default MaxClient;
