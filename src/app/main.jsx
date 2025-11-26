import { createRoot } from 'react-dom/client'
import { store } from './store/store'
import { Provider } from "react-redux";
import './index.css'
import App from './App'
import { AuthProvider } from './providers/AuthProvider'
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/utils/reactQueryClient';

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
        <App />
        </QueryClientProvider>
      </AuthProvider>
    </Provider>
)
