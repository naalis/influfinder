import { ReactNode } from "react";
import BottomNav from "./BottomNav";

interface MobileLayoutProps {
  children: ReactNode;
  showBottomNav?: boolean;
}

export default function MobileLayout({
  children,
  showBottomNav = true,
}: MobileLayoutProps) {
  return (
    <div
      className="flex min-h-screen flex-col bg-black text-white"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
      }}
    >
      {/* Main Content Area */}
      <main
        className={`flex-1 overflow-y-auto ${
          showBottomNav ? "pb-20" : ""
        }`}
      >
        {children}
      </main>

      {/* Bottom Navigation */}
      {showBottomNav && <BottomNav />}
    </div>
  );
}
