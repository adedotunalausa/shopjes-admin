import React from 'react';
import ReactDOM from 'react-dom';
import { BaseProvider } from 'baseui';
import { theme } from './theme';
import {AuthProvider} from './context/AuthUser'
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './theme/global.css';
import App from './App';

const engine = new Styletron();

ReactDOM.render(
  <AuthProvider>
    <StyletronProvider value={engine}> 
      <BaseProvider theme={theme}>
        <App />
        <ToastContainer />
      </BaseProvider>
    </StyletronProvider>
  </AuthProvider>,
  document.getElementById('root')
);
