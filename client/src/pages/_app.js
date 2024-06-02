import "./global.css"
import { AuthProvider } from "@/context/authContext";

export default function App({ Component, pageProps }) {
  return <>
  <AuthProvider>
  <Component {...pageProps} />
  </AuthProvider>
  </>
}
