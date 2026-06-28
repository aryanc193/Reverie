import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Instrument_Serif } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <main className={instrumentSerif.className}>
        <Component {...pageProps} />
      </main>
    </AuthProvider>
  );
}
