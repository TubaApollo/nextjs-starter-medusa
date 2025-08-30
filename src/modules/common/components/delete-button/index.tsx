import { deleteLineItem } from "@lib/data/cart"
import { useState } from "react"
import { Button } from "@lib/components/ui/button"
import { Trash2 } from "lucide-react"

const DeleteButton = ({
  id,
  children,
  className,
  onClick,
}: {
  id: string
  children?: React.ReactNode
  className?: string
  onClick?: (id: string) => Promise<void> | void
}) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    try {
      if (onClick) {
        await onClick(id)
      } else {
        await deleteLineItem(id)
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
        variant="ghost"
        size="sm"
        className={`gap-2 h-8 ${className ?? ''}`}
  onClick={() => handleDelete(id)}
      >
        {isDeleting ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <Trash2 className="h-4 w-4 text-destructive" />
        )}
        {children ? <span className="text-sm">{children}</span> : null}
      </Button>
    </div>
  )
}

export default DeleteButton
