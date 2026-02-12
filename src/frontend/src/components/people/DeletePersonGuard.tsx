import { useLocalDataContext } from '../../lib/storage/LocalDataProvider';
import { Person } from '../../lib/storage/schema';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface DeletePersonGuardProps {
  person: Person;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeletePersonGuard({ person, open, onOpenChange }: DeletePersonGuardProps) {
  const { data, deletePerson } = useLocalDataContext();

  const referencingTransactions = data.transactions.filter(
    t => t.type === 'split' && t.splits?.some(s => s.personId === person.id)
  );

  const canDelete = referencingTransactions.length === 0;

  const handleDelete = async () => {
    try {
      await deletePerson(person.id);
      toast.success('Person deleted successfully');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to delete person');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Person</AlertDialogTitle>
          <AlertDialogDescription>
            {canDelete ? (
              `Are you sure you want to delete ${person.name}? This action cannot be undone.`
            ) : (
              `Cannot delete ${person.name}`
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {!canDelete && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This person is referenced in {referencingTransactions.length} split{' '}
              {referencingTransactions.length === 1 ? 'transaction' : 'transactions'}. Please remove
              them from those transactions before deleting.
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
