import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'  // ← Add this
import { store } from './store/store.ts'  // ← Add this

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>  {/* ← Wrap App */}
      <App />
    </Provider>
  </React.StrictMode>,
)