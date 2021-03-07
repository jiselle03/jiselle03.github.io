import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import theme from './styles/Theme';
import GlobalStyles from './styles/Global';
import { Main } from './styles/Layout';

import NavBar from './components/NavBar';
import Footer from './components/Footer';
import WelcomePage from './pages/WelcomePage';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
     <BrowserRouter>
      <GlobalStyles />
          <NavBar />
          <Switch>
            <Main>
              <Route exact path="/" component={WelcomePage}/>
            </Main>
          </Switch>
          <Footer />
     </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
