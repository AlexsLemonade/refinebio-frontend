import React from 'react';

const options = {
  default: {
    header: 'default',
  },
  inverted: {
    header: 'inverted',
  },
  light: {
    header: 'light',
  },
};

// {default:"default", inverted:"inverted"...}
const themes = Object.assign(
  {},
  ...Object.keys(options).map(t => ({ [t]: t }))
);

const ThemeContext = React.createContext([options.default, () => {}]);

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = React.useState(options.default);
  const setAvailableTheme = themeName => {
    if (options[themeName]) setTheme(options[themeName]);
  };

  return (
    <ThemeContext.Provider value={[theme, setAvailableTheme]}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = (themeName = false) => {
  if (themeName && !options[themeName]) {
    throw Error(`"${themeName}" is not a supported theme.`);
  }

  const [theme, setTheme] = React.useContext(ThemeContext);
  React.useEffect(() => {
    if (themeName) setTheme(themeName);
    return () => {
      if (themeName) setTheme('default');
    };
  }, [themeName, setTheme]);

  return [theme, setTheme];
};

export { themes, ThemeContext, ThemeProvider, useTheme };
