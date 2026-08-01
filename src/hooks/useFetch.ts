import { useEffect, useState } from 'react';

export function useFetch<T>(loader: () => Promise<T>, fallback: T) {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    loader()
      .then((result) => {
        if (alive) {
          setData(result);
          setError(null);
        }
      })
      .catch((err: Error) => {
        if (alive) setError(err.message || 'Failed to load');
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return { data, loading, error, setData };
}
