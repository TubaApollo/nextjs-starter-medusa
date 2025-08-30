"use client"

import React, { useEffect, useActionState } from "react";

import Input from "@modules/common/components/input"

import AccountInfo from "../account-info"
import { HttpTypes } from "@medusajs/types"
import { updateCustomer } from "@lib/data/customer"

type MyInformationProps = {
  customer?: HttpTypes.StoreCustomer | null
}

const ProfileName: React.FC<MyInformationProps> = ({ customer }) => {
  const [successState, setSuccessState] = React.useState(false)

  const updateCustomerName = async (
    _currentState: Record<string, unknown>,
    formData: FormData
  ) => {
    const customer = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
    }

    try {
      await updateCustomer(customer)
      return { success: true, error: null }
    } catch (error: any) {
      return { success: false, error: error.toString() }
    }
  }

  const [state, formAction] = useActionState(updateCustomerName, {
    error: false,
    success: false,
  })

  const clearState = () => {
    setSuccessState(false)
  }

  useEffect(() => {
    setSuccessState(state.success)
  }, [state])

  const currentName = `${customer?.first_name ?? ""}${customer?.last_name ? ` ${customer.last_name}` : ""}`.trim()

  return (
    <form action={formAction} className="w-full overflow-visible">
      <AccountInfo
        label="Name"
        currentInfo={currentName}
        isSuccess={successState}
        isError={!!state?.error}
        clearState={clearState}
        data-testid="account-name-editor"
      >
        <div className="grid grid-cols-2 gap-x-4">
          <Input
            label="Vorname"
            name="first_name"
            required
            defaultValue={customer?.first_name ?? ""}
            data-testid="first-name-input"
          />
          <Input
            label="Nachname"
            name="last_name"
            required
            defaultValue={customer?.last_name ?? ""}
            data-testid="last-name-input"
          />
        </div>
      </AccountInfo>
    </form>
  )
}

export default ProfileName
