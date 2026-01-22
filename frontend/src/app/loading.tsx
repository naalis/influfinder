import Isotipo from "@/components/brand/Isotipo";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black">
      <div className="animate-pulse">
        <Isotipo size={64} variant="gradient" />
      </div>
      <p className="mt-4 animate-pulse text-sm font-medium text-gray-400">
        Loading...
      </p>
    </div>
  );
}
