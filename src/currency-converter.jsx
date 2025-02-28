import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { disableReactDevTools } from '@fvilers/disable-react-devtools'

import CurrencyConverter from './pages/CurrencyConverter'

if (process.env.NODE_ENV === 'production') {
    disableReactDevTools();
}

createRoot(document.getElementById('currency-converter-content')).render(

    <StrictMode>

        <CurrencyConverter />
      
    </StrictMode>

)