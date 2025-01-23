"use client";

import { useState, useEffect } from 'react';
import { ComboList } from './combo-settings/combo-list';
import { ComboEdit } from './combo-settings/combo-edit';
import { ComboProduct } from '@/types/settings';
import axios from 'axios';

export function ComboSettings() {
  const [selectedCombo, setSelectedCombo] = useState<ComboProduct | null>(null);
  const [combos, setCombos] = useState<ComboProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    setIsLoading(true)
    const fetchCombos = async () => {
      try {
        const response = await axios.get('/api/combo-settings/getComboMenus');
        if (response.status !== 200) {
          throw new Error('Failed to fetch combo menus');
        }
        setCombos(response.data);
      } catch (error) {
      } finally {
        setIsLoading(false)
      }
    }

    fetchCombos()

  }, []);

  const handleSaveCombo = async (combo: ComboProduct) => {

  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <ComboList
        combos={combos}
        selectedCombo={selectedCombo}
        onComboSelect={setSelectedCombo}
      />
      <ComboEdit selectedCombo={selectedCombo} setCombo={setSelectedCombo} onSave={handleSaveCombo} />
    </div>
  );
}