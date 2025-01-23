"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, RefreshCwIcon } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton"
import usePriceTemplateStore from '@/store/settings/price-template';

const TableRowSkeleton = () => (
  <TableRow>
    <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
  </TableRow>
);

export function PriceListSettings() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { priceTemplates } = usePriceTemplateStore();
  const itemsPerPage = 10;



  const filteredTemplates = priceTemplates.filter(priceTemplate =>
    priceTemplate.PriceTemplateName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTemplates = filteredTemplates.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page
    if (startPage > 1) {
      buttons.push(
        <Button
          key="1"
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(1)}
        >
          1
        </Button>
      );
      if (startPage > 2) {
        buttons.push(
          <Button key="ellipsis1" variant="ghost" size="sm" disabled>
            ...
          </Button>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <Button key="ellipsis2" variant="ghost" size="sm" disabled>
            ...
          </Button>
        );
      }
      buttons.push(
        <Button
          key={totalPages}
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(totalPages)}
        >
          {totalPages}
        </Button>
      );
    }

    return buttons;
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-4 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Fiyat listesi ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
                disabled={loading}
              />
            </div>
            <Button variant="outline" size="icon" disabled={loading}>
              <RefreshCwIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Liste Adı</TableHead>
              <TableHead>Son Güncelleme</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Show skeleton rows while loading
              Array.from({ length: itemsPerPage }).map((_, index) => (
                <TableRowSkeleton key={index} />
              ))
            ) : (
              paginatedTemplates.map((priceTemplate) => (
                <TableRow key={priceTemplate.PriceTemplateKey}>
                  <TableCell>{priceTemplate.PriceTemplateName}</TableCell>
                  <TableCell>{formatDate(priceTemplate.UpdatedAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Toplam {filteredTemplates.length} liste, Sayfa {currentPage}/{totalPages}
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Önceki
              </Button>
              {renderPaginationButtons()}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Sonraki
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}