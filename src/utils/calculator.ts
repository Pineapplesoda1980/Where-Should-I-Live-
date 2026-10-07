export interface GrantCalculationResult {
  ehg: number;
  familyGrant: number;
  phg: number;
  totalGrant: number;
}

export function calculateCpfGrants(
  income: number,
  roomType: string,
  isFirstTimer: boolean,
  nearParents: boolean
): GrantCalculationResult {
  if (!isFirstTimer) {
    return { ehg: 0, familyGrant: 0, phg: nearParents ? 20000 : 0, totalGrant: nearParents ? 20000 : 0 };
  }

  // Enhanced CPF Housing Grant (EHG) tier based on household monthly income
  let ehg = 0;
  if (income <= 1500) ehg = 80000;
  else if (income <= 2000) ehg = 75000;
  else if (income <= 2500) ehg = 70000;
  else if (income <= 3000) ehg = 65000;
  else if (income <= 3500) ehg = 60000;
  else if (income <= 4000) ehg = 55000;
  else if (income <= 4500) ehg = 50000;
  else if (income <= 5000) ehg = 45000;
  else if (income <= 6000) ehg = 35000;
  else if (income <= 7000) ehg = 25000;
  else if (income <= 8000) ehg = 15000;
  else if (income <= 9000) ehg = 5000;
  else ehg = 0;

  // Family Grant: $80,000 for 2 to 4-room; $50,000 for 5-room or larger
  let familyGrant = 80000;
  if (roomType.includes('5-Room') || roomType.includes('Executive')) {
    familyGrant = 50000;
  }
  if (income > 14000) {
    familyGrant = 0;
  }

  // Proximity Housing Grant: $20,000 if within 4km of parents
  const phg = nearParents ? 20000 : 0;

  return {
    ehg,
    familyGrant,
    phg,
    totalGrant: ehg + familyGrant + phg,
  };
}

export interface MonthlyMortgageResult {
  loanAmount: number;
  downpaymentTotal: number;
  monthlyRepayment: number;
  totalInterestPaid: number;
  ltvPercent: number;
}

export function calculateMortgage(
  purchasePrice: number,
  totalGrant: number,
  loanType: 'hdb' | 'bank',
  tenureYears: number,
  interestRatePercent: number
): MonthlyMortgageResult {
  // Effective price after grants applied towards downpayment/price
  const effectivePrice = Math.max(purchasePrice - totalGrant, 100000);
  
  // HDB max LTV is 80%, Bank max LTV is 75%
  const ltvPercent = loanType === 'hdb' ? 80 : 75;
  const loanAmount = Math.round(effectivePrice * (ltvPercent / 100));
  const downpaymentTotal = Math.max(purchasePrice - loanAmount - totalGrant, 0);

  const monthlyRate = interestRatePercent / 100 / 12;
  const totalMonths = tenureYears * 12;

  let monthlyRepayment = 0;
  if (monthlyRate === 0) {
    monthlyRepayment = loanAmount / totalMonths;
  } else {
    monthlyRepayment =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }

  const totalInterestPaid = Math.max(monthlyRepayment * totalMonths - loanAmount, 0);

  return {
    loanAmount,
    downpaymentTotal,
    monthlyRepayment: Math.round(monthlyRepayment),
    totalInterestPaid: Math.round(totalInterestPaid),
    ltvPercent,
  };
}

export function formatSGD(amount: number): string {
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactSGD(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(2)}M`;
  }
  return `$${Math.round(amount / 1000)}k`;
}
