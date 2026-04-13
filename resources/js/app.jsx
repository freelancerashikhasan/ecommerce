import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../js/assets/css/style.css';
import '@fontsource/inter';
import '@fontsource/barlow';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { CartProvider } from './contexts/CartContext';
import CartModal from './components/CartModal';
import { AuthProvider } from './contexts/AuthContext';

// If you have other providers, import them here
// import { LanguageProvider } from './contexts/LanguageContext';
// import { LoadingProvider } from './contexts/LoadingContext';

createInertiaApp({
  resolve: (name) =>
    resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
  setup({ el, App, props }) {
    createRoot(el).render(
      <React.StrictMode>
        {/* Order of providers matters - wrap from most general to most specific */}
        {/* <LanguageProvider> */}
        {/*   <LoadingProvider> */}
        <AuthProvider initialUser={props.initialPage.props.auth?.user || null}>
            <CartProvider>
              <App {...props} />
              <CartModal />
            </CartProvider>
          </AuthProvider>
        {/*   </LoadingProvider> */}
        {/* </LanguageProvider> */}
      </React.StrictMode>
    )
  },
})