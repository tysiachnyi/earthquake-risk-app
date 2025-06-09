interface LocationInputProps {
  onSubmit: (e?: React.FormEvent, useGeolocation?: boolean) => Promise<void>;
  isLoading: boolean;
  error: string;
  filters: {
    radius: number;
    minMagnitude: number;
    timeRange: string;
  };
  setFilters: (filters: any) => void;
  location: string;
  setLocation: (location: string) => void;
}

export default function LocationInput({
  onSubmit,
  isLoading,
  error,
  filters,
  setFilters,
  location,
  setLocation,
}: LocationInputProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Earthquake Risk Analysis
        </h2>
        <p className="text-gray-600">
          Enter a location to analyze historical earthquake data and assess
          seismic risk
        </p>
      </div>

      <form onSubmit={(e) => onSubmit(e, false)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter City, Country or Coordinates
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Istanbul, Turkey or 41.0082,28.9784"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-800 placeholder-gray-400 bg-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Radius
              </label>
              <select
                value={filters.radius}
                onChange={(e) =>
                  setFilters((prev: any) => ({
                    ...prev,
                    radius: Number(e.target.value),
                  }))
                }
                className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-800 bg-white"
              >
                <option value={50}>50 km</option>
                <option value={100}>100 km</option>
                <option value={200}>200 km</option>
                <option value={500}>500 km</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Mag
              </label>
              <select
                value={filters.minMagnitude}
                onChange={(e) =>
                  setFilters((prev: any) => ({
                    ...prev,
                    minMagnitude: Number(e.target.value),
                  }))
                }
                className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-800 bg-white"
              >
                <option value={2.0}>2.0+</option>
                <option value={2.5}>2.5+</option>
                <option value={3.0}>3.0+</option>
                <option value={4.0}>4.0+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Period
              </label>
              <select
                value={filters.timeRange}
                onChange={(e) =>
                  setFilters((prev: any) => ({
                    ...prev,
                    timeRange: e.target.value,
                  }))
                }
                className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-800 bg-white"
              >
                <option value="1month">1 Month</option>
                <option value="6months">6 Months</option>
                <option value="1year">1 Year</option>
                <option value="5years">5 Years</option>
                <option value="10years">10 Years</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {isLoading ? <>Analyzing...</> : <>Analyze Location</>}
          </button>

          <button
            type="button"
            onClick={() => onSubmit(undefined, true)}
            disabled={isLoading}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Use My Location
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
          <div className="flex">
            <svg
              className="w-5 h-5 text-red-400 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
