// File: src/components/profile/PageHeader.tsx
'use client';

import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  subtitle?: string;
  icon?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({
  title,
  description,
  subtitle,
  icon,
  actions,
}: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          {icon && <span className="text-4xl">{icon}</span>}
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
            {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
            {description && (
              <p className="text-slate-600 mt-2">{description}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex-shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
