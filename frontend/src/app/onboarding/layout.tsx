import MobileLayout from "@/components/layout/MobileLayout";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MobileLayout showBottomNav={false}>{children}</MobileLayout>;
}
