import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

const INVALIDATION_TIMEOUT_MS = 1000;

@Injectable()
export class CacheInvalidationService {
  private readonly logger = new Logger(CacheInvalidationService.name);

  constructor(private readonly config: ConfigService) {}

  invalidate(username: string): void {
    const baseUrl = this.config.get<string>("PROFILE_READER_SERVICE_URL");
    if (!baseUrl) {
      this.logger.warn("PROFILE_READER_SERVICE_URL not set; skipping cache invalidation");
      return;
    }

    const url = `${baseUrl.replace(/\/$/, "")}/cache/${encodeURIComponent(username)}`;
    void this.send(url, username);
  }

  private async send(url: string, username: string): Promise<void> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), INVALIDATION_TIMEOUT_MS);
    try {
      const res = await fetch(url, { method: "DELETE", signal: controller.signal });
      if (!res.ok) {
        this.logger.warn(`cache invalidation for "${username}" returned ${res.status}`);
      }
    } catch (err) {
      this.logger.warn(`cache invalidation for "${username}" failed: ${String(err)}`);
    } finally {
      clearTimeout(timer);
    }
  }
}
