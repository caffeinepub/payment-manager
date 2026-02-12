import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { LocalDataProvider } from './lib/storage/LocalDataProvider';
import { AppShell } from './components/layout/AppShell';
import { TransactionsPage } from './pages/TransactionsPage';
import { TransactionDetailPage } from './pages/TransactionDetailPage';
import { PeoplePage } from './pages/PeoplePage';
import { VendorsPage } from './pages/VendorsPage';
import { BalancesPage } from './pages/BalancesPage';
import { Toaster } from 'sonner';
import { ThemeProvider } from 'next-themes';

function Layout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: TransactionsPage,
});

const transactionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/transactions',
  component: TransactionsPage,
});

const transactionDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/transactions/$transactionId',
  component: TransactionDetailPage,
});

const peopleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/people',
  component: PeoplePage,
});

const vendorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/vendors',
  component: VendorsPage,
});

const balancesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/balances',
  component: BalancesPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  transactionsRoute,
  transactionDetailRoute,
  peopleRoute,
  vendorsRoute,
  balancesRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LocalDataProvider>
        <RouterProvider router={router} />
        <Toaster />
      </LocalDataProvider>
    </ThemeProvider>
  );
}
