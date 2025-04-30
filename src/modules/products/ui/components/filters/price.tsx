import { ChangeEvent } from 'react'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

interface Props {
  minPrice?: string | null
  maxPrice?: string | null
  onMinPriceChange: (value: string) => void
  onMaxPriceChange: (value: string) => void
}

// Función que formatea un string como moneda USD
export const formatAsCurrency = (value: string) => {
  // Elimina todos los caracteres que no sean números o puntos decimales
  const numericValue = value.replace(/[^0-9.]/g, '')

  // Divide el valor en partes usando el punto decimal como separador
  const parts = numericValue.split('.')

  // Reconstruye el valor formateado:
  // - Toma la parte entera (antes del punto)
  // - Si hay parte decimal, toma solo los primeros 2 dígitos después del punto
  const formattedValue = parts[0] + (parts.length > 1 ? '.' + parts[1]?.slice(0, 2) : '')

  // Si el valor formateado está vacío, retorna string vacío
  if (!formattedValue) return ''

  // Convierte el string a número
  const numberValue = parseFloat(formattedValue)

  // Si la conversión falla (no es un número válido), retorna string vacío
  if (isNaN(numberValue)) return ''

  // Formatea el número como moneda USD usando Intl.NumberFormat:
  // - Estilo: moneda
  // - Moneda: USD (dólares americanos)
  // - Mínimo 0 dígitos decimales
  // - Máximo 2 dígitos decimales
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(numberValue)
}

export const PriceFilter = ({ minPrice, maxPrice, onMinPriceChange, onMaxPriceChange }: Props) => {
  const handleMinPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    // get the raw input value and extract only the numeric characters
    const numericValue = e.target.value.replace(/[^0-9.]/g, '')
    onMinPriceChange(numericValue)
  }
  const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    // get the raw input value and extract only the numeric characters
    const numericValue = e.target.value.replace(/[^0-9.]/g, '')
    onMaxPriceChange(numericValue)
  }

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-col gap-2'>
        <Label className='font-medium text-base'>Minimum Price</Label>
        <Input
          type='text'
          placeholder='$0'
          value={minPrice ? formatAsCurrency(minPrice) : ''}
          onChange={handleMinPriceChange}
        />
      </div>
      <div className='flex flex-col gap-2'>
        <Label className='font-medium text-base'>Maximum Price</Label>
        <Input
          type='text'
          placeholder='∞'
          value={maxPrice ? formatAsCurrency(maxPrice) : ''}
          onChange={handleMaxPriceChange}
        />
      </div>
    </div>
  )
}
