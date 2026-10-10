import { cx } from '../../utils/cx'

const VARIANTS = {
  // CTA principal: color sólido de acento que destaca sobre todo lo demás.
  primary:
    'bg-primary text-white font-semibold shadow-lg shadow-primary/25 hover:bg-primary-hover hover:shadow-[0_0_28px_rgb(155_77_255/0.55)] active:scale-[0.98]',
  secondary: 'border border-edge bg-panel text-white hover:bg-hover',
  ghost: 'text-subtle hover:bg-hover hover:text-white',
  success: 'bg-success text-white font-semibold hover:brightness-110',
  danger: 'border border-danger/60 text-danger hover:bg-danger hover:text-white',
}

const SIZES = {
  sm: 'gap-1.5 rounded-md px-2.5 py-1.5 text-xs',
  md: 'gap-2 rounded-lg px-3.5 py-2 text-sm',
  lg: 'gap-2 rounded-xl px-5 py-3 text-base',
  icon: 'size-9 rounded-lg p-0 text-sm',
}

/** Botón base de la consola. Cualquier prop nativa (onClick, disabled...) pasa tal cual. */
export default function Button({
  variant = 'secondary',
  size = 'md',
  type = 'button',
  className,
  ...props
}) {
  return (
    <button
      type={type}
      className={cx(
        'inline-flex shrink-0 items-center justify-center font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  )
}
