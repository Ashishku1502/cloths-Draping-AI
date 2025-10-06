import Link from 'next/link';
import { Instagram, Mail } from 'lucide-react';
import { SareeIcon, WhatsAppIcon } from './icons';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex">
          <Link href="/" className="mr-6 flex items-center space-x-3">
            <SareeIcon className="h-8 w-8 text-primary" />
            <span className="font-bold text-2xl font-headline sm:inline-block">
              Ashish Kumar
            </span>
          </Link>
        </div>
        <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" asChild>
                <Link href="https://www.instagram.com" target="_blank" aria-label="Instagram">
                    <Instagram className="h-5 w-5" />
                </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
                <Link href="https://wa.me/your-number" target="_blank" aria-label="WhatsApp">
                    <WhatsAppIcon className="h-6 w-6" />
                </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
                <Link href="mailto:your-email@example.com" aria-label="Email">
                    <Mail className="h-5 w-5" />
                </Link>
            </Button>
        </div>
      </div>
    </header>
  );
}
