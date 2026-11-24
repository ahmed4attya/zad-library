/**
 * Central Observability & Error Monitoring Client with Performance Tracing
 * Connected to Sentry Organization: 3A (3a-ed) | Project: production-apps
 * Strictly adheres to Zero-PII Compliance Rule H3-01.
 */

export const SENTRY_DSN = "https://be3829e3574de34f1114a2fe58e44e29@o4512482861056000.ingest.de.sentry.io/4512482904047696";

export interface ObservabilityConfig {
  dsn?: string;
  serviceName: string;
  environment?: string;
  tracesSampleRate?: number;
}

class CentralObservability {
  private initialized = false;
  private serviceName = "app";
  private dsn = SENTRY_DSN;

  public init(config: ObservabilityConfig) {
    if (this.initialized || typeof window === "undefined") return;
    this.serviceName = config.serviceName;
    if (config.dsn) this.dsn = config.dsn;
    this.initialized = true;

    // 1. Initialize Sentry with Performance Tracing & Zero-PII
    const win = window as any;
    if (win.Sentry && typeof win.Sentry.init === "function") {
      try {
        win.Sentry.init({
          dsn: this.dsn,
          environment: config.environment || "production",
          release: this.serviceName + "@1.0.0",
          // Full Performance Tracing (Page load, Navigation, API calls)
          tracesSampleRate: config.tracesSampleRate ?? 1.0,
          tracePropagationTargets: ["localhost", /^https:\/\/[^/]*\.vercel\.app/],
          initialScope: {
            tags: { service: this.serviceName },
          },
        });
      } catch (e) {
        // Graceful non-blocking
      }
    }

    // 2. Global Error Listener
    window.addEventListener("error", (event) => {
      this.captureException(event.error || event.message, {
        source: "window.onerror",
        filename: event.filename,
        lineno: event.lineno,
      });
    });

    window.addEventListener("unhandledrejection", (event) => {
      this.captureException(event.reason, {
        source: "unhandledrejection",
      });
    });
  }

  public captureException(error: any, context?: Record<string, any>) {
    if (typeof window === "undefined") return;
    const win = window as any;

    if (win.Sentry && typeof win.Sentry.captureException === "function") {
      try {
        win.Sentry.captureException(error instanceof Error ? error : new Error(String(error)), {
          tags: { service: this.serviceName },
          extra: context,
        });
        return;
      } catch {}
    }

    if (typeof process !== "undefined" && process.env?.NODE_ENV === "development") {
      console.error("[Sentry Observability]", { service: this.serviceName, error, context });
    }
  }

  // Performance transaction helper
  public startTransaction(name: string, op: string = "http.client") {
    const win = window as any;
    if (win.Sentry && typeof win.Sentry.startTransaction === "function") {
      try {
        return win.Sentry.startTransaction({ name, op });
      } catch {}
    }
    return null;
  }
}

export const observability = new CentralObservability();
export const reportError = (error: any, context?: Record<string, any>) =>
  observability.captureException(error, context);
