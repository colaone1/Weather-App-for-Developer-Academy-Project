import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
  initialState?: Record<string, any>;
  store?: any;
}

function customRender(
  ui: ReactElement,
  {
    route = '/',
    initialState = {},
    store = null,
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  // Here we can add custom providers, context, etc.
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
  };

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render }; 