import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import WalletModal from "./WalletModal";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col text-slate-200">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <WalletModal />
    </div>
  );
}
