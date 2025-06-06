import { Header, Paragraph } from "../components";

export default function ContactPage() {
  return (
    <main className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <Header text="Contact Us" />

        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <Paragraph text="Have questions about earthquake risk or need help using our application? We're here to help!" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Get in Touch
              </h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-red-600 mr-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-gray-700">info@eqriskapp.com</span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-red-600 mr-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="text-gray-700">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-red-600 mr-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-gray-700">
                    123 Safety Street, Risk City, RC 12345
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Send us a Message
              </h2>
              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-800 bg-white"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-800 bg-white"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-800 bg-white"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-800 bg-white"
                    placeholder="Your message..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-400 transition-colors duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          <div className="border-t pt-6 mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-800">
                  How accurate is the earthquake risk assessment?
                </h3>
                <p className="text-gray-600 mt-1">
                  Our risk assessments are based on historical earthquake data
                  from the USGS database. While we use sophisticated analysis
                  methods, earthquake prediction is inherently uncertain, and
                  our assessments should be used as general guidance rather than
                  definitive predictions.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  What data sources do you use?
                </h3>
                <p className="text-gray-600 mt-1">
                  We primarily use data from the United States Geological Survey
                  (USGS) earthquake database, which provides comprehensive
                  global earthquake information including magnitude, location,
                  depth, and timing.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  How often is the data updated?
                </h3>
                <p className="text-gray-600 mt-1">
                  Our application fetches real-time data from the USGS database
                  whenever you perform an analysis, ensuring you have access to
                  the most current earthquake information available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
