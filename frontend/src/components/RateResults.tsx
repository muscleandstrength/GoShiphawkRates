import { Rate } from '../types'

interface RateResultsProps {
  rates: Rate[];
  loading: boolean;
}

export function RateResults({ rates, loading }: RateResultsProps) {
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Not available'

    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return dateString
    }

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  // Sort rates by price
  const sortedRates = [...rates].sort((a, b) => {
    const priceA = parseFloat(a.price) || 0
    const priceB = parseFloat(b.price) || 0
    return priceA - priceB
  })

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="bg-green-600 text-white p-4 rounded-t-lg">
        <h2 className="text-xl font-semibold">Shipping Rates</h2>
      </div>
      
      <div className="p-6">
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">Getting the best rates for you...</span>
            </div>
          </div>
        )}

        {!loading && rates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Enter shipment details and get quotes to see available rates.
            </p>
          </div>
        )}

        {!loading && rates.length > 0 && (
          <div className="space-y-4">
            {sortedRates.map((rate, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {rate.carrier || 'Unknown Carrier'}
                  </h3>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    {rate.service_name || rate.service_level || 'Standard Service'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Transit Time:</p>
                    <p className="font-medium">
                      {rate.service_days !== undefined ? `${rate.service_days} days` : 'Not available'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Estimated Delivery:</p>
                    <p className="font-medium">
                      {formatDate(rate.est_delivery_date)}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Price:</span>
                  <span className="text-2xl font-bold text-green-600">
                    {rate.price !== undefined && rate.price !== '' ? 
                      `$${(parseFloat(rate.price) || 0).toFixed(2)}` : 'Price unavailable'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}