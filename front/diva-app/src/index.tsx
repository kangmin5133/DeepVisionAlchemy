import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from 'react-redux';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { store } from './js/store/index';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
reportWebVitals();
