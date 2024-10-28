import React, { forwardRef, useState, useEffect } from 'react'

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', label, checked, onCheckedChange, ...props }, ref) => {
    const [isChecked, setIsChecked] = useState(checked || false)

    useEffect(() => {
      setIsChecked(checked || false)
    }, [checked])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = event.target.checked
      setIsChecked(newChecked)
      if (onCheckedChange) {
        onCheckedChange(newChecked)
      }
    }

    return (
      <div className="flex items-center">
        <input
          type="checkbox"
          ref={ref}
          className={`
            appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white 
            checked:bg-primary checked:border-primary
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
            transition duration-200
            ${className}
          `}
          checked={isChecked}
          onChange={handleChange}
          {...props}
        />
        {label && (
          <label
            htmlFor={props.id}
            className="ml-2 text-sm font-medium text-gray-900"
          >
            {label}
          </label>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export { Checkbox }