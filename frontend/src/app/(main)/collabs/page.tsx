export default function CollabsPage() {
  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <header className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-gradient-primary">
            My Collabs
          </h1>
          <p className="text-gray-400">Track your collaborations</p>
        </header>

        {/* Coming Soon Placeholder */}
        <div className="flex min-h-[60vh] items-center justify-center rounded-2xl border border-gray-800 bg-gradient-to-br from-brand-magenta/10 to-brand-purple/10 p-8">
          <div className="text-center">
            <div className="mb-4 text-6xl">❤️</div>
            <h2 className="mb-2 text-2xl font-bold">My Collabs</h2>
            <p className="text-gray-400">
              View your active and pending collaborations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
