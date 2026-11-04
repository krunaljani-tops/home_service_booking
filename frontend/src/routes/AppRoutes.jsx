import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Public Pages
import HomePage from '../pages/public/HomePage';
import AboutPage from '../pages/public/AboutPage';
import ServicesPage from '../pages/public/ServicesPage';
import ServiceDetailPage from '../pages/public/ServiceDetailPage';
import ProviderDetailPage from '../pages/public/ProviderDetailPage';
import ContactPage from '../pages/public/ContactPage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import BookingManagement from '../pages/admin/BookingManagement';
import CustomerManagement from '../pages/admin/CustomerManagement';
import ProviderManagement from '../pages/admin/ProviderManagement';
import ProviderVerification from '../pages/admin/ProviderVerification';
import CategoryManagement from '../pages/admin/CategoryManagement';
import ServiceManagement from '../pages/admin/ServiceManagement';
import AdminPayments from '../pages/admin/AdminPayments';
import AdminComplaints from '../pages/admin/AdminComplaints';
import AdminCoupons from '../pages/admin/AdminCoupons';
import AdminReports from '../pages/admin/AdminReports';
import AdminSettings from '../pages/admin/AdminSettings';

// Customer Pages
import CustomerDashboard from '../pages/customer/CustomerDashboard';
import MyBookings from '../pages/customer/MyBookings';
import BookingDetail from '../pages/customer/BookingDetail';
import BookService from '../pages/customer/BookService';
import BrowseServices from '../pages/customer/BrowseServices';
import CustomerFavorites from '../pages/customer/CustomerFavorites';
import CustomerPayments from '../pages/customer/CustomerPayments';
import CustomerInvoices from '../pages/customer/CustomerInvoices';
import CustomerReviews from '../pages/customer/CustomerReviews';
import CustomerComplaints from '../pages/customer/CustomerComplaints';
import MyProfile from '../pages/customer/MyProfile';
import MyAddresses from '../pages/customer/MyAddresses';

// Provider Pages
import ProviderDashboard from '../pages/provider/ProviderDashboard';
import BookingRequests from '../pages/provider/BookingRequests';
import ProviderServices from '../pages/provider/ProviderServices';
import ProviderPricing from '../pages/provider/ProviderPricing';
import AvailabilityManagement from '../pages/provider/AvailabilityManagement';
import TechnicianManagement from '../pages/provider/TechnicianManagement';
import ProviderEarnings from '../pages/provider/ProviderEarnings';
import ProviderReviews from '../pages/provider/ProviderReviews';
import ProviderProfile from '../pages/provider/ProviderProfile';

// Technician Pages
import TechnicianDashboard from '../pages/technician/TechnicianDashboard';
import AssignedJobs from '../pages/technician/AssignedJobs';
import TechnicianHistory from '../pages/technician/TechnicianHistory';

// Error Pages
import NotFound from '../pages/NotFound';
import Unauthorized from '../pages/Unauthorized';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:id" element={<ServiceDetailPage />} />
        <Route path="/providers/:id" element={<ProviderDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Admin Dashboard */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <DashboardLayout role="SUPER_ADMIN" />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="bookings" element={<BookingManagement />} />
        <Route path="customers" element={<CustomerManagement />} />
        <Route path="providers" element={<ProviderManagement />} />
        <Route path="providers/:id/verify" element={<ProviderVerification />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="services" element={<ServiceManagement />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="complaints" element={<AdminComplaints />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Customer Dashboard */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRoles={['CUSTOMER']}>
            <DashboardLayout role="CUSTOMER" />
          </ProtectedRoute>
        }
      >
        <Route index element={<CustomerDashboard />} />
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="bookings" element={<MyBookings />} />
        <Route path="bookings/:id" element={<BookingDetail />} />
        <Route path="book" element={<BookService />} />
        <Route path="browse" element={<BrowseServices />} />
        <Route path="favorites" element={<CustomerFavorites />} />
        <Route path="payments" element={<CustomerPayments />} />
        <Route path="invoices" element={<CustomerInvoices />} />
        <Route path="reviews" element={<CustomerReviews />} />
        <Route path="complaints" element={<CustomerComplaints />} />
        <Route path="profile" element={<MyProfile />} />
        <Route path="addresses" element={<MyAddresses />} />
      </Route>

      {/* Provider Dashboard */}
      <Route
        path="/provider"
        element={
          <ProtectedRoute allowedRoles={['SERVICE_PROVIDER']}>
            <DashboardLayout role="SERVICE_PROVIDER" />
          </ProtectedRoute>
        }
      >
        <Route index element={<ProviderDashboard />} />
        <Route path="dashboard" element={<ProviderDashboard />} />
        <Route path="bookings" element={<BookingRequests />} />
        <Route path="requests" element={<BookingRequests />} />
        <Route path="services" element={<ProviderServices />} />
        <Route path="pricing" element={<ProviderPricing />} />
        <Route path="availability" element={<AvailabilityManagement />} />
        <Route path="technicians" element={<TechnicianManagement />} />
        <Route path="earnings" element={<ProviderEarnings />} />
        <Route path="reviews" element={<ProviderReviews />} />
        <Route path="profile" element={<ProviderProfile />} />
      </Route>

      {/* Technician Dashboard */}
      <Route
        path="/technician"
        element={
          <ProtectedRoute allowedRoles={['TECHNICIAN']}>
            <DashboardLayout role="TECHNICIAN" />
          </ProtectedRoute>
        }
      >
        <Route index element={<TechnicianDashboard />} />
        <Route path="dashboard" element={<TechnicianDashboard />} />
        <Route path="jobs" element={<AssignedJobs />} />
        <Route path="history" element={<TechnicianHistory />} />
        <Route path="profile" element={<MyProfile />} />
      </Route>

      {/* System Status / Error pages */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
