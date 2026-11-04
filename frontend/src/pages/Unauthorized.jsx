import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export const Unauthorized = () => {
  const { user } = useAuth();

  const getDashboardPath = (role) => {
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'provider':
        return '/provider/dashboard';
      case 'technician':
        return '/technician/dashboard';
      default:
        return '/customer/dashboard';
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 mb-5">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">Access Restricted</span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">403 - Unauthorized</h1>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          You do not have permission to access this resource with your current role ({user?.role || 'guest'}).
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to={getDashboardPath(user?.role)}>
            <Button variant="primary" icon={ArrowLeft}>
              Return to My Dashboard
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline">Go to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
