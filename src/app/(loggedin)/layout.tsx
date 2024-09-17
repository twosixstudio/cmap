import { NavBar } from "./_components/nav-bar/nav-bar";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-[100dvh] bg-slate-100">
      <NavBar />
      {children}
    </div>
  );
}
