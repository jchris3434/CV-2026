// import { getRequestConfig } from "next-intl/server";

// export default getRequestConfig(async() => {
//     const locale = 'fr';
    
//     const messages = (await import(`../dictionaries/${locale}.json`)).default;

//     return {
//         locale,
//         defaultLocale: 'fr',
//         messages,
//     };
// });

import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';
 
export default getRequestConfig(async ({requestLocale}) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

    const messages = (await import(`../dictionaries/${locale}.json`)).default;
 
  return {
    locale,
    messages
    // ...
  };
});


// import {cookies} from 'next/headers';
// import {getRequestConfig} from 'next-intl/server';
 
// export default getRequestConfig(async () => {
//   const store = await cookies();
//   const locale = store.get('locale')?.value || 'fr';
 
//   return {
//     locale
//     // ...
//   };
// });