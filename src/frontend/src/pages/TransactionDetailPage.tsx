import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useLocalDataContext } from '../lib/storage/LocalDataProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ArrowLeft, Calendar, Building2, DollarSign, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { TransactionFormDialog } from '../components/transactions/TransactionFormDialog';
import { toast } from 'sonner';

export function TransactionDetailPage() {
  const { transactionId } = useParams({ from: '/transactions/$transactionId' });
  const navigate = useNavigate();
  const { data, deleteTransaction } = useLocalDataContext();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const transaction = data.transactions.find(t => t.id === transactionId);
  const vendor = transaction ? data.vendors.find(v => v.id === transaction.vendorId) : null;

  if (!transaction) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate({ to: '/transactions' })} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Transactions
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Transaction not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      await deleteTransaction(transaction.id);
      toast.success('Transaction deleted successfully');
      navigate({ to: '/transactions' });
    } catch (error) {
      toast.error('Failed to delete transaction');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate({ to: '/transactions' })} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Transactions
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditDialogOpen(true)} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)} className="gap-2">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Building2 className="h-6 w-6 text-muted-foreground" />
                {vendor?.name || 'Unknown Vendor'}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 text-base">
                <Calendar className="h-4 w-4" />
                {new Date(transaction.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold flex items-center gap-1">
                <DollarSign className="h-6 w-6" />
                {transaction.totalAmount.toFixed(2)}
              </div>
              <Badge variant={transaction.type === 'split' ? 'default' : 'secondary'} className="mt-2">
                {transaction.type === 'split' ? 'Split Payment' : 'Solo Payment'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {transaction.notes && (
            <div>
              <h3 className="font-semibold mb-2">Notes</h3>
              <p className="text-muted-foreground">{transaction.notes}</p>
            </div>
          )}

          {transaction.type === 'split' && transaction.splits && transaction.splits.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Split Details</h3>
              <div className="space-y-2">
                {transaction.splits.map((split, index) => {
                  const person = data.people.find(p => p.id === split.personId);
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="font-medium">{person?.name || 'Unknown Person'}</span>
                      <span className="font-bold">${split.amount.toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {transaction.receiptImages && transaction.receiptImages.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Receipt Images ({transaction.receiptImages.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {transaction.receiptImages.map((imageUrl, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border bg-muted">
                    <img
                      src={imageUrl}
                      alt={`Receipt ${index + 1}`}
                      className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => window.open(imageUrl, '_blank')}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <TransactionFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        transaction={transaction}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
