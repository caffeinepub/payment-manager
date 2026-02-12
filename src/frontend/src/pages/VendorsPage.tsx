import { useState } from 'react';
import { useLocalDataContext } from '../lib/storage/LocalDataProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Building2 } from 'lucide-react';
import { VendorFormDialog } from '../components/vendors/VendorFormDialog';
import { VendorCard } from '../components/vendors/VendorCard';

export function VendorsPage() {
  const { data, isLoading } = useLocalDataContext();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading vendors...</p>
      </div>
    );
  }

  const sortedVendors = [...data.vendors].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Vendors</h2>
          <p className="text-muted-foreground">Manage vendors and merchants</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Vendor
        </Button>
      </div>

      {sortedVendors.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No vendors yet</p>
            <p className="text-sm text-muted-foreground mb-4">Add vendors to track your transactions</p>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Vendor
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedVendors.map(vendor => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      )}

      <VendorFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
