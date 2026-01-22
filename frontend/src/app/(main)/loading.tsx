import Isotipo from "@/components/brand/Isotipo";

export default function MainLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <div className="animate-pulse">
        <Isotipo size={48} variant="gradient" />
      </div>
      <p className="mt-4 animate-pulse text-sm font-medium text-gray-400">
        Loading...
      </p>
    </div>
  );
}
