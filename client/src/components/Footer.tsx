import { ExternalLink } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <a
              href="https://earthdata.nasa.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
              data-testid="link-nasa"
            >
              NASA Earth Data
              <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://sentinel.esa.int"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
              data-testid="link-esa"
            >
              ESA Sentinel
              <ExternalLink className="h-3 w-3" />
            </a>
            <a href="#" className="hover:text-foreground transition-colors" data-testid="link-about">
              About
            </a>
            <a href="#" className="hover:text-foreground transition-colors" data-testid="link-legal">
              Legal
            </a>
          </div>

          <div className="text-sm text-muted-foreground text-center md:text-right">
            <p className="mb-1">Trusted by environmental monitors across Ghana</p>
            <p data-testid="text-copyright">© {currentYear} MineSentry - Guarding Earth's Ecosystems</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
