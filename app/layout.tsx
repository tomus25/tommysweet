export const metadata = {
  title: "TommySweet",
  description: "Marketing agency based in New York, Manhattan",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
