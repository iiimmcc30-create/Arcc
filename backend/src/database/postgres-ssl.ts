/**
 * Decide whether the Postgres driver should use SSL.
 *
 * Railway quirks:
 * - Private URL (`*.railway.internal`) has no TLS — forcing SSL breaks boot.
 * - Public proxy URL (`*.rlwy.net`) / `sslmode=require` needs TLS.
 * - Explicit DB_SSL=true|false wins except on private Railway hosts.
 */
export function resolvePostgresSsl(
  databaseUrl: string | undefined,
  dbSsl: string | undefined,
): false | { rejectUnauthorized: false } {
  const url = (databaseUrl || '').toLowerCase();
  const isPrivateRailway =
    url.includes('railway.internal') ||
    (url.includes('.internal') && url.includes('postgres'));

  // Private Railway network is plain TCP. Ignore mistaken DB_SSL=true.
  if (isPrivateRailway) {
    const flag = dbSsl?.trim().toLowerCase();
    if (flag === 'true' || flag === '1' || flag === 'require') {
      console.warn(
        '[db] Ignoring DB_SSL=true for private Railway host (*.railway.internal has no TLS)',
      );
    }
    return false;
  }

  const flag = dbSsl?.trim().toLowerCase();
  if (flag === 'true' || flag === '1' || flag === 'require') {
    return { rejectUnauthorized: false };
  }
  if (flag === 'false' || flag === '0' || flag === 'disable') {
    return false;
  }

  if (!databaseUrl) return false;

  if (url.includes('sslmode=disable')) return false;
  if (url.includes('sslmode=require') || url.includes('sslmode=verify')) {
    return { rejectUnauthorized: false };
  }

  // Public Railway TCP proxy
  if (url.includes('rlwy.net') || url.includes('railway.app')) {
    return { rejectUnauthorized: false };
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
