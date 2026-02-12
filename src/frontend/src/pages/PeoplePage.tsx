import { useState } from 'react';
import { useLocalDataContext } from '../lib/storage/LocalDataProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Users } from 'lucide-react';
import { PersonFormDialog } from '../components/people/PersonFormDialog';
import { PersonCard } from '../components/people/PersonCard';

export function PeoplePage() {
  const { data, isLoading } = useLocalDataContext();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading people...</p>
      </div>
    );
  }

  const sortedPeople = [...data.people].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">People</h2>
          <p className="text-muted-foreground">Manage people involved in split payments</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Person
        </Button>
      </div>

      {sortedPeople.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No people yet</p>
            <p className="text-sm text-muted-foreground mb-4">Add people to track split payments</p>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Person
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedPeople.map(person => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      )}

      <PersonFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
