import { useEffect, useState } from 'react';
import { getProgress } from '../services/api';
import { mockProgress, mockProgressDay } from '../mocks/progress';

// Busca o resumo do período na API. Sem API, usa os dados de demonstração (e avisa com offline = true).
export default function useProgress(days) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getProgress(days)
      .then((result) => {
        if (!active) return;
        setData(result);
        setOffline(false);
      })
      .catch(() => {
        if (!active) return;
        setData(days === 1 ? mockProgressDay : mockProgress);
        setOffline(true);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [days]);

  return { data, loading, offline };
}
