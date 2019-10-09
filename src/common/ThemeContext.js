import React from 'react';

const themes = {
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

const ThemeContext = React.createContext([themes.default, () => {}]);

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = React.useState(themes.default);
  const setAvailableTheme = themeName => {
    if (themes[themeName]) setTheme(themes[themeName]);
  };

  return (
    <ThemeContext.Provider value={[theme, setAvailableTheme]}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = (themeName = false) => {
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
