import { createRoot } from 'react-dom/client'
import { store } from './store/store'
import { Provider } from "react-redux";
import './index.css'
import App from './App'
import { AuthProvider } from './providers/AuthProvider'

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Provider>
)
