import { useLocalDataContext } from '../lib/storage/LocalDataProvider';
import { computeBalances } from '../lib/balances/computeBalances';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp } from 'lucide-react';

export function BalancesPage() {
  const { data, isLoading } = useLocalDataContext();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading balances...</p>
      </div>
    );
  }

  const balances = computeBalances(data.transactions, data.people);
  const totalOutstanding = balances.reduce((sum, b) => sum + b.totalOwed, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Balances</h2>
        <p className="text-muted-foreground">Outstanding amounts owed by each person</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalOutstanding.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {balances.length} {balances.length === 1 ? 'person' : 'people'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Split Transactions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {data.transactions.filter(t => t.type === 'split').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total transactions: {data.transactions.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {balances.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No outstanding balances</p>
            <p className="text-sm text-muted-foreground">All split transactions are settled</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Outstanding Balances</CardTitle>
            <CardDescription>People with non-zero amounts owed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {balances.map(balance => (
                <div
                  key={balance.personId}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{balance.personName}</p>
                    <p className="text-sm text-muted-foreground">Total owed</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">${balance.totalOwed.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
