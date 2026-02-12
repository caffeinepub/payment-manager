import { useState } from 'react';
import { useLocalDataContext } from '../lib/storage/LocalDataProvider';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Building2, DollarSign, Receipt } from 'lucide-react';
import { TransactionFormDialog } from '../components/transactions/TransactionFormDialog';

export function TransactionsPage() {
  const { data, isLoading } = useLocalDataContext();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading transactions...</p>
      </div>
    );
  }

  const sortedTransactions = [...data.transactions].sort((a, b) => b.date - a.date);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
          <p className="text-muted-foreground">Manage your payments and splits</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      {sortedTransactions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Receipt className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No transactions yet</p>
            <p className="text-sm text-muted-foreground mb-4">Get started by adding your first transaction</p>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Transaction
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sortedTransactions.map(transaction => {
            const vendor = data.vendors.find(v => v.id === transaction.vendorId);
            return (
              <Link key={transaction.id} to="/transactions/$transactionId" params={{ transactionId: transaction.id }}>
                <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {vendor?.name || 'Unknown Vendor'}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {new Date(transaction.date).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold flex items-center gap-1">
                          <DollarSign className="h-5 w-5" />
                          {transaction.totalAmount.toFixed(2)}
                        </div>
                        <Badge variant={transaction.type === 'split' ? 'default' : 'secondary'} className="mt-1">
                          {transaction.type === 'split' ? 'Split' : 'Solo'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  {transaction.notes && (
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-2">{transaction.notes}</p>
                    </CardContent>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      <TransactionFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
