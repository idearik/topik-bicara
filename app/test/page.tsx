'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestPage() {
  const [status, setStatus] = useState<string>('Loading...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase
          .from('questions')
          .select('id')
          .limit(1);

        if (error) {
          setError(`Connection Error: ${error.message} (${error.code})`);
          return;
        }

        setStatus(`Connected successfully! Found ${data.length} records.`);
      } catch (e) {
        setError(`Unexpected error: ${e}`);
      }
    }

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold">Status:</h2>
            <p className={error ? 'text-red-500' : 'text-green-500'}>
              {error || status}
            </p>
          </div>

          <div>
            <h2 className="font-semibold">Environment:</h2>
            <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
            <p>Has Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 