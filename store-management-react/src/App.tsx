import React from 'react';
import './App.css';
import Button from '@mui/material/Button';
import MenuBar from './MenuBar';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {Corporate} from "./types/Corporate";
import {Item} from "./types/Item";
import {AuthorizedUser} from "./types/AuthorizedUser";
import {GPS} from "./types/GPS";
import {Store} from "./types/Store";

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


let corporate = new Corporate([new Item("123", "name", "desc", 8, 1, 2, 10)],
    [new Store(0, [], new AuthorizedUser("", "", ""), [], new GPS(0,0))]);
let corporate2 = corporate.copy();
corporate2.items[0].aisle = 5;
console.log(corporate)
console.log(corporate2)

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
