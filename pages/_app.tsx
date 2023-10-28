import "@/styles/globals.css";
import { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/router";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [isSSR, setIsSSR] = useState(true);
  

  useEffect(() => {
    setIsSSR(false);
  }, []);

  if (isSSR) return null;

  return (
    <GoogleOAuthProvider
      clientId={`${process.env.NEXT_PUBLIC_GOOGLE_API_TOKEN}`}
    >
      <Navbar />
      <div className="flex gap-6 md:gap-20">
        <div className="min-h-[92vh]">
          <Sidebar />
        </div>
        <div className="w-full">
          <Component {...pageProps} />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};
export default MyApp;
