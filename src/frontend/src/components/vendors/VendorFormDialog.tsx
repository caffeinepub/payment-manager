import { useState, useEffect } from 'react';
import { useLocalDataContext } from '../../lib/storage/LocalDataProvider';
import { Vendor } from '../../lib/storage/schema';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface VendorFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendor?: Vendor;
}

export function VendorFormDialog({ open, onOpenChange, vendor }: VendorFormDialogProps) {
  const { addVendor, updateVendor } = useLocalDataContext();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (vendor) {
      setName(vendor.name);
      setCategory(vendor.category || '');
      setNotes(vendor.notes || '');
    } else {
      setName('');
      setCategory('');
      setNotes('');
    }
  }, [vendor, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter a vendor name');
      return;
    }

    setIsSubmitting(true);
    try {
      if (vendor) {
        await updateVendor({
          ...vendor,
          name: name.trim(),
          category: category.trim() || undefined,
          notes: notes.trim() || undefined,
        });
        toast.success('Vendor updated successfully');
      } else {
        await addVendor({
          name: name.trim(),
          category: category.trim() || undefined,
          notes: notes.trim() || undefined,
        });
        toast.success('Vendor added successfully');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to save vendor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{vendor ? 'Edit Vendor' : 'Add Vendor'}</DialogTitle>
          <DialogDescription>
            {vendor ? 'Update vendor details' : 'Add a new vendor or merchant'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter vendor name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Restaurant, Grocery, Utilities"
              />
            </div>
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
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : vendor ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
