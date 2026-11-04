import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Wrench, Mail, Lock, Shield, Briefcase, UserCheck, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState('SUPER_ADMIN');
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: 'admin@homeserve.com',
      password: 'Admin@123',
    },
  });

  const roles = [
    { id: 'SUPER_ADMIN', label: 'Admin', icon: Shield, defaultEmail: 'admin@homeserve.com', defaultPass: 'Admin@123' },
    { id: 'CUSTOMER', label: 'Customer', icon: User, defaultEmail: 'rahul.sharma@email.com', defaultPass: 'Customer@123' },
    { id: 'SERVICE_PROVIDER', label: 'Provider', icon: Briefcase, defaultEmail: 'cleanpro@email.com', defaultPass: 'Provider@123' },
    { id: 'TECHNICIAN', label: 'Technician', icon: UserCheck, defaultEmail: 'tech.ravi@email.com', defaultPass: 'Tech@123' },
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role.id);
    setValue('email', role.defaultEmail);
    setValue('password', role.defaultPass);
  };

  const onSubmit = async (data) => {
    try {
      const res = await login(data.email, data.password, selectedRole);
      const userObj = res.user;
      toast.success(`Welcome back, ${userObj?.first_name || userObj?.email}!`);

      const role = userObj?.role || selectedRole;
      let target = '/customer';
      if (role === 'SUPER_ADMIN') target = '/admin';
      else if (role === 'SERVICE_PROVIDER') target = '/provider';
      else if (role === 'TECHNICIAN') target = '/technician';

      navigate(target, { replace: true });
    } catch (error) {
      const msg = error.response?.data?.detail || error.message || 'Invalid email or password';
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Wrench className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">HomeServe</span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Sign In to Your Account
          </h2>
          <p className="text-xs text-slate-500">
            Access your bookings, track jobs, or manage platform operations.
          </p>
        </div>

        {/* Role Quick Selector */}
        <div className="bg-slate-100 p-1.5 rounded-xl flex gap-1">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = selectedRole === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => handleRoleSelect(r)}
                className={`flex-1 py-2 px-1 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                  isSelected
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200/80">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="you@email.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email address is required',
              })}
            />

            <div className="space-y-1">
              <Input
                label="Password"
                type="password"
                icon={Lock}
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                })}
              />
              <div className="flex justify-end pt-1">
                <a href="#forgot" onClick={(e) => { e.preventDefault(); toast('Password reset link sent to registered email'); }} className="text-xs font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              loading={isSubmitting}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Quick Demo Credentials Info */}
        <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3 text-xs text-indigo-900 space-y-1">
          <p className="font-semibold text-indigo-950">Demo Credentials:</p>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-indigo-800">
            <div><span className="font-medium">Admin:</span> admin@homeserve.com</div>
            <div><span className="font-medium">Pass:</span> Admin@123</div>
            <div><span className="font-medium">Customer:</span> rahul.sharma@email.com</div>
            <div><span className="font-medium">Pass:</span> Customer@123</div>
            <div><span className="font-medium">Provider:</span> cleanpro@email.com</div>
            <div><span className="font-medium">Pass:</span> Provider@123</div>
            <div><span className="font-medium">Technician:</span> tech.ravi@email.com</div>
            <div><span className="font-medium">Pass:</span> Tech@123</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
