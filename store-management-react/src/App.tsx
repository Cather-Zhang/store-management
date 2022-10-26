import React from 'react';
import './App.css';
import Button from '@mui/material/Button';
import MenuBar from './MenuBar';


function App() {
  return (
      <div className="App">
        <MenuBar></MenuBar>
        <br />
        <Button variant="contained">Hello World</Button>
      </div>
  );
}

export default App;
