import { useState, useEffect } from 'react'
import { ShipmentForm } from './components/ShipmentForm'
import { RateResults } from './components/RateResults'
import { ShipmentRequest, Rate, Carrier } from './types'

function App() {
  const [rates, setRates] = useState<Rate[]>([])
  const [loading, setLoading] = useState(false)
  const [carriers, setCarriers] = useState<Carrier[]>([])

  useEffect(() => {
    // Fetch carriers on component mount
    fetch('/api/carriers')
      .then(response => response.json())
      .then((data: Carrier[]) => setCarriers(data))
      .catch(error => console.error('Error fetching carriers:', error))
  }, [])

  const handleQuoteRequest = async (request: ShipmentRequest) => {
    setLoading(true)
    setRates([])

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error('Failed to get rates')
      }

      const data = await response.json()
      setRates(data.rates || [])
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to get shipping rates. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          ShipHawk Rate Quoting
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <ShipmentForm 
              onSubmit={handleQuoteRequest}
              carriers={carriers}
              loading={loading}
            />
          </div>
          
          <div>
            <RateResults 
              rates={rates}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App