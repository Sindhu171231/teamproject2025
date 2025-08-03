"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Heart, Check } from "lucide-react"
import Image from "next/image"

interface Product {
  id: string
  name: string
  price: number
  image: string
  seller: string
  stock: number
}

interface AddToWishlistPopupProps {
  isOpen: boolean
  onClose: () => void
  product: Product
  onAddToWishlist: (productId: string) => void
}

export default function AddToWishlistPopup({ isOpen, onClose, product, onAddToWishlist }: AddToWishlistPopupProps) {
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToWishlist = async () => {
    setIsAdding(true)
    await onAddToWishlist(product.id)
    setIsAdding(false)
    setTimeout(onClose, 1000) // Close after showing success
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Wishlist</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-4">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={80}
              height={80}
              className="w-20 h-20 object-cover rounded-md"
            />
            <div className="flex-1">
              <h3 className="font-semibold line-clamp-2">{product.name}</h3>
              <p className="text-sm text-gray-600">by {product.seller}</p>
              <p className="font-bold text-lg">${product.price}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleAddToWishlist} disabled={isAdding} className="flex-1">
              {isAdding ? <Check className="h-4 w-4 mr-2" /> : <Heart className="h-4 w-4 mr-2" />}
              {isAdding ? "Added!" : "Add to Wishlist"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
