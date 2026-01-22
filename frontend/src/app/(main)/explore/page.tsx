export default function ExplorePage() {
  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <header className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-gradient-primary">
            Explore
          </h1>
          <p className="text-gray-400">Discover new opportunities</p>
        </header>

        {/* Coming Soon Placeholder */}
        <div className="flex min-h-[60vh] items-center justify-center rounded-2xl border border-gray-800 bg-gradient-to-br from-brand-blue/10 to-brand-magenta/10 p-8">
          <div className="text-center">
            <div className="mb-4 text-6xl">🔍</div>
            <h2 className="mb-2 text-2xl font-bold">Explore</h2>
            <p className="text-gray-400">
              Search and filter opportunities coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
