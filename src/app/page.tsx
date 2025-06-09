import Link from "next/link";
import { Container, Header, Paragraph } from "./components";

export default function Home() {
  return (
    <Container>
      <main className="flex min-h-screen flex-col items-center">
        <Header text="Welcome to EQ Risk App!" />
        <Paragraph text="Discover your earthquake risk with our easy-to-use application." />
        <Paragraph text="Get insights, tips, and resources to help you stay prepared and make informed decisions about your safety." />
        <div className="flex gap-4 mt-8">
          <Link
            href="/analysis"
            className="inline-flex items-center justify-center px-8 py-3 bg-red-600 text-white font-semibold rounded-xl shadow-md border border-red-700 hover:bg-red-700 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-400"
          >
            <span className="mr-2">Risk Analysis</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </Link>
        </div>
      </main>
    </Container>
  );
}
