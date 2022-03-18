import clsx from 'clsx'

interface Props {
  className?: string
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

export const Spinner: React.FC<Props> = ({
  className = '',
  variant = 'primary',
  size = 'md'
}) => {
  return (
    <div
      className={clsx(
        {
          'border-brand-200 border-t-brand-600': variant === 'primary',
          'border-gray-200 border-t-gray-600': variant === 'secondary',
          'border-green-200 border-t-green-600': variant === 'success',
          'border-yellow-200 border-t-yellow-600': variant === 'warning',
          'border-red-200 border-t-red-600': variant === 'danger',
          'h-4 w-4 border-[2px]': size === 'xs',
          'h-5 w-5 border-2': size === 'sm',
          'h-8 w-8 border-[3px]': size === 'md',
          'h-10 w-10 border-4': size === 'lg'
        },
        'animate-spin rounded-full',
        className
      )}
    />
  )
}
