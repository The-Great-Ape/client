import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      // main: "#593489",
      main: '#e3e3e3',
      dark: '#593489'
    },
    secondary: {
      main: '#302650'
    },
    background: {
      paper: "#171717"
    }
  },
});

export default theme;