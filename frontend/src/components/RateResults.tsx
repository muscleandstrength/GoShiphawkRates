import { Fragment, ReactNode, useState } from 'react'
import { Rate, ShipHawkError, ShipHawkDebug } from '../types'

interface RateResultsProps {
  rates: Rate[];
  errors?: ShipHawkError[];
  warnings?: ShipHawkError[];
  debug?: ShipHawkDebug;
  loading: boolean;
}

const JSON_TOKEN = /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g

function highlightJson(source: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let cursor = 0
  let key = 0
  JSON_TOKEN.lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = JSON_TOKEN.exec(source)) !== null) {
    if (match.index > cursor) nodes.push(source.slice(cursor, match.index))
    const [, str, colon, literal, num] = match
    if (str !== undefined) {
      const isKey = colon !== undefined
      nodes.push(
        <span key={key++} className={isKey ? 'text-sky-400' : 'text-emerald-300'}>
          {str}
        </span>
      )
      if (isKey) nodes.push(<Fragment key={key++}>{colon}</Fragment>)
    } else if (literal !== undefined) {
      const cls = literal === 'null' ? 'text-gray-400' : 'text-purple-300'
      nodes.push(<span key={key++} className={cls}>{literal}</span>)
    } else if (num !== undefined) {
      nodes.push(<span key={key++} className="text-amber-300">{num}</span>)
    }
    cursor = JSON_TOKEN.lastIndex
  }
  if (cursor < source.length) nodes.push(source.slice(cursor))
  return nodes
}

export function RateResults({ rates, errors = [], warnings = [], debug, loading }: RateResultsProps) {
  const [expandedRates, setExpandedRates] = useState<Set<number>>(new Set())
  const [showRequest, setShowRequest] = useState(false)
  const [showResponse, setShowResponse] = useState(false)

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

  const toggleExpanded = (index: number) => {
    const next = new Set(expandedRates)
    next.has(index) ? next.delete(index) : next.add(index)
    setExpandedRates(next)
  }

  const sortedRates = [...rates].sort((a, b) => {
    const priceA = parseFloat(a.price) || 0
    const priceB = parseFloat(b.price) || 0
    return priceA - priceB
  })

  const errorLabel = (e: ShipHawkError) => e.carrier_name || e.carrier_code || 'Error'

  const hasAnyOutput = rates.length > 0 || errors.length > 0 || warnings.length > 0 || !!debug

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="bg-green-600 text-white p-4 rounded-t-lg">
        <h2 className="text-xl font-semibold">Shipping Rates</h2>
      </div>

      <div className="p-6 space-y-4">
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">Getting the best rates for you...</span>
            </div>
          </div>
        )}

        {!loading && !hasAnyOutput && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Enter shipment details and get quotes to see available rates.
            </p>
          </div>
        )}

        {!loading && errors.length > 0 && (
          <div className="border border-red-200 bg-red-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-red-800 mb-2">
              {errors.length === 1 ? 'Rate request error' : `${errors.length} rate request errors`}
            </h3>
            <ul className="space-y-1 text-sm text-red-700">
              {errors.map((e, i) => (
                <li key={i}>
                  <span className="font-medium">{errorLabel(e)}:</span> {e.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        {!loading && warnings.length > 0 && (
          <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-yellow-800 mb-2">
              {warnings.length === 1 ? 'Warning' : `${warnings.length} warnings`}
            </h3>
            <ul className="space-y-1 text-sm text-yellow-800">
              {warnings.map((w, i) => (
                <li key={i}>
                  <span className="font-medium">{errorLabel(w)}:</span> {w.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        {!loading && debug && (
          <div className="border border-gray-200 rounded-lg bg-gray-50 p-3 text-sm">
            <div className="font-medium text-gray-700 mb-2">
              ShipHawk debug {typeof debug.status === 'number' ? `· HTTP ${debug.status}` : ''}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {debug.request !== undefined && (
                <button
                  type="button"
                  onClick={() => setShowRequest((v) => !v)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {showRequest ? 'Hide request' : 'Show request'}
                </button>
              )}
              {debug.response !== undefined && (
                <button
                  type="button"
                  onClick={() => setShowResponse((v) => !v)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {showResponse ? 'Hide response' : 'Show response'}
                </button>
              )}
            </div>
            {showRequest && debug.request !== undefined && (
              <pre className="mt-3 bg-gray-900 text-gray-100 text-xs rounded-md p-3 overflow-x-auto font-mono">
                {highlightJson(JSON.stringify(debug.request, null, 2))}
              </pre>
            )}
            {showResponse && debug.response !== undefined && (
              <pre className="mt-3 bg-gray-900 text-gray-100 text-xs rounded-md p-3 overflow-x-auto font-mono">
                {highlightJson(JSON.stringify(debug.response, null, 2))}
              </pre>
            )}
          </div>
        )}

        {!loading && rates.length > 0 && (
          <div className="space-y-4">
            {sortedRates.map((rate, index) => {
              const expanded = expandedRates.has(index)
              return (
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

                  <button
                    type="button"
                    onClick={() => toggleExpanded(index)}
                    className="mt-3 text-sm text-blue-600 hover:text-blue-700"
                  >
                    {expanded ? 'Hide details' : 'More info'}
                  </button>

                  {expanded && (
                    <pre className="mt-3 bg-gray-900 text-gray-100 text-xs rounded-md p-3 overflow-x-auto font-mono">
                      {highlightJson(JSON.stringify(rate, null, 2))}
                    </pre>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
