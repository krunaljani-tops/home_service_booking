import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, CheckCircle, CreditCard, Star, AlertCircle } from 'lucide-react';
import bookingService from '../../services/bookingService';
import paymentService from '../../services/paymentService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function BookingDetail() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await bookingService.getBooking(id);
        setBooking(res);
      } catch (err) {
        toast.error("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    setActionLoading(true);
    try {
      await bookingService.cancelBooking(id, "Cancelled by customer");
      toast.success("Booking cancelled successfully");
      const updated = await bookingService.getBooking(id);
      setBooking(updated);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to cancel booking");
    } finally {
      setActionLoading(false);
    }
  };

  const handlePay = async () => {
    setActionLoading(true);
    try {
      const order = await paymentService.createOrder(id);
      // Simulate mock checkout verification in sandbox
      await paymentService.verifyPayment({
        booking_id: parseInt(id),
        razorpay_order_id: order.razorpay_order_id || "order_test_mock",
        razorpay_payment_id: "pay_test_" + Date.now(),
        razorpay_signature: "mock_signature_valid",
      });
      toast.success("Payment successful! Invoice generated.");
      const updated = await bookingService.getBooking(id);
      setBooking(updated);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Payment processing failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><LoadingSpinner /></div>;
  if (!booking) return <div className="text-center py-20 text-gray-500">Booking not found</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Link to="/customer/bookings" className="text-gray-500 hover:text-gray-800">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Booking: {booking.booking_uid}</h1>
        <StatusBadge status={booking.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Service Details</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Scheduled Date</p>
              <p className="font-semibold text-gray-900">{booking.scheduled_date}</p>
            </div>
            <div>
              <p className="text-gray-500">Scheduled Time</p>
              <p className="font-semibold text-gray-900">{booking.scheduled_time}</p>
            </div>
            <div>
              <p className="text-gray-500">Duration</p>
              <p className="font-semibold text-gray-900">{booking.duration_minutes || 60} mins</p>
            </div>
            <div>
              <p className="text-gray-500">Current Status</p>
              <p className="font-semibold text-indigo-600">{booking.status}</p>
            </div>
          </div>

          {booking.description && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-gray-500 text-sm">Customer Notes:</p>
              <p className="text-gray-800 text-sm mt-1 bg-gray-50 p-3 rounded-lg">{booking.description}</p>
            </div>
          )}

          {['PENDING', 'CONFIRMED'].includes(booking.status) && (
            <div className="pt-4 flex gap-3">
              <Button variant="danger" size="sm" onClick={handleCancel} disabled={actionLoading}>
                Cancel Booking
              </Button>
            </div>
          )}
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Price Breakdown</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Base Price</span>
              <span className="font-medium">₹{booking.total_amount}</span>
            </div>
            <div className="flex justify-between text-emerald-600">
              <span>Discount</span>
              <span>-₹{booking.discount_amount || 0}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>GST (18%)</span>
              <span>₹{booking.tax_amount || 0}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-base text-gray-900">
              <span>Total Payable</span>
              <span className="text-indigo-600">₹{booking.final_amount}</span>
            </div>
          </div>

          {['CONFIRMED', 'COMPLETED'].includes(booking.status) && (
            <Button
              variant="primary"
              className="w-full mt-4"
              icon={<CreditCard className="w-4 h-4" />}
              onClick={handlePay}
              disabled={actionLoading}
            >
              Pay Now (Razorpay Test)
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}

