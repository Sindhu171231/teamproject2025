"use client"
import { useState } from "react"
import { MapPin, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const locations = [
  { id: "mumbai", name: "Mumbai", pincode: "400001" },
  { id: "delhi", name: "Delhi", pincode: "110001" },
  { id: "bangalore", name: "Bangalore", pincode: "560001" },
  { id: "hyderabad", name: "Hyderabad", pincode: "500001" },
  { id: "chennai", name: "Chennai", pincode: "600001" },
  { id: "kolkata", name: "Kolkata", pincode: "700001" },
  { id: "pune", name: "Pune", pincode: "411001" },
  { id: "ahmedabad", name: "Ahmedabad", pincode: "380001" },
]

export function LocationSelector() {
  const [selectedLocation, setSelectedLocation] = useState(locations[0])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-xs gap-1">
          <MapPin className="h-3 w-3" />
          Deliver to {selectedLocation.name} {selectedLocation.pincode}
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {locations.map((location) => (
          <DropdownMenuItem
            key={location.id}
            onClick={() => setSelectedLocation(location)}
            className={selectedLocation.id === location.id ? "bg-muted" : ""}
          >
            <MapPin className="h-4 w-4 mr-2" />
            {location.name} - {location.pincode}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
