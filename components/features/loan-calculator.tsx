"use client";

import * as React from "react";

interface LoanCalculatorProps {
  propertyPrice?: number;
}

export function LoanCalculator({ propertyPrice = 5000000 }: LoanCalculatorProps) {
  const [loanAmount, setLoanAmount] = React.useState(0); // Default to 0
  const [interestRate, setInterestRate] = React.useState(8.5); // Default 8.5%
  const [loanDuration, setLoanDuration] = React.useState(20); // Default 20 years

  // Calculate monthly EMI
  const calculateEMI = () => {
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanDuration * 12;

    if (monthlyRate === 0) {
      // If no interest, simple division
      return loanAmount / numberOfPayments;
    }

    const emi =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    return emi;
  };

  const monthlyEMI = calculateEMI();
  const totalAmount = monthlyEMI * loanDuration * 12;
  const totalInterest = totalAmount - loanAmount;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900 mb-4">
        Loan Calculator
      </h2>

      <div className="space-y-6">
        {/* Loan Amount */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-neutral-700">
              Loan Amount
            </label>
            <span className="text-lg font-semibold text-primary-700">
              {formatCurrency(loanAmount)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={propertyPrice}
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-700"
          />
          <div className="flex justify-between text-xs text-neutral-500 mt-1">
            <span>{formatCurrency(0)}</span>
            <span>{formatCurrency(propertyPrice)}</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-neutral-700">
              Interest Rate (% per annum)
            </label>
            <span className="text-lg font-semibold text-primary-700">
              {interestRate.toFixed(2)}%
            </span>
          </div>
          <input
            type="range"
            min="3"
            max="15"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-700"
          />
          <div className="flex justify-between text-xs text-neutral-500 mt-1">
            <span>3%</span>
            <span>15%</span>
          </div>
        </div>

        {/* Loan Duration */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-neutral-700">
              Loan Duration (years)
            </label>
            <span className="text-lg font-semibold text-primary-700">
              {loanDuration} years
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="30"
            step="1"
            value={loanDuration}
            onChange={(e) => setLoanDuration(Number(e.target.value))}
            className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-700"
          />
          <div className="flex justify-between text-xs text-neutral-500 mt-1">
            <span>5 years</span>
            <span>30 years</span>
          </div>
        </div>

        {/* Results */}
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-4 space-y-3 border border-primary-200">
          <div className="flex justify-between items-center">
            <span className="text-neutral-700 font-medium">Monthly EMI</span>
            <span className="text-2xl font-bold text-primary-700">
              {formatCurrency(monthlyEMI)}
            </span>
          </div>
          <div className="border-t border-primary-200 pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Principal Amount</span>
              <span className="font-semibold text-neutral-900">
                {formatCurrency(loanAmount)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Total Interest</span>
              <span className="font-semibold text-neutral-900">
                {formatCurrency(totalInterest)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Total Amount Payable</span>
              <span className="font-semibold text-neutral-900">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Visual Breakdown */}
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 mb-3">
            Payment Breakdown
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-neutral-600">Principal</span>
                  <span className="font-semibold text-neutral-900">
                    {((loanAmount / totalAmount) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(loanAmount / totalAmount) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-neutral-600">Interest</span>
                  <span className="font-semibold text-neutral-900">
                    {((totalInterest / totalAmount) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${(totalInterest / totalAmount) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <p className="text-xs text-blue-900">
            <span className="font-semibold">Note:</span> This is an indicative
            calculation. Actual EMI may vary based on the lender's terms and
            conditions, processing fees, and other charges.
          </p>
        </div>
      </div>
    </div>
  );
}
