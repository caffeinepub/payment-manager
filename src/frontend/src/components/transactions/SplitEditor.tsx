import { Person } from '../../lib/storage/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

interface SplitEditorProps {
  splits: { personId: string; amount: string }[];
  onChange: (splits: { personId: string; amount: string }[]) => void;
  people: Person[];
}

export function SplitEditor({ splits, onChange, people }: SplitEditorProps) {
  const addSplit = () => {
    onChange([...splits, { personId: '', amount: '' }]);
  };

  const removeSplit = (index: number) => {
    onChange(splits.filter((_, i) => i !== index));
  };

  const updateSplit = (index: number, field: 'personId' | 'amount', value: string) => {
    const updated = [...splits];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Split Details</Label>
        <Button type="button" variant="outline" size="sm" onClick={addSplit} className="gap-2">
          <Plus className="h-3 w-3" />
          Add Person
        </Button>
      </div>

      {splits.length === 0 ? (
        <p className="text-sm text-muted-foreground">No splits added yet. Click "Add Person" to start.</p>
      ) : (
        <div className="space-y-3">
          {splits.map((split, index) => (
            <div key={index} className="flex gap-2 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor={`person-${index}`}>Person</Label>
                <Select
                  value={split.personId}
                  onValueChange={(value) => updateSplit(index, 'personId', value)}
                >
                  <SelectTrigger id={`person-${index}`}>
                    <SelectValue placeholder="Select person" />
                  </SelectTrigger>
                  <SelectContent>
                    {people.map(person => (
                      <SelectItem key={person.id} value={person.id}>
                        {person.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-32 space-y-2">
                <Label htmlFor={`amount-${index}`}>Amount</Label>
                <Input
                  id={`amount-${index}`}
                  type="number"
                  step="0.01"
                  min="0"
                  value={split.amount}
                  onChange={(e) => updateSplit(index, 'amount', e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removeSplit(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
