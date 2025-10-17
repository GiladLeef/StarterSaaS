import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {new Date().getFullYear()} Platform. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
            Terms
          </Link>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
            Privacy
          </Link>
          <a 
            href="https://github.com/giladleef/startersaas" 
            target="_blank" 
            rel="noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
} 