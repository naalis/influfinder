export default function HomePage() {
  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <header className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-gradient-primary">
            Discover Offers
          </h1>
          <p className="text-gray-400">
            Find the perfect collaborations for you
          </p>
        </header>

        {/* Coming Soon Placeholder */}
        <div className="flex min-h-[60vh] items-center justify-center rounded-2xl border border-gray-800 bg-gradient-to-br from-brand-purple/10 to-brand-cyan/10 p-8">
          <div className="text-center">
            <div className="mb-4 text-6xl">🎯</div>
            <h2 className="mb-2 text-2xl font-bold">Home Feed</h2>
            <p className="text-gray-400">
              Your personalized offer feed coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
