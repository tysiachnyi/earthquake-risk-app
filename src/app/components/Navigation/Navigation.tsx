import Link from "next/link";

export const Navigation = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4">
        <li>
          <Link href="/" className="text-white hover:text-gray-300">
            Home
          </Link>
        </li>
        <li>
          <a href="/about" className="text-white hover:text-gray-300">
            About
          </a>
        </li>
        <li>
          <a href="/contact" className="text-white hover:text-gray-300">
            Contact
          </a>
        </li>
      </ul>
    </nav>
  );
};
