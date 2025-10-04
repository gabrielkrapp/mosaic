'use client';

export default function Header() {
  return (
    <header className="bg-black border-b border-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-1">
            Mosaic
          </h1>
          <p className="text-sm text-gray-500">
            Premium advertising spots • From 0.05 WLD/day
          </p>
        </div>
      </div>
    </header>
  );
}
