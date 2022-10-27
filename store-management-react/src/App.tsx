import React from 'react';
import './App.css';
import Button from '@mui/material/Button';
import MenuBar from './MenuBar';
import {createTheme, ThemeProvider} from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: "#9c27b0",
            light: "#ba68c8",
            dark: "#7b1fa2",
            contrastText: "#fff"
        },
        secondary: {
            main: "#1976d2",
            light: "#42a5f5",
            dark: "#1565c0"
        }
    }
});


function App() {
  return (
      <ThemeProvider theme={theme}>
          <div className="App">
            <MenuBar/>
            <br />
            <Button variant="contained">Hello World</Button>
          </div>
      </ThemeProvider>
  );
}

export default App;
