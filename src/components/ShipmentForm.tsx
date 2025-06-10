import { useState } from 'react'
import { AddressForm } from './AddressForm'
import { PackageForm } from './PackageForm'
import { CarrierFilter } from './CarrierFilter'
import { ShipmentRequest, Address, PackageItem, Carrier } from '../types'

interface ShipmentFormProps {
  onSubmit: (request: ShipmentRequest) => void;
  carriers: Carrier[];
  loading: boolean;
}

const defaultOriginAddress: Address = {
  name: 'Marvin Briggman',
  company: 'Muscle & Strength',
  street1: '1180 1st St South Ext.',
  city: 'Columbia',
  state: 'SC',
  zip: '29209',
  country: 'US',
}

export function ShipmentForm({ onSubmit, carriers, loading }: ShipmentFormProps) {
  const [originAddress, setOriginAddress] = useState<Address>(defaultOriginAddress)
  const [destinationAddress, setDestinationAddress] = useState<Address>({
    zip: '',
    country: 'US',
  })
  const [packages, setPackages] = useState<PackageItem[]>([{
    weight: 2,
    weight_uom: 'lbs',
    quantity: 1,
    country_of_origin: 'US',
  }])
  const [carrierFilter, setCarrierFilter] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!destinationAddress.zip) {
      alert('Destination ZIP code is required')
      return
    }

    // Validate packages
    const invalidPackages = packages.some(pkg => !pkg.weight || pkg.weight <= 0)
    if (invalidPackages) {
      alert('Package weight is required and must be greater than 0')
      return
    }

    // Create request
    const request: ShipmentRequest = {
      items: packages,
      warehouse_code: '01',
      carrier_filter: carrierFilter.length > 0 ? carrierFilter : undefined,
    }

    // Add addresses if they have required fields
    if (hasRequiredAddressFields(originAddress)) {
      request.origin_address = cleanEmptyAddressFields(originAddress)
    }

    if (hasRequiredAddressFields(destinationAddress)) {
      request.destination_address = cleanEmptyAddressFields(destinationAddress)
    }

    // For backward compatibility
    if (originAddress.zip) {
      request.origin_zip = originAddress.zip
    }

    if (destinationAddress.zip) {
      request.destination_zip = destinationAddress.zip
    }

    // Always include destination country
    if (destinationAddress.country) {
      request.destination_country_id = destinationAddress.country
    }

    onSubmit(request)
  }

  const hasRequiredAddressFields = (address: Address): boolean => {
    return Boolean(
      address.zip &&
      (address.name || address.street1 || address.city || address.state)
    )
  }

  const cleanEmptyAddressFields = (address: Address): Address => {
    const cleaned: Partial<Address> = {}
    Object.entries(address).forEach(([key, value]) => {
      if (value) {
        cleaned[key as keyof Address] = value
      }
    })
    // Always preserve country if it exists, even if other fields are missing
    if (address.country) {
      cleaned.country = address.country
    }
    return cleaned as Address
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="bg-blue-600 text-white p-4 rounded-t-lg">
        <h2 className="text-xl font-semibold">Shipment Details</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <AddressForm
          title="Origin Address (Columbia, SC)"
          address={originAddress}
          onChange={setOriginAddress}
          isCollapsible={true}
          defaultCollapsed={true}
        />

        <AddressForm
          title="Destination Address"
          address={destinationAddress}
          onChange={setDestinationAddress}
          isCollapsible={true}
          defaultCollapsed={true}
          showZipFirst={true}
        />

        <PackageForm
          packages={packages}
          onChange={setPackages}
        />

        <CarrierFilter
          carriers={carriers}
          selectedCarriers={carrierFilter}
          onChange={setCarrierFilter}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? 'Getting Quotes...' : 'Get Shipping Quotes'}
        </button>
      </form>
    </div>
  )
}