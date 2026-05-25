'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StepperProps {
  steps: {
    id: string;
    label: string;
  }[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("w-full py-4", className)}>
      <div className="flex items-center justify-between relative">
        {/* Connection Line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-100 -z-10" />
        <div 
          className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500 ease-in-out -z-10" 
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center group">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-white",
                  isCompleted ? "bg-primary border-primary text-white" : 
                  isActive ? "border-primary text-primary ring-4 ring-primary/10" : 
                  "border-slate-200 text-slate-400"
                )}
              >
                {isCompleted ? (
                  <Check size={18} strokeWidth={3} />
                ) : (
                  <span className="text-xs font-black">{index + 1}</span>
                )}
              </div>
              <span 
                className={cn(
                  "mt-3 text-[10px] font-black uppercase tracking-widest transition-colors duration-300",
                  isActive ? "text-primary" : isCompleted ? "text-slate-600" : "text-slate-400"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}