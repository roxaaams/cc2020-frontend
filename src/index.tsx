import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'typeface-roboto';

import App from './App';
import { MediaProvider } from './hooks/media';
import { SettingsProvider } from './hooks/settings';

import reportWebVitals from './reportWebVitals';
import { MatricesProvider } from './hooks/matrices';

ReactDOM.render(
  <React.StrictMode>
    <MediaProvider>
      <SettingsProvider>
        <MatricesProvider>
          <App />
        </MatricesProvider>
      </SettingsProvider>
    </MediaProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
