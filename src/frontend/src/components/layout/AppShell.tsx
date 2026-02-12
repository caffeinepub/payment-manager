import { ReactNode } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { Receipt, Users, Building2, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SiCaffeine } from 'react-icons/si';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const navItems = [
    { path: '/transactions', label: 'Transactions', icon: Receipt },
    { path: '/people', label: 'People', icon: Users },
    { path: '/vendors', label: 'Vendors', icon: Building2 },
    { path: '/balances', label: 'Balances', icon: DollarSign },
  ];

  const isActive = (path: string) => {
    if (path === '/transactions') {
      return currentPath === '/' || currentPath.startsWith('/transactions');
    }
    return currentPath.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">SplitPay</h1>
          </div>
          <nav className="flex gap-1">
            {navItems.map(item => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? 'default' : 'ghost'}
                  size="sm"
                  className="gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 container py-6">
        {children}
      </main>

      <footer className="border-t py-6 mt-auto">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SplitPay. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <SiCaffeine className="h-4 w-4 text-primary" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
