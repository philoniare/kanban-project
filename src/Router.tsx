import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from './routes/Home';
import NotFoundPage from './routes/NotFoundPage';

function Router() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path={'/'} element={<Home />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate replace to="/404" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
