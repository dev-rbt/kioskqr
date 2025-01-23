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
import { RefreshCwIcon, Search } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton"
import useSettingBranchStore from "@/store/settings/branch";

const TableRowSkeleton = () => (
  <TableRow>
    <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
  </TableRow>
);

export function BranchSettings() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const {branches} = useSettingBranchStore();

  const filteredBranches = branches.filter(branch =>
    branch.BranchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.BranchID.toString().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBranches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBranches = filteredBranches.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-4 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Şube ara..."
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
              <TableHead>Şube Adı</TableHead>
              <TableHead>Şube ID</TableHead>
              <TableHead>Son Güncelleme</TableHead>
              <TableHead>Menü Şablonu</TableHead>
              <TableHead>Fiyat Listesi</TableHead>
              <TableHead>Ayar Şablonu</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Show skeleton rows while loading
              Array.from({ length: itemsPerPage }).map((_, index) => (
                <TableRowSkeleton key={index} />
              ))
            ) : (
              paginatedBranches.map((branch) => (
                <TableRow key={branch.BranchID}>
                  <TableCell>{branch.BranchName}</TableCell>
                  <TableCell>{branch.BranchID}</TableCell>
                  <TableCell>{formatDate(branch.UpdatedAt)}</TableCell>
                  <TableCell>{branch.MenuTemplateName || '-'}</TableCell>
                  <TableCell>{branch.PriceTemplateName || '-'}</TableCell>
                  <TableCell>{branch.SettingsTemplateName || '-'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Toplam {filteredBranches.length} şube, Sayfa {currentPage}/{totalPages}
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