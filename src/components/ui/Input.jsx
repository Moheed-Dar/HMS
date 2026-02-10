import { cn } from '@/lib/utils'

export default function Input({
  className,
  type = 'text',
  ...props
}) {
  return (
    <input
      type={type}
      className={cn(
        'flex w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all',
        className
      )}
      {...props}
    />
  )
}