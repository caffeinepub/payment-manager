import { useState } from 'react';
import { Person } from '../../lib/storage/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, User } from 'lucide-react';
import { PersonFormDialog } from './PersonFormDialog';
import { DeletePersonGuard } from './DeletePersonGuard';

interface PersonCardProps {
  person: Person;
}

export function PersonCard({ person }: PersonCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{person.name}</CardTitle>
                {person.notes && (
                  <CardDescription className="line-clamp-1">{person.notes}</CardDescription>
                )}
              </div>
            </div>
          </div>
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

      <PersonFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        person={person}
      />

      <DeletePersonGuard
        person={person}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </>
  );
}
