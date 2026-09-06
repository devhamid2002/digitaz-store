export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 max-w-7xl p-5 px-10 w-full mx-auto">{children}</div>
    </div>
  );
}
