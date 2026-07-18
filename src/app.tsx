import { useState } from "react";
import { About } from "@/components/about";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { PreRegistration } from "@/components/pre-registration";
import { AdminModal } from "@/components/admin-modal";

const App = () => {
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden bg-white">
      <Navbar />

      <main>
        <Hero />
        <About />
        <PreRegistration />
      </main>

      <Footer onAdminTrigger={() => setIsAdminOpen(true)} />
      
      {/* Secret admin database modal */}
      <AdminModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </div>
  );
};
export default App;
