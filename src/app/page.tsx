import Hero from "@/components/Hero";
import Services from "@/components/Services";
import LoanCalculator from "@/components/LoanCalculator";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Services />
      <LoanCalculator />
      <Contact />
      <Footer />
    </main>
  );
}
