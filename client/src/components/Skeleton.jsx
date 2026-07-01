import { cn } from '../lib/utils';

/** @param {{ className?: string }} props */
export default function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded bg-dark-200', className)} />;
}
