import { useEffect, useState } from 'react';
import { api } from './api/client';
import type { Stall } from './types';

function App() {
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [pesan, setPesan] = useState('Memuat...');

  useEffect(() => {
    api
      .get('/stalls', { params: { limit: 3 } })
      .then((res) => {
        setStalls(res.data.data);
        setPesan(`Berhasil: ${res.data.data.length} warung dimuat dari backend`);
      })
      .catch((err) => setPesan(`Gagal: ${err.message}`));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Tes koneksi ke backend</h1>
      <p>{pesan}</p>
      <ul>
        {stalls.map((s) => (
          <li key={s.id}>{s.name} ({s.category})</li>
        ))}
      </ul>
    </div>
  );
}

export default App;