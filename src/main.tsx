import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js'
import { QuranData } from './QuranData.ts'
import './index.css'
import About from './routes/about.tsx'
import Quran from './routes/quran.tsx'
import Root from './routes/root.tsx'

QuranData.instance.setAyats().then(() => {

    QuranData.instance.setCorpus().then(() => {

    });

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Root />
        },
        {
            path: "/quran",
            element: <Quran />
        },
        {
            path: "/about",
            element: <About />
        }
    ]);

    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <RouterProvider router={router} />
        </React.StrictMode>,
    )

});
