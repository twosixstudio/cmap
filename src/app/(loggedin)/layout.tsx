import { Navigation } from "./_components/navigation/navigation";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-[100dvh] bg-slate-100">
      <Navigation />
      {children}
    </div>
  );
}
