import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: "#593489",
      dark: '#161c2d'
    },
    secondary: {
      main: '#302650'
    }
  },
});

export default theme;