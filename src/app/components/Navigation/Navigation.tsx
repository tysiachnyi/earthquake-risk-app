import Link from "next/link";

export const Navigation = () => {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="text-lg font-bold">EQ Risk</div>
      <ul className="flex space-x-4">
        <li>
          <Link href="/" className="hover:underline">
            Home
          </Link>
        </li>
        <li>
          <Link href="/analysis" className="hover:underline">
            Analysis
          </Link>
        </li>
        <li>
          <Link href="/about" className="hover:underline">
            About
          </Link>
        </li>
        <li>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
};
