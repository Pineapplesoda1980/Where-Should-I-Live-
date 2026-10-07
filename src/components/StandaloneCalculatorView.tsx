import React, { useState } from 'react';
import { Calculator, ShieldCheck, DollarSign, HelpCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { formatSGD } from '../utils/calculator';

export const StandaloneCalculatorView: React.FC = () => {
  const [income, setIncome] = useState<number>(6500);
  const [buyerType, setBuyerType] = useState<'couple' | 'single' | 'upgrader'>('couple');
  const [flatType, setFlatType] = useState<string>('4-Room');
  const [proximityOption, setProximityOption] = useState<'none' | 'within4km' | 'withParents'>('within4km');
  const [targetFlatPrice, setTargetFlatPrice] = useState<number>(650000);
  const [loanTenure, setLoanTenure] = useState<number>(25);
  const [loanScheme, setLoanScheme] = useState<'hdb' | 'bank'>('hdb');

  // Enhanced CPF Housing Grant (EHG)
  let ehg = 0;
  if (buyerType === 'couple') {
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
  } else if (buyerType === 'single') {
    if (income <= 750) ehg = 40000;
    else if (income <= 1500) ehg = 35000;
    else if (income <= 2500) ehg = 25000;
    else if (income <= 3500) ehg = 15000;
    else if (income <= 4500) ehg = 5000;
    else ehg = 0;
  }

  // CPF Family Grant
  let familyGrant = 0;
  if (buyerType === 'couple' && income <= 14000) {
    familyGrant = flatType === '5-Room' ? 50000 : 80000;
  } else if (buyerType === 'single' && income <= 7000) {
    familyGrant = flatType === '5-Room' ? 25000 : 40000;
  }

  // Proximity Housing Grant
  let phg = 0;
  if (proximityOption === 'withParents') phg = 30000;
  else if (proximityOption === 'within4km') phg = 20000;

  const totalGrant = ehg + familyGrant + phg;

  // Mortgage Servicing Ratio (MSR 30% cap)
  const msrMonthlyCap = Math.round(income * 0.3);

  // Maximum loan based on MSR
  const interestRate = loanScheme === 'hdb' ? 2.6 : 2.9;
  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = loanTenure * 12;
  const maxLoanBorrowable = Math.round(
    (msrMonthlyCap * (Math.pow(1 + monthlyRate, totalMonths) - 1)) /
    (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))
  );

  // Actual modeled purchase loan
  const netPurchasePrice = Math.max(targetFlatPrice - totalGrant, 50000);
  const ltvPercent = loanScheme === 'hdb' ? 80 : 75;
  const requiredLoan = Math.min(Math.round(netPurchasePrice * (ltvPercent / 100)), maxLoanBorrowable);
  const downpayment = Math.max(targetFlatPrice - requiredLoan - totalGrant, 0);

  const monthlyRepayment = Math.round(
    (requiredLoan * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-2xl sm:text-3xl text-[#0F172A] tracking-tight">
          Singapore CPF Housing Grant & Affordability Modeler
        </h1>
        <p className="text-sm text-[#64748B] mt-1 max-w-2xl">
          Calculate your official CPF Housing Grants (up to $190k) and verify your Mortgage Servicing Ratio (MSR) limit under Monetary Authority of Singapore (MAS) regulations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs space-y-6">
          <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-base text-[#0F172A] pb-3 border-b border-[#F1F5F9]">
            Buyer Demographics & Financial Parameters
          </h2>

          {/* Buyer Scheme */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#0F172A]">
              Applicant Profile
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setBuyerType('couple')}
                className={`py-2 px-3 text-xs rounded-lg font-semibold border transition-all cursor-pointer ${
                  buyerType === 'couple'
                    ? 'bg-[#0D9488] text-white border-[#0D9488]'
                    : 'bg-white text-[#475569] border-[#CBD5E1] hover:bg-[#F8FAFC]'
                }`}
              >
                First-Timer Couple
              </button>
              <button
                onClick={() => setBuyerType('single')}
                className={`py-2 px-3 text-xs rounded-lg font-semibold border transition-all cursor-pointer ${
                  buyerType === 'single'
                    ? 'bg-[#0D9488] text-white border-[#0D9488]'
                    : 'bg-white text-[#475569] border-[#CBD5E1] hover:bg-[#F8FAFC]'
                }`}
              >
                Single Citizen (≥35)
              </button>
              <button
                onClick={() => setBuyerType('upgrader')}
                className={`py-2 px-3 text-xs rounded-lg font-semibold border transition-all cursor-pointer ${
                  buyerType === 'upgrader'
                    ? 'bg-[#0D9488] text-white border-[#0D9488]'
                    : 'bg-white text-[#475569] border-[#CBD5E1] hover:bg-[#F8FAFC]'
                }`}
              >
                Second-Timer Upgrader
              </button>
            </div>
          </div>

          {/* Household Income Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#0F172A]">
                Combined Gross Monthly Household Income
              </span>
              <span className="font-bold text-[#0D9488] text-sm tabular-nums">
                {formatSGD(income)}/mo
              </span>
            </div>
            <input
              type="range"
              min="1500"
              max="16000"
              step="500"
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="w-full accent-[#0D9488] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#94A3B8] tabular-nums">
              <span>$1,500</span>
              <span>$8,000</span>
              <span>$16,000+</span>
            </div>
          </div>

          {/* Intended Flat Room Type */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#0F172A]">
              Target Flat Size
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['2-Room', '3-Room', '4-Room', '5-Room'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFlatType(type)}
                  className={`py-2 px-3 text-xs rounded-lg font-semibold border transition-all cursor-pointer ${
                    flatType === type
                      ? 'bg-[#0D9488] text-white border-[#0D9488]'
                      : 'bg-white text-[#475569] border-[#CBD5E1] hover:bg-[#F8FAFC]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Proximity Option */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#0F172A]">
              Proximity Housing Grant (PHG) Condition
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setProximityOption('within4km')}
                className={`py-2 px-3 text-xs rounded-lg font-semibold border transition-all cursor-pointer ${
                  proximityOption === 'within4km'
                    ? 'bg-[#0D9488] text-white border-[#0D9488]'
                    : 'bg-white text-[#475569] border-[#CBD5E1] hover:bg-[#F8FAFC]'
                }`}
              >
                Within 4km of Parents ($20k)
              </button>
              <button
                onClick={() => setProximityOption('withParents')}
                className={`py-2 px-3 text-xs rounded-lg font-semibold border transition-all cursor-pointer ${
                  proximityOption === 'withParents'
                    ? 'bg-[#0D9488] text-white border-[#0D9488]'
                    : 'bg-white text-[#475569] border-[#CBD5E1] hover:bg-[#F8FAFC]'
                }`}
              >
                Living with Parents ($30k)
              </button>
              <button
                onClick={() => setProximityOption('none')}
                className={`py-2 px-3 text-xs rounded-lg font-semibold border transition-all cursor-pointer ${
                  proximityOption === 'none'
                    ? 'bg-[#0D9488] text-white border-[#0D9488]'
                    : 'bg-white text-[#475569] border-[#CBD5E1] hover:bg-[#F8FAFC]'
                }`}
              >
                Not Applicable ($0)
              </button>
            </div>
          </div>

          {/* Target Flat Price */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#0F172A]">
                Target Flat Purchase Price
              </span>
              <span className="font-bold text-[#0D9488] text-sm tabular-nums">
                {formatSGD(targetFlatPrice)}
              </span>
            </div>
            <input
              type="range"
              min="350000"
              max="1400000"
              step="25000"
              value={targetFlatPrice}
              onChange={(e) => setTargetFlatPrice(Number(e.target.value))}
              className="w-full accent-[#0D9488] cursor-pointer"
            />
          </div>

          {/* Financing Details */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-[#0F172A] block mb-1">
                Loan Scheme
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setLoanScheme('hdb')}
                  className={`flex-1 py-1.5 text-xs rounded font-semibold cursor-pointer ${
                    loanScheme === 'hdb'
                      ? 'bg-[#0D9488] text-white'
                      : 'bg-[#F1F5F9] text-[#475569]'
                  }`}
                >
                  HDB (2.6%)
                </button>
                <button
                  onClick={() => setLoanScheme('bank')}
                  className={`flex-1 py-1.5 text-xs rounded font-semibold cursor-pointer ${
                    loanScheme === 'bank'
                      ? 'bg-[#0D9488] text-white'
                      : 'bg-[#F1F5F9] text-[#475569]'
                  }`}
                >
                  Bank (2.9%)
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#0F172A] block mb-1">
                Tenure: <span className="font-bold tabular-nums">{loanTenure} Yrs</span>
              </label>
              <input
                type="range"
                min="15"
                max="30"
                step="5"
                value={loanTenure}
                onChange={(e) => setLoanTenure(Number(e.target.value))}
                className="w-full accent-[#0D9488] cursor-pointer mt-1"
              />
            </div>
          </div>
        </div>

        {/* Right Panel: Output Intelligence (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Grant Total Card */}
          <div className="bg-[#0D9488] text-white p-6 rounded-xl shadow-md space-y-4">
            <span className="text-xs uppercase tracking-wider text-teal-100 font-bold block">
              Estimated Total CPF Housing Grants
            </span>
            <div className="text-4xl font-bold font-['Inter'] tabular-nums">
              {formatSGD(totalGrant)}
            </div>

            <div className="space-y-2 pt-2 border-t border-teal-500/50 text-xs text-teal-50">
              <div className="flex justify-between">
                <span>Enhanced Housing Grant (EHG):</span>
                <span className="font-bold tabular-nums">{formatSGD(ehg)}</span>
              </div>
              <div className="flex justify-between">
                <span>CPF Family Grant:</span>
                <span className="font-bold tabular-nums">{formatSGD(familyGrant)}</span>
              </div>
              <div className="flex justify-between">
                <span>Proximity Housing Grant (PHG):</span>
                <span className="font-bold tabular-nums">{formatSGD(phg)}</span>
              </div>
            </div>
          </div>

          {/* Affordability & MSR Safeguard Box */}
          <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs space-y-4">
            <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#0F172A] flex items-center justify-between">
              <span>MSR Regulatory Safeguard (30% Cap)</span>
              <ShieldCheck className="w-4 h-4 text-[#0D9488]" />
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-3 bg-[#F8FAFC] rounded-lg">
                <span className="text-[#64748B]">Max Permissible Monthly Installment:</span>
                <span className="font-bold text-[#0F172A] tabular-nums">
                  {formatSGD(msrMonthlyCap)}/mo
                </span>
              </div>

              <div className="flex justify-between p-3 bg-[#F8FAFC] rounded-lg">
                <span className="text-[#64748B]">Estimated Installment for this Flat:</span>
                <span className="font-bold text-[#0D9488] tabular-nums">
                  {formatSGD(monthlyRepayment)}/mo
                </span>
              </div>

              <div className="flex justify-between p-3 bg-[#F8FAFC] rounded-lg">
                <span className="text-[#64748B]">Required Downpayment (Cash/CPF):</span>
                <span className="font-bold text-[#0F172A] tabular-nums">
                  {formatSGD(downpayment)}
                </span>
              </div>

              <div className="flex justify-between p-3 bg-[#F8FAFC] rounded-lg">
                <span className="text-[#64748B]">Max Borrowable Loan:</span>
                <span className="font-bold text-[#0F172A] tabular-nums">
                  {formatSGD(maxLoanBorrowable)}
                </span>
              </div>
            </div>

            {monthlyRepayment <= msrMonthlyCap ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Financially Sound: Monthly installment is well within the 30% MSR ceiling.
                </span>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 text-amber-800 text-xs rounded-lg flex items-center gap-2">
                <span>
                  Warning: Installment exceeds 30% MSR ceiling. Increase downpayment or extend tenure.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
