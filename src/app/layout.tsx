import "./globals.css";
import "flag-icons/css/flag-icons.min.css";
import ThemeProvider from "@/components/providers/ThemeProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}
