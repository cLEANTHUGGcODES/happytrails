import Script from "next/script";

const measurementId = "G-D3WXJME0K1";

export function GoogleAnalytics() {
  if (
    process.env.NODE_ENV !== "production" ||
    (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production")
  ) {
    return null;
  }

  return (
    <>
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
    </>
  );
}
