import { useState } from 'react'
import { Address } from '../types'
import { COUNTRIES, detectCountryFromPostalCode, getCountryByCode } from '../utils/countries'

interface AddressFormProps {
  title: string;
  address: Address;
  onChange: (address: Address) => void;
  isCollapsible?: boolean;
  defaultCollapsed?: boolean;
  showZipFirst?: boolean;
}

export function AddressForm({ 
  title, 
  address, 
  onChange, 
  isCollapsible = false, 
  defaultCollapsed = false,
  showZipFirst = false 
}: AddressFormProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)

  const handleChange = (field: keyof Address, value: string) => {
    const updatedAddress = { ...address, [field]: value }
    
    // Auto-detect country from postal code
    if (field === 'zip' && value.trim()) {
      const detectedCountry = detectCountryFromPostalCode(value)
      if (detectedCountry) {
        updatedAddress.country = detectedCountry.code
      }
    }
    
    onChange(updatedAddress)
  }

  const currentCountry = getCountryByCode(address.country || 'US')
  const postalCodeLabel = currentCountry?.postalCodeLabel || 'ZIP Code'
  
  const zipSection = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {postalCodeLabel} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={address.zip}
          onChange={(e) => handleChange('zip', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Country
        </label>
        <select
          value={address.country || 'US'}
          onChange={(e) => handleChange('country', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {COUNTRIES.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )

  const fullAddressFields = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={address.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company
          </label>
          <input
            type="text"
            value={address.company || ''}
            onChange={(e) => handleChange('company', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Street Address
          </label>
          <input
            type="text"
            value={address.street1 || ''}
            onChange={(e) => handleChange('street1', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Street Address 2
          </label>
          <input
            type="text"
            value={address.street2 || ''}
            onChange={(e) => handleChange('street2', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            value={address.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <input
            type="text"
            value={address.state || ''}
            onChange={(e) => handleChange('state', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {!showZipFirst && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {postalCodeLabel} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={address.zip}
              onChange={(e) => handleChange('zip', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {!showZipFirst && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <select
              value={address.country || 'US'}
              onChange={(e) => handleChange('country', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {COUNTRIES.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="text"
            value={address.phone_number || ''}
            onChange={(e) => handleChange('phone_number', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  )

  if (!isCollapsible) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {showZipFirst && zipSection}
        {fullAddressFields}
        {!showZipFirst && zipSection}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-lg">
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full px-4 py-3 text-left flex justify-between items-center bg-gray-50 hover:bg-gray-100 rounded-t-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span className="font-medium text-gray-900">{title}</span>
          <svg
            className={`w-5 h-5 transform transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {showZipFirst && !isCollapsed && (
          <div className="px-4 py-4 border-t border-gray-200">
            {zipSection}
          </div>
        )}
        
        {!isCollapsed && (
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="space-y-4">
              {showZipFirst ? (
                <>
                  <h4 className="font-medium text-gray-900">Additional Destination Details (Optional)</h4>
                  {fullAddressFields}
                </>
              ) : (
                fullAddressFields
              )}
            </div>
          </div>
        )}
      </div>
      
      {showZipFirst && isCollapsed && (
        <div className="space-y-4">
          {zipSection}
        </div>
      )}
    </div>
  )
}