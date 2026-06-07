import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/" className="font-bold text-gray-900">✍️ The Blog</Link>
        <p className="text-sm text-gray-400">
          Built by{' '}
          <a href="https://muhammad-faizan-portfolio.vercel.app"
            target="_blank" rel="noreferrer"
            className="text-gray-600 hover:underline">
            Muhammad Faizan
          </a>
        </p>
      </div>
    </footer>
  );
}
