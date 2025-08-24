export const metadata = {
  title: "Dealership BG Studio",
  description: "Car photo background remover & studioizer"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: "#0b0b0b", color: "#eaeaea", margin: 0 }}>
        {children}
      </body>
    </html>
  );
}