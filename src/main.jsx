import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from "@/components/ui/sonner"
import { Provider } from 'react-redux'
import { store } from './store/store'


createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
            <App />
            <Toaster position="top-center" richColors />
        </Provider>
    </StrictMode>,
)