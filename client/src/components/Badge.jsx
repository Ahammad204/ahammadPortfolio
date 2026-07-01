import { cn } from '../lib/utils';

/** @param {{ children: React.ReactNode, variant?: 'default'|'primary', className?: string }} props */
export default function Badge({ children, variant = 'default', className }) {
  return (
    <span className={cn(
      'inline-block px-2.5 py-0.5 text-xs font-medium rounded-full',
      variant === 'primary' ? 'bg-primary/20 text-primary' : 'bg-dark-200 text-gray-300',
      className
    )}>
      {children}
    </span>
  );
}
