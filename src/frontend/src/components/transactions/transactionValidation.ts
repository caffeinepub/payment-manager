interface TransactionValidationInput {
  vendorId: string;
  totalAmount: number;
  type: 'solo' | 'split';
  splits?: { personId: string; amount: number }[];
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateTransaction(input: TransactionValidationInput): ValidationResult {
  if (!input.vendorId) {
    return { isValid: false, error: 'Please select a vendor' };
  }

  if (isNaN(input.totalAmount) || input.totalAmount <= 0) {
    return { isValid: false, error: 'Please enter a valid total amount' };
  }

  if (input.type === 'split') {
    if (!input.splits || input.splits.length === 0) {
      return { isValid: false, error: 'Please add at least one person to the split' };
    }

    for (const split of input.splits) {
      if (!split.personId) {
        return { isValid: false, error: 'Please select a person for each split entry' };
      }

      if (isNaN(split.amount) || split.amount < 0) {
        return { isValid: false, error: 'Split amounts must be non-negative numbers' };
      }
    }

    // Check for duplicate people
    const personIds = input.splits.map(s => s.personId);
    const uniquePersonIds = new Set(personIds);
    if (personIds.length !== uniquePersonIds.size) {
      return { isValid: false, error: 'Each person can only appear once in a split' };
    }

    // Optional: Validate sum equals total
    const splitSum = input.splits.reduce((sum, s) => sum + s.amount, 0);
    const tolerance = 0.01;
    if (Math.abs(splitSum - input.totalAmount) > tolerance) {
      return {
        isValid: false,
        error: `Split amounts ($${splitSum.toFixed(2)}) must equal the total amount ($${input.totalAmount.toFixed(2)})`,
      };
    }
  }

  return { isValid: true };
}
