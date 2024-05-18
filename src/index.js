import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import PasswordLoginWithFirebase from './registration/PageHandler';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <PasswordLoginWithFirebase />
);