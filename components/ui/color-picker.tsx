"use client"

import * as React from "react"
import { HexColorPicker } from "react-colorful"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function ColorPicker({ value, onChange, placeholder = "#000000" }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-2">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-28"
        placeholder={placeholder}
      />
      <Popover>
        <PopoverTrigger>
          <div
            className="w-8 h-8 rounded-md border shadow-sm cursor-pointer"
            style={{ backgroundColor: value }}
          />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3">
          <HexColorPicker color={value} onChange={onChange} />
        </PopoverContent>
      </Popover>
    </div>
  )
}
