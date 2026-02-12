import { Transaction, Person } from '../storage/schema';

export interface PersonBalance {
  personId: string;
  personName: string;
  totalOwed: number;
}

export function computeBalances(transactions: Transaction[], people: Person[]): PersonBalance[] {
  const balanceMap = new Map<string, number>();

  // Aggregate amounts from split transactions
  transactions.forEach(transaction => {
    if (transaction.type === 'split' && transaction.splits) {
      transaction.splits.forEach(split => {
        const current = balanceMap.get(split.personId) || 0;
        balanceMap.set(split.personId, current + split.amount);
      });
    }
  });

  // Convert to array and filter non-zero balances
  const balances: PersonBalance[] = [];
  balanceMap.forEach((totalOwed, personId) => {
    if (totalOwed !== 0) {
      const person = people.find(p => p.id === personId);
      if (person) {
        balances.push({
          personId,
          personName: person.name,
          totalOwed,
        });
      }
    }
  });

  // Sort by amount descending
  return balances.sort((a, b) => b.totalOwed - a.totalOwed);
}
