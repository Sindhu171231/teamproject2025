"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import Image from "next/image"

interface Product {
  id: string
  name: string
  price: number
  image: string
  seller: string
  stock: number
}

interface AddToCartPopupProps {
  isOpen: boolean
  onClose: () => void
  product: Product
  onAddToCart: (productId: string, quantity: number) => void
}

export default function AddToCartPopup({ isOpen, onClose, product, onAddToCart }: AddToCartPopupProps) {
  const [quantity, setQuantity] = useState(1)

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    onAddToCart(product.id, quantity)
    onClose()
    setQuantity(1)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Cart</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-4">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={80}
              height={80}
              className="rounded-md object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold line-clamp-2">{product.name}</h3>
              <p className="text-sm text-gray-600">by {product.seller}</p>
              <p className="text-lg font-bold text-blue-600">${product.price}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
                className="w-20 text-center"
                min={1}
                max={product.stock}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600">{product.stock} items available</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleAddToCart} className="flex-1">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
