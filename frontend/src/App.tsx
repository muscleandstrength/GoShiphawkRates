import { useState, useEffect } from 'react'
import { ShipmentForm } from './components/ShipmentForm'
import { RateResults } from './components/RateResults'
import { ShipmentRequest, Rate, Carrier, ShipHawkError, ShipHawkDebug, QuoteResponse } from './types'

function App() {
  const [rates, setRates] = useState<Rate[]>([])
  const [errors, setErrors] = useState<ShipHawkError[]>([])
  const [warnings, setWarnings] = useState<ShipHawkError[]>([])
  const [debug, setDebug] = useState<ShipHawkDebug | undefined>(undefined)
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
    setErrors([])
    setWarnings([])
    setDebug(undefined)

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`Quote request failed with status ${response.status}`)
      }

      const data: QuoteResponse = await response.json()
      setRates(data.rates || [])
      setErrors(data.errors || [])
      setWarnings(data.warnings || [])
      setDebug(data.debug)
    } catch (error) {
      console.error('Error:', error)
      setErrors([{ message: error instanceof Error ? error.message : 'Failed to get shipping rates.' }])
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
              errors={errors}
              warnings={warnings}
              debug={debug}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App