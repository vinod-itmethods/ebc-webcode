import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RequestPartnerAccess() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <section className="flex-grow py-20">
        <div className="container max-w-2xl mx-auto px-4">
          <h1 className="text-4xl font-bold">Become a Technology Partner</h1>
          <p className="text-lg text-gray-700 mt-4">
            Join the Executive Briefing Council and connect with enterprise leaders seeking your expertise.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
