import { useState, useEffect } from 'react';
import { useLocalDataContext } from '../../lib/storage/LocalDataProvider';
import { Transaction } from '../../lib/storage/schema';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SplitEditor } from './SplitEditor';
import { ReceiptAttachments } from './ReceiptAttachments';
import { validateTransaction } from './transactionValidation';
import { toast } from 'sonner';

interface TransactionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction;
}

export function TransactionFormDialog({ open, onOpenChange, transaction }: TransactionFormDialogProps) {
  const { data, addTransaction, updateTransaction } = useLocalDataContext();
  const [date, setDate] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [type, setType] = useState<'solo' | 'split'>('solo');
  const [splits, setSplits] = useState<{ personId: string; amount: string }[]>([]);
  const [receiptImages, setReceiptImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (transaction) {
      setDate(new Date(transaction.date).toISOString().split('T')[0]);
      setVendorId(transaction.vendorId);
      setTotalAmount(transaction.totalAmount.toString());
      setNotes(transaction.notes || '');
      setType(transaction.type);
      setSplits(
        transaction.splits?.map(s => ({ personId: s.personId, amount: s.amount.toString() })) || []
      );
      setReceiptImages(transaction.receiptImages || []);
    } else {
      setDate(new Date().toISOString().split('T')[0]);
      setVendorId('');
      setTotalAmount('');
      setNotes('');
      setType('solo');
      setSplits([]);
      setReceiptImages([]);
    }
  }, [transaction, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(totalAmount);
    const splitAmounts = splits.map(s => ({ personId: s.personId, amount: parseFloat(s.amount) }));

    const validation = validateTransaction({
      vendorId,
      totalAmount: amount,
      type,
      splits: type === 'split' ? splitAmounts : undefined,
    });

    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    setIsSubmitting(true);
    try {
      const transactionData = {
        date: new Date(date).getTime(),
        vendorId,
        totalAmount: amount,
        notes: notes.trim() || undefined,
        type,
        splits: type === 'split' ? splitAmounts : undefined,
        receiptImages: receiptImages.length > 0 ? receiptImages : undefined,
      };

      if (transaction) {
        await updateTransaction({
          ...transaction,
          ...transactionData,
        });
        toast.success('Transaction updated successfully');
      } else {
        await addTransaction(transactionData);
        toast.success('Transaction added successfully');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to save transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{transaction ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
          <DialogDescription>
            {transaction ? 'Update transaction details' : 'Create a new transaction'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor *</Label>
                <Select value={vendorId} onValueChange={setVendorId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {data.vendors.map(vendor => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Total Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Payment Type *</Label>
              <RadioGroup value={type} onValueChange={(v) => {
                setType(v as 'solo' | 'split');
                if (v === 'solo') {
                  setSplits([]);
                }
              }}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="solo" id="solo" />
                  <Label htmlFor="solo" className="font-normal cursor-pointer">
                    Solo Payment
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="split" id="split" />
                  <Label htmlFor="split" className="font-normal cursor-pointer">
                    Split Payment
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {type === 'split' && (
              <SplitEditor splits={splits} onChange={setSplits} people={data.people} />
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes"
                rows={3}
              />
            </div>

            <ReceiptAttachments images={receiptImages} onChange={setReceiptImages} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : transaction ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
