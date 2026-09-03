'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Equipment } from '../../types/equipment';
import { EquipmentService } from '../../services/equipment.service';
import { EquipmentGrid } from '../../components/equipment/EquipmentGrid';
import { Input } from '../../components/ui/Input';
import { Loading } from '../../components/ui/Loading';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleSearch = async () => {
      if (!query.trim()) {
        const all = await EquipmentService.getAll({ limit: 12 });
        setResults(all);
        return;
      }
      setIsLoading(true);
      try {
        const data = await EquipmentService.getAll({ search: query });
        setResults(data);
      } catch (err) {
        console.error('Search query error', err);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(handleSearch, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="max-w-xl mx-auto text-center space-y-4">
        <h1 className="text-3xl font-black text-white">Search Equipment Fleet</h1>
        <Input
          placeholder="Search Sony FX3, RED, Cooke, Aputure 600d, anamorphic..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          icon={<Search className="w-4 h-4 text-primary" />}
          className="text-base py-3"
          autoFocus
        />
      </div>

      {isLoading ? <Loading message="Searching equipment inventory..." /> : <EquipmentGrid items={results} />}
    </div>
  );
}
