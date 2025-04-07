import { Navbar } from "@/components/guest/Navbar";
import { Footer } from "@/components/guest/Footer";

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
