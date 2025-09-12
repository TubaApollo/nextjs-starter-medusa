import { HttpTypes } from "@medusajs/types"
import React from "react"
import Select from "react-select"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const values = option.values ?? []

  const optionsForSelect = values.map((v) => ({ value: v.value, label: v.value }))

  return (
    <div className="flex flex-col gap-y-2">
      <label className="text-sm font-medium" htmlFor={`opt-${option.id}`}>{title}</label>
      <div className="mt-1">
        <Select
          className="swiper-no-swiping"
          inputId={`opt-${option.id}`}
          isDisabled={disabled}
          value={current ? { value: current, label: current } : null}
          onChange={(val: any) => updateOption(option.id, val?.value ?? '')}
          options={optionsForSelect}
          placeholder="Bitte wählen"
          instanceId={`opt-${option.id}`}
          classNamePrefix="react-select"
          menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
          menuPosition={'fixed'}
          menuPlacement={'auto'}
          styles={{
            control: (base: any) => ({ ...base, borderRadius: 6, borderColor: '#e5e7eb', minHeight: 40 }),
            valueContainer: (base: any) => ({ ...base, padding: '0 8px' }),
            /* Keep select menus under the sticky header (z-50) so header remains on top */
            menuPortal: (base: any) => ({ ...base, zIndex: 40 }),
          }}
        />
      </div>
    </div>
  )
}

export default OptionSelect
