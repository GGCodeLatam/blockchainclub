import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';

export const domain = "example.org";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      authConfig={{
        authUrl: "/api/auth",
        domain: process.env.VERCEL_URL || domain,
        loginRedirect: "/",
      }}
      desiredChainId={ChainId.Goerli}>
      <Component {...pageProps} />
    </ThirdwebProvider>
  )
}

export default MyApp
