/**
 * Decide whether the Postgres driver should use SSL.
 *
 * Railway quirks:
 * - Private URL (`*.railway.internal`) usually has no TLS — forcing SSL breaks boot.
 * - Public proxy URL (`*.rlwy.net`) / `sslmode=require` needs TLS.
 * - Explicit DB_SSL=true|false always wins.
 */
export function resolvePostgresSsl(
  databaseUrl: string | undefined,
  dbSsl: string | undefined,
): false | { rejectUnauthorized: false } {
  const flag = dbSsl?.trim().toLowerCase();
  if (flag === 'true' || flag === '1' || flag === 'require') {
    return { rejectUnauthorized: false };
  }
  if (flag === 'false' || flag === '0' || flag === 'disable') {
    return false;
  }

  if (!databaseUrl) return false;

  const url = databaseUrl.toLowerCase();
  if (url.includes('sslmode=disable')) return false;
  if (url.includes('sslmode=require') || url.includes('sslmode=verify')) {
    return { rejectUnauthorized: false };
  }

  // Public Railway TCP proxy
  if (url.includes('rlwy.net') || url.includes('railway.app')) {
    return { rejectUnauthorized: false };
  }

  // Private Railway network — plain TCP
  if (url.includes('railway.internal') || url.includes('.internal')) {
    return false;
  }

  return false;
}

export function describeDatabaseTarget(databaseUrl: string | undefined): string {
  if (!databaseUrl) return 'discrete DB_* host settings (fallback localhost)';
  try {
    const parsed = new URL(databaseUrl);
    return `${parsed.protocol}//${parsed.hostname}:${parsed.port || '5432'}${parsed.pathname}`;
  } catch {
    return 'DATABASE_URL (unparseable)';
  }
}
