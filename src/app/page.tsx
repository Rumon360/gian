import GianLogo3d from "@/components/animations/purple-sphere";
import FAQ from "@/components/sections/faq";
import Hero from "@/components/sections/hero";
import HowItWorks from "@/components/sections/how-it-works";
import Pricing from "@/components/sections/pricing";

export default function Home() {
  return (
    <div className="relative">
      <Hero />
      <div className="w-full h-full">
        <GianLogo3d />
      </div>
      <HowItWorks />
      <Pricing />
      <FAQ />
    </div>
  );
}
