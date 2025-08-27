"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag,
  getCartId,
  removeAuthToken,
  removeCartId,
  setAuthToken,
} from "./cookies"

export const retrieveCustomer =
  async (): Promise<HttpTypes.StoreCustomer | null> => {
    const authHeaders = await getAuthHeaders()

    if (!authHeaders) return null

    const headers = {
      ...authHeaders,
    }

    const next = {
      ...(await getCacheOptions("customers")),
    }

    return await sdk.client
      .fetch<{ customer: HttpTypes.StoreCustomer }>(`/store/customers/me`, {
        method: "GET",
        query: {
          fields: "*orders",
        },
        headers,
        next,
        cache: "force-cache",
      })
      .then(({ customer }) => customer)
      .catch(() => null)
  }

export const updateCustomer = async (body: HttpTypes.StoreUpdateCustomer) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const updateRes = await sdk.store.customer
    .update(body, {}, headers)
    .then(({ customer }) => customer)
    .catch(medusaError)

  const cacheTag = await getCacheTag("customers")
  revalidateTag(cacheTag)

  return updateRes
}

export async function signup(_currentState: unknown, formData: FormData) {
  const password = formData.get("password") as string
  const customerForm = {
    email: formData.get("email") as string,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    phone: formData.get("phone") as string,
  }

  // Basic validation
  if (!customerForm.email || !password || !customerForm.first_name || !customerForm.last_name) {
    return "Bitte füllen Sie alle erforderlichen Felder aus."
  }

  if (!customerForm.email.includes('@')) {
    return "Bitte geben Sie eine gültige E-Mail-Adresse ein."
  }

  if (password.length < 8) {
    return "Das Passwort muss mindestens 8 Zeichen lang sein."
  }

  // Enhanced password validation
  if (!/[A-Z]/.test(password)) {
    return "Das Passwort muss mindestens einen Großbuchstaben enthalten."
  }

  if (!/[a-z]/.test(password)) {
    return "Das Passwort muss mindestens einen Kleinbuchstaben enthalten."
  }

  if (!/[0-9]/.test(password)) {
    return "Das Passwort muss mindestens eine Zahl enthalten."
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "Das Passwort muss mindestens ein Sonderzeichen enthalten."
  }

  try {
    const token = await sdk.auth.register("customer", "emailpass", {
      email: customerForm.email,
      password: password,
    })

    await setAuthToken(token as string)

    const headers = {
      ...(await getAuthHeaders()),
    }

    const { customer: createdCustomer } = await sdk.store.customer.create(
      customerForm,
      {},
      headers
    )

    const loginToken = await sdk.auth.login("customer", "emailpass", {
      email: customerForm.email,
      password,
    })

    await setAuthToken(loginToken as string)

    const customerCacheTag = await getCacheTag("customers")
    revalidateTag(customerCacheTag)

    await transferCart()

    return createdCustomer
  } catch (error: any) {
    // Handle specific registration errors
    const errorMessage = error.message || error.toString()
    
    if (errorMessage.includes('already exists') || 
        errorMessage.includes('Email already in use') ||
        errorMessage.includes('User already exists')) {
      return "Ein Konto mit dieser E-Mail-Adresse existiert bereits. Bitte verwenden Sie eine andere E-Mail-Adresse oder melden Sie sich an."
    }
    
    if (errorMessage.includes('Invalid email') || 
        errorMessage.includes('email format')) {
      return "Bitte geben Sie eine gültige E-Mail-Adresse ein."
    }
    
    if (errorMessage.includes('Password') && 
        (errorMessage.includes('weak') || errorMessage.includes('short'))) {
      return "Das Passwort erfüllt nicht alle Sicherheitsanforderungen. Bitte stellen Sie sicher, dass es mindestens 8 Zeichen lang ist und Groß- und Kleinbuchstaben, Zahlen sowie Sonderzeichen enthält."
    }
    
    if (errorMessage.includes('network') || 
        errorMessage.includes('fetch') ||
        errorMessage.includes('connection')) {
      return "Verbindungsfehler. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut."
    }
    
    if (error.status === 429) {
      return "Zu viele Registrierungsversuche. Bitte warten Sie einen Moment und versuchen Sie es erneut."
    }
    
    if (error.status >= 500) {
      return "Ein Serverfehler ist aufgetreten. Bitte versuchen Sie es später erneut."
    }
    
    // Fallback for any other errors
    return "Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support."
  }
}

export async function login(_currentState: unknown, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Basic validation
  if (!email || !password) {
    return "Bitte geben Sie E-Mail-Adresse und Passwort ein."
  }

  if (!email.includes('@')) {
    return "Bitte geben Sie eine gültige E-Mail-Adresse ein."
  }

  try {
    await sdk.auth
      .login("customer", "emailpass", { email, password })
      .then(async (token) => {
        await setAuthToken(token as string)
        const customerCacheTag = await getCacheTag("customers")
        revalidateTag(customerCacheTag)
      })
  } catch (error: any) {
    // Handle specific authentication errors
    const errorMessage = error.message || error.toString()
    
    if (errorMessage.includes('Invalid email or password') || 
        errorMessage.includes('invalid credentials') ||
        errorMessage.includes('Unauthorized') ||
        error.status === 401) {
      return "E-Mail-Adresse oder Passwort sind ungültig. Bitte überprüfen Sie Ihre Eingaben."
    }
    
    if (errorMessage.includes('User not found') || 
        errorMessage.includes('Customer not found')) {
      return "Ein Konto mit dieser E-Mail-Adresse wurde nicht gefunden."
    }
    
    if (errorMessage.includes('network') || 
        errorMessage.includes('fetch')) {
      return "Verbindungsfehler. Bitte überprüfen Sie Ihre Internetverbindung."
    }
    
    if (error.status === 429) {
      return "Zu viele Anmeldeversuche. Bitte warten Sie einen Moment."
    }
    
    if (error.status >= 500) {
      return "Ein Serverfehler ist aufgetreten. Bitte versuchen Sie es später erneut."
    }
    
    // Fallback for any other errors
    return "Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut."
  }

  try {
    await transferCart()
  } catch (error: any) {
    // Cart transfer errors are less critical, log but don't show to user
    console.error('Cart transfer failed:', error)
    // Continue without showing error to user
  }
}

export async function signout(countryCode: string) {
  await sdk.auth.logout()

  await removeAuthToken()

  const customerCacheTag = await getCacheTag("customers")
  revalidateTag(customerCacheTag)

  await removeCartId()

  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)

  redirect(`/${countryCode}/account`)
}

export async function signoutWithoutRedirect() {
  await sdk.auth.logout()
  await removeAuthToken()
  await removeCartId()

  const customerCacheTag = await getCacheTag("customers")
  revalidateTag(customerCacheTag)

  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)
}

export async function transferCart() {
  const cartId = await getCartId()

  if (!cartId) {
    return
  }

  const headers = await getAuthHeaders()

  await sdk.store.cart.transferCart(cartId, {}, headers)

  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)
}

export const addCustomerAddress = async (
  currentState: Record<string, unknown>,
  formData: FormData
): Promise<any> => {
  const isDefaultBilling = (currentState.isDefaultBilling as boolean) || false
  const isDefaultShipping = (currentState.isDefaultShipping as boolean) || false

  const address = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    company: formData.get("company") as string,
    address_1: formData.get("address_1") as string,
    address_2: formData.get("address_2") as string,
    city: formData.get("city") as string,
    postal_code: formData.get("postal_code") as string,
    province: formData.get("province") as string,
    country_code: formData.get("country_code") as string,
    phone: formData.get("phone") as string,
    is_default_billing: isDefaultBilling,
    is_default_shipping: isDefaultShipping,
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.customer
    .createAddress(address, {}, headers)
    .then(async ({ customer }) => {
      const customerCacheTag = await getCacheTag("customers")
      revalidateTag(customerCacheTag)
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}

export const deleteCustomerAddress = async (
  addressId: string
): Promise<void> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.customer
    .deleteAddress(addressId, headers)
    .then(async () => {
      const customerCacheTag = await getCacheTag("customers")
      revalidateTag(customerCacheTag)
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}

export const updateCustomerAddress = async (
  currentState: Record<string, unknown>,
  formData: FormData
): Promise<any> => {
  const addressId =
    (currentState.addressId as string) || (formData.get("addressId") as string)

  if (!addressId) {
    return { success: false, error: "Address ID is required" }
  }

  const address = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    company: formData.get("company") as string,
    address_1: formData.get("address_1") as string,
    address_2: formData.get("address_2") as string,
    city: formData.get("city") as string,
    postal_code: formData.get("postal_code") as string,
    province: formData.get("province") as string,
    country_code: formData.get("country_code") as string,
  } as HttpTypes.StoreUpdateCustomerAddress

  const phone = formData.get("phone") as string

  if (phone) {
    address.phone = phone
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.customer
    .updateAddress(addressId, address, {}, headers)
    .then(async () => {
      const customerCacheTag = await getCacheTag("customers")
      revalidateTag(customerCacheTag)
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}
