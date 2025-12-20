import { AppRouter } from './app/AppRouter';
import { ThemeProvider } from './context/ThemeContext';
import { ConsentBanner } from './components/Analytics/ConsentBanner';
import { LightboxProvider } from './context/LightboxContext';
import { LightboxOverlay } from './components/Media/LightboxOverlay';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { ToastProvider } from './context/ToastContext';
import { ToastContainer } from './components/Toast';
import { PodcastProvider } from './contexts/PodcastContext';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <PodcastProvider>
            <LightboxProvider>
              <AppRouter />
              <ConsentBanner />
              <LightboxOverlay />
              <ToastContainer />
            </LightboxProvider>
          </PodcastProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

