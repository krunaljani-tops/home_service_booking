import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Wrench, User, Briefcase, Mail, Lock, Phone, Building2, UploadCloud } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import FileUpload from '../../components/ui/FileUpload';

export const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'provider' ? 'provider' : 'customer';
  const [activeTab, setActiveTab] = useState(initialRole);
  const [docFile, setDocFile] = useState(null);
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const nameParts = (data.name || '').trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const backendRole = activeTab === 'provider' ? 'SERVICE_PROVIDER' : 'CUSTOMER';
      const payload = {
        email: data.email,
        password: data.password,
        phone: data.phone,
        first_name: firstName,
        last_name: lastName,
        name: data.name,
        role: backendRole,
        company_name: activeTab === 'provider' ? (data.company_name || `${firstName}'s Services`) : undefined,
      };

      await authRegister(payload);
      toast.success('Registration successful! Welcome to HomeServe.');

      if (backendRole === 'SERVICE_PROVIDER') {
        navigate('/provider', { replace: true });
      } else {
        navigate('/customer', { replace: true });
      }
    } catch (error) {
      let msg = 'Registration failed';
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        if (typeof detail === 'string') {
          msg = detail;
        } else if (Array.isArray(detail)) {
          msg = detail.map((d) => d.msg || JSON.stringify(d)).join(', ');
        } else {
          msg = JSON.stringify(detail);
        }
      } else if (error.message) {
        msg = error.message;
      }
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Wrench className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">HomeServe</span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Create Your Account
          </h2>
          <p className="text-xs text-slate-500">
            Join HomeServe as a customer or register your service enterprise.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-100 p-1.5 rounded-xl grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('customer')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'customer'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Customer Account</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('provider')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'provider'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Provider Partner</span>
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                placeholder="John Doe"
                {...register('name', { required: 'Name is required' })}
                error={errors.name?.message}
              />
              <Input
                label="Phone Number"
                placeholder="+1 (555) 000-0000"
                icon={Phone}
                {...register('phone', { required: 'Phone is required' })}
                error={errors.phone?.message}
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="john@example.com"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Valid email required' },
              })}
              error={errors.email?.message}
            />

            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Must be at least 6 characters' },
              })}
              error={errors.password?.message}
            />

            {/* Provider Specific Fields */}
            {activeTab === 'provider' && (
              <div className="pt-3 border-t border-slate-100 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
                  Enterprise Information
                </span>

                <Input
                  label="Registered Company Name"
                  icon={Building2}
                  placeholder="Apex Precision Services LLC"
                  {...register('company_name', {
                    required: activeTab === 'provider' ? 'Company name is required' : false,
                  })}
                  error={errors.company_name?.message}
                />

                <FileUpload
                  label="Business License / Trade Certification"
                  helperText="Upload official license, insurance certificate, or ID (PDF/JPG)"
                  onChange={(file) => setDocFile(file)}
                />
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={isSubmitting}
              className="w-full shadow-sm font-semibold mt-4"
            >
              Register as {activeTab === 'provider' ? 'Service Partner' : 'Customer'}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-indigo-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
