"use client";

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon, Search } from 'lucide-react';
import { ComboProduct } from '@/types/settings';

interface ComboListProps {
  combos: ComboProduct[];
  selectedCombo: ComboProduct | null;
  onComboSelect: (combo: ComboProduct) => void;
  isLoading?: boolean;
}

export function ComboList({ 
  combos, 
  selectedCombo, 
  onComboSelect,
  isLoading = false 
}: ComboListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCombos = useMemo(() => {
    return combos.filter((combo) =>
      combo.ComboName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [combos, searchQuery]);

  return (
    <Card className="md:col-span-1 h-[calc(100vh-6rem)] flex flex-col overflow-hidden">
      <div className="p-4 border-b space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Combo Menüler</h3>
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Combo menü ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredCombos.map((combo) => (
          <motion.button
            key={combo.ComboKey}
            onClick={() => onComboSelect(combo)}
            className={`w-full text-left rounded-md transition-all p-2 ${
              selectedCombo?.ComboKey === combo.ComboKey
                ? 'bg-primary/10 text-primary ring-1 ring-primary'
                : 'hover:bg-muted'
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex gap-3 items-center">
              {/* Combo Image */}
              <div className="relative w-10 h-10 flex-shrink-0">
                {combo.translations[0]?.ImageUrl ? (
                  <img
                    src={combo.translations[0].ImageUrl}
                    alt={combo.ComboName}
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Combo Info */}
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">
                  {combo.ComboName}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <Badge variant="secondary" className="h-4 text-xs px-1">
                    {combo.comboGroups?.length || 0} Grup
                  </Badge>
                </div>
              </div>
            </div>
          </motion.button>
        ))}

        {filteredCombos.length === 0 && (
          <div className="text-center p-8 text-muted-foreground">
            Henüz combo menü eklenmemiş
          </div>
        )}
      </div>
    </Card>
  );
}
