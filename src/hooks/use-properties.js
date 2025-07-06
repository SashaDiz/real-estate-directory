import { useState, useEffect } from 'react';
import { API_ENDPOINTS, apiCall } from '../lib/api';

export function useProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    apiCall(API_ENDPOINTS.properties)
      .then(data => {
        setProperties(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Ошибка загрузки данных');
        setLoading(false);
      });
  }, []);

  return { properties, loading, error };
} 