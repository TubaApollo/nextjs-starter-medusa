import { deleteLineItem } from "@lib/data/cart"
import { useState } from "react"
import { Button } from "@lib/components/ui/button"
import { Trash2 } from "lucide-react"

const DeleteButton = ({
  id,
  children,
  className,
  onClick,
  onDeleted,
}: {
  id: string
  children?: React.ReactNode
  className?: string
  onClick?: (id: string) => Promise<void> | void
  onDeleted?: (updatedCart: any | null) => void | Promise<void>
}) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    try {
      if (onClick) {
        await onClick(id)
        if (onDeleted) onDeleted(null)
      } else {
        const updatedCart = await deleteLineItem(id)
        if (onDeleted) await onDeleted(updatedCart)
      }
    } catch (err) {
      // ignore - keep UX consistent
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex items-center justify-between text-sm">
      <Button
        variant="secondary"
        size="sm"
        className={`h-8 w-8 p-0 ${className ?? "bg-white/90 hover:bg-white shadow-sm"}`}
        onClick={() => handleDelete(id)}
        aria-label="Entfernen"
      >
        {isDeleting ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <Trash2 className="h-4 w-4 text-red-600" />
        )}
      </Button>
    </div>
  )
}

export default DeleteButton
