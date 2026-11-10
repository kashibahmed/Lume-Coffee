import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader";
import Hero from "@/components/Hero";
import BrandIntro from "@/components/BrandIntro";
import SignatureMenu from "@/components/SignatureMenu";
import BrandExperience from "@/components/BrandExperience";
import Philosophy from "@/components/Philosophy";
import CustomerReviews from "@/components/CustomerReviews";
import CafeMoment from "@/components/CafeMoment";
import SpecialMoment from "@/components/SpecialMoment";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/context/CartContext";

export default function Home() {
  return (
    <CartProvider>
      <Preloader />
      <main className="min-h-screen bg-brand-cream text-brand-espresso flex flex-col selection:bg-brand-olive-dark selection:text-brand-cream">
        <Navbar />
        <Hero />
        <BrandIntro />
        <SignatureMenu />
        <BrandExperience />
        <Philosophy />
        <CustomerReviews />
        <CafeMoment />
        <SpecialMoment />
        <FinalCTA />
        <Footer />
        <CartDrawer />
      </main>
    </CartProvider>
  );
}

