import { Navbar } from "@/components/guest/Navbar";
import { Footer } from "@/components/guest/Footer";
import { AuthDialog } from "@/components/auth/AuthDialog";

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
      <AuthDialog />
    </>
  );
}
