import { useState } from 'react';
import { Vendor } from '../../lib/storage/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Building2 } from 'lucide-react';
import { VendorFormDialog } from './VendorFormDialog';
import { DeleteVendorGuard } from './DeleteVendorGuard';

interface VendorCardProps {
  vendor: Vendor;
}

export function VendorCard({ vendor }: VendorCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{vendor.name}</CardTitle>
                {vendor.category && (
                  <Badge variant="secondary" className="mt-1">
                    {vendor.category}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {vendor.notes && (
            <CardDescription className="line-clamp-2 mt-2">{vendor.notes}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditDialogOpen(true)}
              className="flex-1 gap-2"
            >
              <Edit className="h-3 w-3" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="flex-1 gap-2"
            >
              <Trash2 className="h-3 w-3" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      <VendorFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        vendor={vendor}
      />

      <DeleteVendorGuard
        vendor={vendor}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </>
  );
}
