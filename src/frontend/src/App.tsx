import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useNavigate,
} from "@tanstack/react-router";
import { LogIn, LogOut, Shield, Trophy, User, UserCog } from "lucide-react";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useIsAdmin, useIsAdminPembantu } from "./hooks/useQueries";
import DetailPage from "./pages/DetailPage";
import FormPage from "./pages/FormPage";
import HomePage from "./pages/HomePage";
import RankingPage from "./pages/RankingPage";

function AppHeader() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const { data: isAdminPembantu } = useIsAdminPembantu();
  const navigate = useNavigate();
  const isLoggedIn = !!identity;

  return (
    <header className="scout-header-bg shadow-lg">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          className="flex items-center gap-3 cursor-pointer bg-transparent border-0"
          onClick={() => navigate({ to: "/" })}
          onKeyDown={(e) => e.key === "Enter" && navigate({ to: "/" })}
        >
          <img
            src="/assets/generated/pramuka-logo-transparent.dim_200x200.png"
            alt="Pramuka Logo"
            className="h-12 w-12 object-contain"
          />
          <div>
            <div className="text-xs font-body font-semibold gold-accent tracking-widest uppercase">
              Kwarcab Subang
            </div>
            <div className="text-white font-display font-bold text-sm md:text-base leading-tight">
              Penilaian Kwartir Ranting Tergiat
            </div>
          </div>
        </button>
        <div className="flex items-center gap-2">
          {/* Ranking nav link */}
          <button
            type="button"
            onClick={() => navigate({ to: "/ranking" })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-semibold text-white/90 hover:bg-white/10 transition-colors border border-white/20"
            data-ocid="nav.link"
          >
            <Trophy className="h-3.5 w-3.5 gold-accent" />
            Papan Peringkat
          </button>

          {isLoggedIn && identity && (
            <div className="hidden md:flex items-center gap-2 text-xs text-white/80 font-body">
              {isAdmin && (
                <span className="flex items-center gap-1 bg-gold/20 text-gold px-2 py-1 rounded-full">
                  <Shield className="h-3 w-3" />
                  Admin
                </span>
              )}
              {!isAdmin && isAdminPembantu && (
                <span className="flex items-center gap-1 bg-amber-400/20 text-amber-300 px-2 py-1 rounded-full">
                  <UserCog className="h-3 w-3" />
                  Admin Pembantu
                </span>
              )}
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {identity.getPrincipal().toString().slice(0, 12)}...
              </span>
            </div>
          )}
          {isLoggedIn ? (
            <Button
              variant="outline"
              size="sm"
              onClick={clear}
              className="bg-transparent border-white/30 text-white hover:bg-white/10 font-body text-xs"
              data-ocid="nav.button"
            >
              <LogOut className="h-3 w-3 mr-1" />
              Keluar
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={login}
              disabled={loginStatus === "logging-in"}
              className="bg-gold text-foreground hover:bg-gold-dark font-body text-xs font-semibold"
              data-ocid="nav.primary_button"
            >
              <LogIn className="h-3 w-3 mr-1" />
              {loginStatus === "logging-in" ? "Masuk..." : "Masuk"}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

function AppFooter() {
  return (
    <footer className="mt-12 py-6 border-t border-border bg-muted/40">
      <div className="max-w-5xl mx-auto px-4 text-center text-sm text-muted-foreground font-body">
        <p>
          &copy; {new Date().getFullYear()} Kwarcab Subang. Dibangun dengan{" "}
          <span aria-label="cinta">❤️</span> menggunakan{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  );
}

const rootRoute = createRootRoute({ component: Layout });
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const formRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/form",
  validateSearch: (search: Record<string, unknown>) => ({
    targetOwner:
      typeof search.targetOwner === "string" ? search.targetOwner : undefined,
  }),
  component: FormPage,
});
const detailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/detail/$ownerId",
  component: DetailPage,
});
const rankingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ranking",
  component: RankingPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  formRoute,
  detailRoute,
  rankingRoute,
]);
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors />
    </>
  );
}
