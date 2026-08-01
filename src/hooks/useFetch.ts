import { useEffect, useState } from 'react';

export function useFetch<T>(loader: () => Promise<T>, fallback: T) {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    let attempts = 0;

    const run = async () => {
      setLoading(true);
      while (alive && attempts < 3) {
        attempts += 1;
        try {
          const result = await loader();
          if (!alive) return;
          setData(result);
          setError(null);
          setLoading(false);
          return;
        } catch (err) {
          if (!alive) return;
          if (attempts >= 3) {
            setError(err instanceof Error ? err.message : 'Failed to load');
            setLoading(false);
            return;
          }
          await new Promise((r) => setTimeout(r, 400 * attempts));
        }
      }
    };

    run();
    return () => {
      alive = false;
    };
  }, []);

  return { data, loading, error, setData };
}
