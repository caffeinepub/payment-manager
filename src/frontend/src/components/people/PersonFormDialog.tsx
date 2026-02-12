import { useState, useEffect } from 'react';
import { useLocalDataContext } from '../../lib/storage/LocalDataProvider';
import { Person } from '../../lib/storage/schema';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface PersonFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  person?: Person;
}

export function PersonFormDialog({ open, onOpenChange, person }: PersonFormDialogProps) {
  const { addPerson, updatePerson } = useLocalDataContext();
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (person) {
      setName(person.name);
      setNotes(person.notes || '');
    } else {
      setName('');
      setNotes('');
    }
  }, [person, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter a name');
      return;
    }

    setIsSubmitting(true);
    try {
      if (person) {
        await updatePerson({
          ...person,
          name: name.trim(),
          notes: notes.trim() || undefined,
        });
        toast.success('Person updated successfully');
      } else {
        await addPerson({
          name: name.trim(),
          notes: notes.trim() || undefined,
        });
        toast.success('Person added successfully');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to save person');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{person ? 'Edit Person' : 'Add Person'}</DialogTitle>
          <DialogDescription>
            {person ? 'Update person details' : 'Add a new person to track split payments'}
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
                placeholder="Enter name"
                required
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
              {isSubmitting ? 'Saving...' : person ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
