import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';
import Button from '../components/ui/Button';

export const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6 shadow-inner">
          <Compass className="w-10 h-10 animate-bounce" />
        </div>
        <span className="text-6xl font-extrabold text-indigo-600 tracking-tight">404</span>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">Page Not Found</h1>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link to="/">
            <Button variant="primary" icon={Home}>
              Back to Home
            </Button>
          </Link>
          <Link to="/services">
            <Button variant="outline">Browse Services</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
