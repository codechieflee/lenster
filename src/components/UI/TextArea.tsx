import { ComponentProps, forwardRef } from 'react'

import { FieldError } from './Form'

interface Props extends ComponentProps<'textarea'> {
  label?: string
}

export const TextArea = forwardRef<HTMLTextAreaElement, Props>(
  function TextArea({ label, ...props }, ref) {
    return (
      <label>
        {label && (
          <div className="mb-1 font-medium text-gray-800 dark:text-gray-200">
            {label}
          </div>
        )}
        <textarea
          className="py-2 px-4 w-full bg-white rounded-xl border border-gray-300 shadow-sm dark:bg-gray-800 dark:border-gray-700 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 focus:border-brand-500 focus:ring-brand-400"
          ref={ref}
          {...props}
        />
        {props.name && <FieldError name={props.name} />}
      </label>
    )
  }
)
