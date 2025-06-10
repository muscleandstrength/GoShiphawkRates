import { useState } from 'react'
import { PackageItem } from '../types'

interface PackageFormProps {
  packages: PackageItem[];
  onChange: (packages: PackageItem[]) => void;
}

export function PackageForm({ packages, onChange }: PackageFormProps) {
  const [expandedPackages, setExpandedPackages] = useState<Set<number>>(new Set())
  const addPackage = () => {
    onChange([
      ...packages,
      {
        weight: 2,
        weight_uom: 'lbs',
        quantity: 1,
        country_of_origin: 'US',
      }
    ])
  }

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedPackages)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedPackages(newExpanded)
  }

  const removePackage = (index: number) => {
    if (packages.length > 1) {
      onChange(packages.filter((_, i) => i !== index))
    }
  }

  const updatePackage = (index: number, field: keyof PackageItem, value: string | number) => {
    const updated = packages.map((pkg, i) => 
      i === index ? { ...pkg, [field]: value } : pkg
    )
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Packages</h3>
      
      <div className="space-y-4">
        {packages.map((pkg, index) => {
          const isExpanded = expandedPackages.has(index)
          return (
            <div key={index} className="bg-gray-50 p-4 rounded-lg relative">
              {packages.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePackage(index)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1"
                  aria-label="Remove package"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              
              {/* Essential Fields - Always Visible */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (lbs) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.01"
                    value={pkg.weight || ''}
                    onChange={(e) => updatePackage(index, 'weight', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={pkg.quantity}
                    onChange={(e) => updatePackage(index, 'quantity', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Optional Fields Toggle */}
              <button
                type="button"
                onClick={() => toggleExpanded(index)}
                className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 mb-4"
              >
                <svg
                  className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span>{isExpanded ? 'Hide' : 'Show'} optional details</span>
              </button>

              {/* Optional Fields - Collapsible */}
              {isExpanded && (
                <div className="space-y-4 border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        HS Code
                      </label>
                      <input
                        type="text"
                        value={pkg.hs_code || ''}
                        onChange={(e) => updatePackage(index, 'hs_code', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={pkg.description || ''}
                        onChange={(e) => updatePackage(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Value ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={pkg.value || ''}
                        onChange={(e) => updatePackage(index, 'value', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dimensions (Optional)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Length (in)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={pkg.length || ''}
                          onChange={(e) => updatePackage(index, 'length', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Width (in)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={pkg.width || ''}
                          onChange={(e) => updatePackage(index, 'width', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Height (in)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={pkg.height || ''}
                          onChange={(e) => updatePackage(index, 'height', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <button
        type="button"
        onClick={addPackage}
        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>Add Another Package</span>
      </button>
    </div>
  )
}