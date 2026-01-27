import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <div className="flex-grow flex items-center justify-center">
        <div className="text-center space-y-6 px-4">
          <div className="space-y-2">
            <h1 className="text-6xl lg:text-7xl font-bold text-primary">404</h1>
            <p className="text-2xl font-semibold text-foreground">Page Not Found</p>
          </div>
          <p className="text-lg text-foreground/70 max-w-md mx-auto">
            The page you're looking for doesn't exist. Let's get you back on track.
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 rounded-lg">
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;
