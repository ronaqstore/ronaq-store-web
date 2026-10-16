import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:opacity-90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:opacity-90',
        outline: 'border border-border bg-background shadow-sm hover:bg-muted hover:text-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:opacity-80',
        ghost: 'hover:bg-muted hover:text-foreground',
        link: 'text-primary underline-offset-4 hover:underline'
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-lg px-8 text-base',
        icon: 'h-9 w-9'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      type = 'button',
      isLoading = false,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const busy = isLoading || loading;
    return (
      <button
        type={type}
        className={cn(
          buttonVariants({ variant, size, className }),
          busy && 'relative disabled:opacity-100'
        )}
        ref={ref}
        disabled={disabled || busy}
        aria-busy={busy || undefined}
        suppressHydrationWarning
        {...props}
      >
        {busy ? (
          <>
            <span className='invisible inline-flex items-center gap-[inherit]' aria-hidden>
              {children}
            </span>
            <Spinner aria-hidden className='absolute inset-0 m-auto' />
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';
