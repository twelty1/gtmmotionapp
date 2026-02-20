import { cn } from '@/lib/utils';
import { Building2, ShoppingCart, Shuffle } from 'lucide-react';
import type { BusinessModel } from '@/types/diligence';

interface BusinessModelToggleProps {
  value: BusinessModel;
  onChange: (model: BusinessModel) => void;
}

export function BusinessModelToggle({ value, onChange }: BusinessModelToggleProps) {
  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-sm font-medium text-foreground">Business Model</h4>
        <p className="text-xs text-muted-foreground mt-0.5">
          Select your go-to-market approach
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => onChange('B2B')}
          className={cn(
            'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-200',
            value === 'B2B'
              ? 'border-primary bg-primary/10 shadow-[0_0_12px_hsl(var(--primary)/0.15)]'
              : 'border-border hover:border-primary/40 hover:bg-muted/50'
          )}
        >
          <div
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
              value === 'B2B' ? 'bg-primary/20' : 'bg-muted'
            )}
          >
            <Building2
              className={cn(
                'w-5 h-5 transition-colors',
                value === 'B2B' ? 'text-primary' : 'text-muted-foreground'
              )}
            />
          </div>
          <div className="text-center">
            <span
              className={cn(
                'text-sm font-semibold block',
                value === 'B2B' ? 'text-primary' : 'text-foreground'
              )}
            >
              B2B
            </span>
            <span className="text-xs text-muted-foreground">Sales-Led</span>
          </div>
        </button>

        <button
          onClick={() => onChange('B2C')}
          className={cn(
            'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-200',
            value === 'B2C'
              ? 'border-primary bg-primary/10 shadow-[0_0_12px_hsl(var(--primary)/0.15)]'
              : 'border-border hover:border-primary/40 hover:bg-muted/50'
          )}
        >
          <div
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
              value === 'B2C' ? 'bg-primary/20' : 'bg-muted'
            )}
          >
            <ShoppingCart
              className={cn(
                'w-5 h-5 transition-colors',
                value === 'B2C' ? 'text-primary' : 'text-muted-foreground'
              )}
            />
          </div>
          <div className="text-center">
            <span
              className={cn(
                'text-sm font-semibold block',
                value === 'B2C' ? 'text-primary' : 'text-foreground'
              )}
            >
              B2C
            </span>
            <span className="text-xs text-muted-foreground">Digitally-Led</span>
          </div>
        </button>

        <button
          onClick={() => onChange('Mixed')}
          className={cn(
            'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-200',
            value === 'Mixed'
              ? 'border-primary bg-primary/10 shadow-[0_0_12px_hsl(var(--primary)/0.15)]'
              : 'border-border hover:border-primary/40 hover:bg-muted/50'
          )}
        >
          <div
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
              value === 'Mixed' ? 'bg-primary/20' : 'bg-muted'
            )}
          >
            <Shuffle
              className={cn(
                'w-5 h-5 transition-colors',
                value === 'Mixed' ? 'text-primary' : 'text-muted-foreground'
              )}
            />
          </div>
          <div className="text-center">
            <span
              className={cn(
                'text-sm font-semibold block',
                value === 'Mixed' ? 'text-primary' : 'text-foreground'
              )}
            >
              Mixed
            </span>
            <span className="text-xs text-muted-foreground">B2B + B2C</span>
          </div>
        </button>
      </div>
    </div>
  );
}
