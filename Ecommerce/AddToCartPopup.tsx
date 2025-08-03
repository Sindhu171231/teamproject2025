"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShoppingCart, Plus, Minus } from "lucide-react"
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
  const [isAdding, setIsAdding] = useState(false)

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 1
    handleQuantityChange(value)
  }

  const incrementQuantity = () => {
    handleQuantityChange(quantity + 1)
  }

  const decrementQuantity = () => {
    handleQuantityChange(quantity - 1)
  }

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      await onAddToCart(product.id, quantity)
      onClose()
      setQuantity(1)
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsAdding(false)
    }
  }

  const totalPrice = (product.price * quantity).toFixed(2)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Cart</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Info */}
          <div className="flex gap-4">
            <div className="relative w-20 h-20 flex-shrink-0">
              <Image
                src={product.image || "/placeholder.svg?height=80&width=80"}
                alt={product.name}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold line-clamp-2 text-sm">{product.name}</h3>
              <p className="text-sm text-gray-600 mt-1">by {product.seller}</p>
              <p className="font-bold text-lg text-blue-600 mt-1">₹{product.price}</p>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-3">
            <Label htmlFor="quantity" className="text-sm font-medium">
              Quantity
            </Label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="h-10 w-10 flex-shrink-0 bg-transparent"
              >
                <Minus className="h-4 w-4" />
              </Button>

              <div className="flex-1 max-w-[80px]">
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={handleInputChange}
                  className="text-center h-10"
                  min={1}
                  max={product.stock}
                />
              </div>

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={incrementQuantity}
                disabled={quantity >= product.stock}
                className="h-10 w-10 flex-shrink-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex justify-between text-sm text-gray-600">
              <span>{product.stock} available</span>
              <span className="font-medium">Total: ₹{totalPrice}</span>
            </div>
          </div>

          {/* Stock Warning */}
          {product.stock < 10 && product.stock > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
              <p className="text-sm text-orange-800">⚠️ Only {product.stock} items left in stock!</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent" disabled={isAdding}>
              Cancel
            </Button>
            <Button onClick={handleAddToCart} disabled={isAdding || product.stock === 0} className="flex-1">
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isAdding ? "Adding..." : `Add ${quantity} to Cart`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
