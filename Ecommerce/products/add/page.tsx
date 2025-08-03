"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Upload, X, Plus } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export default function AddProductPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    stock: "",
    images: [] as string[],
    tags: [] as string[],
    specifications: {} as Record<string, string>,
    featured: false,
  })

  const [newTag, setNewTag] = useState("")
  const [newSpecKey, setNewSpecKey] = useState("")
  const [newSpecValue, setNewSpecValue] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = [
    { id: "cat-1", name: "Electronics" },
    { id: "cat-2", name: "Clothing" },
    { id: "cat-3", name: "Wearables" },
    { id: "cat-4", name: "Photography" },
    { id: "cat-5", name: "Gaming" },
    { id: "cat-6", name: "Home & Garden" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const productData = {
        seller_id: user?.id || "seller-1", // Use actual user ID
        category_id: formData.category,
        name: formData.name,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        original_price: formData.originalPrice ? Number.parseFloat(formData.originalPrice) : null,
        stock: Number.parseInt(formData.stock),
        images: formData.images,
        tags: formData.tags,
        specifications: formData.specifications,
        featured: formData.featured,
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Product data:", productData)

      alert("Product added successfully!")
      router.push("/seller/dashboard")
    } catch (error) {
      console.error("Error adding product:", error)
      alert("Error adding product. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const addSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setFormData((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [newSpecKey.trim()]: newSpecValue.trim(),
        },
      }))
      setNewSpecKey("")
      setNewSpecValue("")
    }
  }

  const removeSpecification = (keyToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      specifications: Object.fromEntries(Object.entries(prev.specifications).filter(([key]) => key !== keyToRemove)),
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/seller/dashboard" className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Trendify</span>
              <Badge variant="secondary" className="ml-2">
                Seller
              </Badge>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Add New Product</h1>
            <p className="text-gray-600">Create a new product listing for your store</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>Fill in the details for your new product</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter product name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your product..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">Original Price</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData((prev) => ({ ...prev, originalPrice: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity *</Label>
                    <Input
                      id="stock"
                      type="number"
                      placeholder="0"
                      value={formData.stock}
                      onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                {/* Images */}
                <div className="space-y-2">
                  <Label>Product Images</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Upload product images</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 10MB each</p>
                    <Button type="button" variant="outline" className="mt-4 bg-transparent">
                      Choose Files
                    </Button>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Add a tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} variant="outline" className="bg-transparent">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Specifications */}
                <div className="space-y-2">
                  <Label>Specifications</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                    <Input
                      placeholder="Specification name"
                      value={newSpecKey}
                      onChange={(e) => setNewSpecKey(e.target.value)}
                    />
                    <Input
                      placeholder="Specification value"
                      value={newSpecValue}
                      onChange={(e) => setNewSpecValue(e.target.value)}
                    />
                    <Button type="button" onClick={addSpecification} variant="outline" className="bg-transparent">
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(formData.specifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span>
                          <strong>{key}:</strong> {value}
                        </span>
                        <X className="h-4 w-4 cursor-pointer text-red-500" onClick={() => removeSpecification(key)} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Featured */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, featured: checked as boolean }))}
                  />
                  <Label htmlFor="featured">Mark as featured product</Label>
                </div>

                {/* Submit */}
                <div className="flex gap-4 pt-6">
                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? "Adding Product..." : "Add Product"}
                  </Button>
                  <Link href="/seller/dashboard">
                    <Button type="button" variant="outline" className="bg-transparent">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
