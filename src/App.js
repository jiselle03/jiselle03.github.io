import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import theme from './styles/Theme';
import GlobalStyles from './styles/Global'
import WelcomePage from './pages/WelcomePage'
import AboutPage from './pages/AboutPage'
import PortfolioPage from './pages/PortfolioPage'

const App = () => {
  return (
    <ThemeProvider theme={theme}>
     <BrowserRouter>
      <GlobalStyles />
        <Switch>
          <Route exact path="/" component={WelcomePage}/>
          <Route exact path="/about" component={AboutPage}/>
          <Route exact path="/portfolio" component={PortfolioPage}/>
        </Switch>
     </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
