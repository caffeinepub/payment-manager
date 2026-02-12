import { useLocalDataContext } from '../../lib/storage/LocalDataProvider';
import { Vendor } from '../../lib/storage/schema';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface DeleteVendorGuardProps {
  vendor: Vendor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteVendorGuard({ vendor, open, onOpenChange }: DeleteVendorGuardProps) {
  const { data, deleteVendor } = useLocalDataContext();

  const referencingTransactions = data.transactions.filter(t => t.vendorId === vendor.id);
  const canDelete = referencingTransactions.length === 0;

  const handleDelete = async () => {
    try {
      await deleteVendor(vendor.id);
      toast.success('Vendor deleted successfully');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to delete vendor');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Vendor</AlertDialogTitle>
          <AlertDialogDescription>
            {canDelete ? (
              `Are you sure you want to delete ${vendor.name}? This action cannot be undone.`
            ) : (
              `Cannot delete ${vendor.name}`
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {!canDelete && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This vendor is referenced in {referencingTransactions.length}{' '}
              {referencingTransactions.length === 1 ? 'transaction' : 'transactions'}. Please delete
              those transactions before deleting this vendor.
            </AlertDescription>
          </Alert>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {canDelete && (
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
