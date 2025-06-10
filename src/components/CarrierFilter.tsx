import { Carrier } from '../types'

interface CarrierFilterProps {
  carriers: Carrier[];
  selectedCarriers: string[];
  onChange: (selectedCarriers: string[]) => void;
}

export function CarrierFilter({ carriers, selectedCarriers, onChange }: CarrierFilterProps) {
  const handleCarrierChange = (carrierCode: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedCarriers, carrierCode])
    } else {
      onChange(selectedCarriers.filter(code => code !== carrierCode))
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Carrier Filter (Optional)
      </label>
      
      <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md">
        {carriers.length === 0 ? (
          <div className="p-3 text-gray-500 text-sm">
            Loading carriers...
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {carriers.map((carrier) => (
              <label
                key={carrier.code}
                className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCarriers.includes(carrier.code)}
                  onChange={(e) => handleCarrierChange(carrier.code, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{carrier.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      
      <p className="text-xs text-gray-500">
        Select one or more carriers to filter rates. Leave empty to get rates from all available carriers.
      </p>
    </div>
  )
}