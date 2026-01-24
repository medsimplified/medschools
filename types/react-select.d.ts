declare module 'react-select' {
  import * as React from 'react';

  export type Theme = Record<string, unknown>;

  export interface SelectProps {
    value?: unknown;
    onChange?: (value: unknown) => void;
    options?: ReadonlyArray<unknown>;
    components?: Record<string, unknown>;
    placeholder?: React.ReactNode;
    classNamePrefix?: string;
    theme?: (theme: Theme) => Theme;
    isSearchable?: boolean;
  }

  const Select: React.ComponentType<SelectProps>;

  export default Select;
}

declare module 'react-select/animated' {
  const makeAnimated: () => Record<string, unknown>;
  export default makeAnimated;
}
