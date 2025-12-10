import { AppRouter } from './app/AppRouter';
import { ThemeProvider } from './context/ThemeContext';
import { ConsentBanner } from './components/Analytics/ConsentBanner';
import { LightboxProvider } from './context/LightboxContext';
import { LightboxOverlay } from './components/Media/LightboxOverlay';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { ToastProvider } from './context/ToastContext';
import { ToastContainer } from './components/Toast';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <LightboxProvider>
            <AppRouter />
            <ConsentBanner />
            <LightboxOverlay />
            <ToastContainer />
          </LightboxProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
