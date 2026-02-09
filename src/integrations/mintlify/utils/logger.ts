import type { AstroIntegrationLogger } from 'astro';

let _logger: AstroIntegrationLogger | undefined;

export function initLogger(logger: AstroIntegrationLogger) {
  _logger = logger;
}

export function getLogger() {
  return _logger;
}
