We should have continued discussing before you made changes.

Let's try again but first clarify these questions.

Just so you know, I have successfully implemented i18n on another nextjs app router project so I have a working model already.

I will go into detail with code examples but please remember at all times the examples are from a separate project so have different locales etc.

Examples from COMPLETELY SEPARATE PROJECT

// package.json

```
{
  "name": "ewalletbooster-2024",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@emotion/react": "^11.11.4",
    "@formatjs/intl-localematcher": "^0.5.4",
    "@getbrevo/brevo": "^2.1.1",
    "@headlessui/react": "^1.7.18",
    "@heroicons/react": "^2.1.1",
    "@next/third-parties": "^14.2.4",
    "@radix-ui/react-popover": "^1.0.7",
    "@react-email/render": "^0.0.13",
    "@tanstack/react-table": "^8.12.0",
    "@types/negotiator": "^0.6.3",
    "accounting": "^0.4.1",
    "bcryptjs": "^2.4.3",
    "classnames": "^2.5.1",
    "cloudinary-build-url": "^0.2.4",
    "crypto": "^1.0.1",
    "dayjs": "^1.11.10",
    "hamburger-react": "^2.5.0",
    "heroicons": "^2.1.1",
    "highcharts": "^11.4.0",
    "highcharts-react-official": "^3.2.1",
    "html-react-parser": "^5.1.10",
    "i18next": "^23.8.2",
    "i18next-resources-to-backend": "^1.2.0",
    "immer": "^9.0.7",
    "jsonwebtoken": "^9.0.2",
    "lodash.get": "^4.4.2",
    "lodash.isempty": "^4.4.0",
    "lodash.isequal": "^4.5.0",
    "lodash.uniq": "^4.5.0",
    "lucide-react": "^0.331.0",
    "mongoose": "^8.1.3",
    "negotiator": "^0.6.3",
    "next": "14.1.0",
    "next-auth": "^4.24.5",
    "next-i18n-router": "^5.3.1",
    "next-seo": "^6.4.0",
    "next-translate": "^2.6.2",
    "nextjs-toploader": "^1.6.12",
    "nodemailer": "^6.9.13",
    "numeral": "^2.0.6",
    "qs": "^6.12.0",
    "react": "^18",
    "react-anchor-link-smooth-scroll": "^1.0.12",
    "react-awesome-reveal": "^4.2.8",
    "react-copy-to-clipboard": "^5.1.0",
    "react-dom": "^18",
    "react-email": "^2.1.2",
    "react-hook-form": "^7.50.1",
    "react-hot-toast": "^2.4.1",
    "react-i18next": "^14.0.5",
    "react-icons": "^5.0.1",
    "react-intersection-observer": "^9.8.0",
    "react-loading-skeleton": "^3.4.0",
    "react-markdown": "^9.0.1",
    "react-slideshow-image": "^4.3.0",
    "react-spinners": "^0.14.1",
    "react-spring": "^9.7.3",
    "react-toastify": "^10.0.4",
    "remark-gfm": "^4.0.0",
    "sass": "^1.70.0",
    "slugify": "^1.6.6",
    "swr": "^2.2.4",
    "uuid": "^9.0.1",
    "zeptomail": "^6.1.0"
  },
  "devDependencies": {
    "@auth/mongodb-adapter": "^2.4.0",
    "@next/bundle-analyzer": "^14.2.5",
    "@types/accounting": "^0.4.5",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.6",
    "@types/lodash.isempty": "^4.4.9",
    "@types/lodash.isequal": "^4.5.8",
    "@types/lodash.uniq": "^4.5.9",
    "@types/node": "^20",
    "@types/numeral": "^2.0.5",
    "@types/qs": "^6.9.11",
    "@types/react": "^18",
    "@types/react-anchor-link-smooth-scroll": "^1.0.5",
    "@types/react-copy-to-clipboard": "^5.0.7",
    "@types/react-dom": "^18",
    "@types/uuid": "^9.0.8",
    "eslint": "^8",
    "eslint-config-next": "14.1.0",
    "i18nexus-cli": "^3.3.0",
    "mongodb": "^6.3.0",
    "typescript": "^5"
  }
}
```

// middleware.ts

```
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { i18n, isValidLocale } from "@/i18n-config";
import { i18nRouter } from "next-i18n-router";

import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

function getLocale(request: NextRequest): string {
  // Extract the locale from the URL path if present
  const pathname = request.nextUrl.pathname;
  const pathnameParts = pathname.split("/");
  const potentialLocale = pathnameParts[1];

  // Check if the locale in the URL path is valid
  if (isValidLocale(potentialLocale)) {
    console.log(`Locale found in URL pathX: ${potentialLocale}`);
    return potentialLocale;
  }

  // If no valid locale in URL path, use Negotiator to get best locale
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  // Log the values for debugging
  console.log("Languages from Negotiator:", languages);
  console.log("Locales from i18n:", i18n.locales);

  // Handle the '*' wildcard by falling back to the default locale
  if (
    languages.length === 0 ||
    (languages.length === 1 && languages[0] === "*")
  ) {
    languages = [i18n.defaultLocale];
  }

  // Match the best locale from the available ones
  const locales: readonly string[] = [...i18n.locales];
  const matchedLocale = matchLocale(languages, locales, i18n.defaultLocale);
  console.log("Matched Locale:", matchedLocale);

  return matchedLocale;
}
// version provided by https://i18nexus.com/tutorials/nextjs/react-i18next
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const locale = getLocale(request);
  // Create a new URL with the matched locale
  const url = request.nextUrl.clone();
  console.log("pathname in middleware", pathname);
  url.pathname = `/${locale}${pathname}`;

  // Log the new URL for debugging
  //console.log("Rewritten URL:", url.toString());
  if (
    [
      "/manifest.json",
      "/favicon.ico",
      "/illustrations/en/dashboard-illustration.png",
      "/logos/ewalletbooster-logo-light-medium.svg",
      "/logos/astropay-height-40.svg",
      "/logos/ewalletbooster-logo-light-md.svg",
      "/logos/ewalletbooster-logo-light-small.svg",
      "/logos/jeton-height-35.svg",
      "/logos/luxonpay-height-40.svg",
      "/logos/mifinity-height-40.svg",
      "/logos/neteller-height-40.svg",
      "/logos/paysafecard-height-40.svg",
      "/logos/payz-black-height-40.svg",
      "/logos/skrill-height-40.svg",
      "/logos/trustpilot-logo-light.png",
      "/logos/trustpilot-logo.png",
      "/logos/ewalletbooster-logo-dark-medium.svg",
      "/logos/ewalletbooster-logo-icon-dark-medium.svg",
      "/logos/ewalletbooster-logo-light-md.svg",
      "/logos/ewalletbooster-logo-light-medium.svg",
      "/logos/ewalletbooster-logo-light-small.svg",
      "/icons/icon-affiliates.svg",
      "/icons/icon-arrow-fancy-right-down-mobile.svg",
      "/icons/icon-arrow-fancy-right-down.svg",
      "/icons/icon-arrow-fancy-right-up.svg",
      "/icons/icon-check-circle-empty.svg",
      "/icons/icon-check-circle-full-green.svg",
      "/shapes/double-circle-shape.svg",
      "/shapes/linear-line-shape-2.svg",

      // Your other files in `public`
    ].includes(pathname)
  ) {
    return;
  }

  return i18nRouter(request, i18n);
}

// applies this middleware only to files in the app directory
// version provided by https://i18nexus.com/tutorials/nextjs/react-i18next
export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
```

// i18n-config.ts

```
export const i18n = {
  locales: [
    "en", // English - Done content
    "es", // Spanish - Done content
    "de", // German - Done content
    "bn", // Bengali
    "fr", // French
    "hi", // Hindi
    "it", // Italian - Done content
    "ja", // Japanese- Done content
    "ko", // Korean- Done content
    "pl", // Polish
    "pt", // Portuguese - Done content
    "ru", // Russian- Done content
    "id", // Indonesian
    "sv", // Swedish
    "tr", // Turkish
    "vi", // Vietnamese
    "ar", // Arabic
  ],
  defaultLocale: "en",
  prefixDefault: true,
} as const;

export type Locale = (typeof i18n)["locales"][number];

export const isValidLocale = (lang: string): lang is Locale => {
  return i18n.locales.includes(lang as Locale);
};
```

// Root layout.tsx

```
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html lang={params.lang}>
      {/* <LiveChat /> */}
      <body className={poppins.className}>{children}</body>
    </html>
  );
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}
```

// individual page level layout - we can use this <TranslationsProvider in root level layout I think

```
import { initTranslations } from "@/app/i18n";
import { i18n, isValidLocale, type Locale } from "@/i18n-config";
import { TranslationsProvider } from "../../components/localization/TranslationsProvider";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";

export default async function LoginLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  let locale = params.lang;
  if (!isValidLocale(params.lang)) {
    // Fallback to defaultLocale or handle accordingly
    locale = i18n.defaultLocale;
  }
  // Use the validated or default `locale` for initializing translations
  const { t, resources } = await initTranslations(locale, [
    "register-forms",
    "toasts",
    "dashboard",
  ]);

  return (
    <TranslationsProvider
      namespaces={["register-forms", "toasts"]}
      locale={locale} // Using `locale` here for consistency
      resources={resources}
    >
      <Toaster position="bottom-right" />
      <NextTopLoader />
      {children}
    </TranslationsProvider>
  );
}
```
