export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-foreground/2 py-12">
      <div className="container max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8">
          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Executive Briefing Council</h3>
            <p className="text-sm text-foreground/60 max-w-xs">
              Confidential, curated briefings for enterprise technology leaders navigating complex decisions across AI, DevOps, and modern infrastructure.
            </p>
          </div>

          {/* Program Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Program</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#what" className="text-foreground/60 hover:text-foreground transition-colors">
                  What this is
                </a>
              </li>
              <li>
                <a href="#how" className="text-foreground/60 hover:text-foreground transition-colors">
                  How it works
                </a>
              </li>
              <li>
                <a href="#locations" className="text-foreground/60 hover:text-foreground transition-colors">
                  Locations
                </a>
              </li>
            </ul>
          </div>

          {/* Attribution & Admin */}
          <div className="space-y-2">
            <p className="text-xs text-foreground/50">
              Facilitated by iTmethods
            </p>
            <a href="/admin" className="text-xs text-foreground/50 hover:text-foreground/70 transition-colors inline-block">
              Admin Portal
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border">
          <p className="text-xs text-foreground/50 text-center">
            © {currentYear} Executive Briefing Council. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
