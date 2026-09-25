import React from 'react';
import { SkillType } from '../types/skill';

interface SkillBadgeProps {
  name: string;
  type?: SkillType | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  onRemove?: () => void;
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({
  name,
  type = 'neutral',
  size = 'md',
  onRemove,
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  }[size];

  const typeStyles = {
    OFFERED: 'bg-emerald-50 text-emerald-800 border-emerald-200/80 hover:bg-emerald-100/70',
    WANTED: 'bg-amber-50 text-amber-800 border-amber-200/80 hover:bg-amber-100/70',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/70',
  }[type];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border transition-colors ${sizeClasses} ${typeStyles}`}
    >
      {type === 'OFFERED' && (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="Skill Offered (Teaches)" />
      )}
      {type === 'WANTED' && (
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" title="Skill Wanted (Learns)" />
      )}
      <span>{name}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 text-slate-400 hover:text-slate-700 focus:outline-none"
          aria-label={`Remove ${name}`}
        >
          ×
        </button>
      )}
    </span>
  );
};
