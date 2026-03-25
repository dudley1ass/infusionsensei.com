// Type declaration for Google Analytics gtag
interface Window {
  gtag: (
    command: 'event' | 'config' | 'js' | 'set',
    targetId: string,
    params?: Record<string, any>
  ) => void;
  dataLayer: any[];
}
