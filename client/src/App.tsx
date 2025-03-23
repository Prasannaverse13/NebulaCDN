import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Upload from "@/pages/upload";
import Dashboard from "@/pages/dashboard";
import Content from "@/pages/content";
import Tokens from "@/pages/tokens";
import Settings from "@/pages/settings";
import Layout from "@/components/Layout";
import { WalletProvider } from "./lib/wallets.tsx";
import { queryClient } from "./lib/queryClient";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/upload" component={Upload} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/content" component={Content} />
      <Route path="/tokens" component={Tokens} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <Layout>
          <Router />
        </Layout>
        <Toaster />
      </WalletProvider>
    </QueryClientProvider>
  );
}

export default App;
