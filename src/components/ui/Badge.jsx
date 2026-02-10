import { cn } from '@/lib/utils'

const variants = {
  default: 'bg-slate-100 text-slate-700',
  primary: 'bg-cyan-50 text-cyan-700 border border-cyan-200',
  success: 'bg-green-50 text-green-700 border border-green-200',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  gradient: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white',
}

export default function Badge({
  children,
  variant = 'default',
  className,
  ...props
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}