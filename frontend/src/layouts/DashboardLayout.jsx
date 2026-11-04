import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Wrench,
  LayoutDashboard,
  Users,
  Briefcase,
  Layers,
  CalendarCheck,
  CreditCard,
  AlertCircle,
  Tag,
  BarChart3,
  Settings,
  Heart,
  Star,
  MapPin,
  Clock,
  UserCheck,
  DollarSign,
  CheckCircle2,
  Menu,
  X,
  Bell,
  Search,
  LogOut,
  User,
  ChevronDown,
  ExternalLink,
  PlusCircle,
  FileText,
} from 'lucide-react';
import Avatar from '../components/ui/Avatar';

export const DashboardLayout = ({ role: overrideRole }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Normalize role casing and aliases
  const rawRole = (overrideRole || user?.role || 'CUSTOMER').toUpperCase();
  const isAdmin = rawRole === 'SUPER_ADMIN' || rawRole === 'ADMIN';
  const isProvider = rawRole === 'SERVICE_PROVIDER' || rawRole === 'PROVIDER';
  const isTechnician = rawRole === 'TECHNICIAN';

  const roleDisplay = isAdmin
    ? 'Admin'
    : isProvider
    ? 'Provider'
    : isTechnician
    ? 'Technician'
    : 'Customer';

  // Navigation configs per role
  const adminNav = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Bookings', path: '/admin/bookings', icon: CalendarCheck },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Providers', path: '/admin/providers', icon: Briefcase },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'Services', path: '/admin/services', icon: Wrench },
    { name: 'Payments', path: '/admin/payments', icon: CreditCard },
    { name: 'Complaints', path: '/admin/complaints', icon: AlertCircle },
    { name: 'Coupons', path: '/admin/coupons', icon: Tag },
    { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const customerNav = [
    { name: 'Dashboard', path: '/customer', icon: LayoutDashboard },
    { name: 'My Bookings', path: '/customer/bookings', icon: CalendarCheck },
    { name: 'Browse Services', path: '/customer/browse', icon: Search },
    { name: 'Book Service', path: '/customer/book', icon: PlusCircle },
    { name: 'Favorites', path: '/customer/favorites', icon: Heart },
    { name: 'Payments & History', path: '/customer/payments', icon: CreditCard },
    { name: 'Invoices', path: '/customer/invoices', icon: FileText },
    { name: 'My Reviews', path: '/customer/reviews', icon: Star },
    { name: 'Complaints', path: '/customer/complaints', icon: AlertCircle },
    { name: 'My Addresses', path: '/customer/addresses', icon: MapPin },
    { name: 'My Profile', path: '/customer/profile', icon: User },
  ];

  const providerNav = [
    { name: 'Dashboard', path: '/provider', icon: LayoutDashboard },
    { name: 'Booking Requests', path: '/provider/bookings', icon: CalendarCheck },
    { name: 'My Services', path: '/provider/services', icon: Wrench },
    { name: 'Manage Pricing', path: '/provider/pricing', icon: Tag },
    { name: 'Availability', path: '/provider/availability', icon: Clock },
    { name: 'Technicians', path: '/provider/technicians', icon: UserCheck },
    { name: 'Earnings', path: '/provider/earnings', icon: DollarSign },
    { name: 'Customer Reviews', path: '/provider/reviews', icon: Star },
    { name: 'Profile & Docs', path: '/provider/profile', icon: Briefcase },
  ];

  const technicianNav = [
    { name: 'Dashboard', path: '/technician', icon: LayoutDashboard },
    { name: 'Assigned Jobs', path: '/technician/jobs', icon: CalendarCheck },
    { name: 'Job History', path: '/technician/history', icon: CheckCircle2 },
    { name: 'My Profile', path: '/technician/profile', icon: User },
  ];

  const getNavItems = () => {
    if (isAdmin) return adminNav;
    if (isProvider) return providerNav;
    if (isTechnician) return technicianNav;
    return customerNav;
  };

  const navItems = getNavItems();

  const profilePath = isAdmin
    ? '/admin/settings'
    : isProvider
    ? '/provider/profile'
    : isTechnician
    ? '/technician/profile'
    : '/customer/profile';

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 md:static ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-extrabold text-white tracking-tight">HomeServe</span>
              <span className="block text-[10px] font-semibold text-indigo-400 uppercase tracking-widest -mt-1">
                {roleDisplay} Portal
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isRootPath =
              item.path === '/admin' ||
              item.path === '/customer' ||
              item.path === '/provider' ||
              item.path === '/technician';
            const isActive = isRootPath
              ? location.pathname === item.path || location.pathname === `${item.path}/dashboard`
              : location.pathname === item.path || location.pathname.startsWith(item.path + '/');

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Card at bottom of sidebar */}
        <div className="p-3 border-t border-slate-800">
          <div className="p-2 rounded-lg bg-slate-800/60 flex items-center gap-3">
            <Avatar name={user?.name || user?.email || 'User'} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {user?.name || user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-[10px] text-slate-400 capitalize truncate">{roleDisplay}</p>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="text-slate-400 hover:text-rose-400 transition-colors p-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <span className="font-medium text-slate-700">{roleDisplay} Workspace</span>
              <span>/</span>
              <span className="text-slate-400 truncate max-w-[200px]">
                {location.pathname.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') || 'Overview'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick public site link */}
            <Link
              to="/"
              target="_blank"
              className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 transition-colors px-2.5 py-1.5 rounded-md hover:bg-slate-50"
            >
              <span>View Public Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* Notification Icon */}
            <div className="relative">
              <button
                type="button"
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 relative"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              </button>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Avatar name={user?.name || user?.email || 'User'} size="sm" />
                <span className="hidden md:inline-block text-xs font-semibold text-slate-700">
                  {user?.name || user?.email?.split('@')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-lg border border-slate-100 py-1 z-50"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {user?.name || 'Account'}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                  </div>
                  <Link
                    to={profilePath}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Profile Settings</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
