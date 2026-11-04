import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Phone, Mail, MapPin, MessageSquare, HelpCircle, Send } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Card from '../../components/ui/Card';

export const ContactPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    // Simulate contact form submission
    await new Promise((r) => setTimeout(r, 600));
    toast.success('Your message has been sent! Our support team will reply within 2 hours.');
    reset();
  };

  const faqs = [
    {
      q: 'What if the technician cannot resolve the issue?',
      a: 'If a problem cannot be fixed or if you are not fully satisfied, you are covered by our 100% money-back guarantee with zero cancellation fees.',
    },
    {
      q: 'How are technicians verified?',
      a: 'All technicians undergo government ID verification, criminal background scrutiny, skill certification tests, and in-person interviews before acceptance.',
    },
    {
      q: 'Can I reschedule or cancel a booking?',
      a: 'Yes, free rescheduling or cancellation is available directly through your customer dashboard up to 2 hours before the scheduled slot.',
    },
    {
      q: 'Do you charge extra for spare parts?',
      a: 'If new replacement materials or spare parts are needed, technicians show verified digital pricing from our catalog with your advance digital approval.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Get in Touch</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          We're Here to Help You 24/7
        </h1>
        <p className="text-sm text-slate-500">
          Have questions regarding bookings, provider onboarding, or enterprise maintenance? Send us a note.
        </p>
      </div>

      {/* Contact Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Contact details & Office */}
        <div className="space-y-6">
          <Card title="Direct Channels">
            <div className="space-y-5 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase">Customer Hotline</h4>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">+1 (800) 456-7890</p>
                  <p className="text-xs text-slate-400">Available 24 hours, 7 days a week</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase">Email Support</h4>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">support@homeserve.tech</p>
                  <p className="text-xs text-slate-400">Average response time: 30 minutes</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase">Global Headquarters</h4>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">500 Market St, Suite 400</p>
                  <p className="text-xs text-slate-400">San Francisco, CA 94105</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Map Placeholder */}
          <div className="bg-slate-200 rounded-2xl h-48 border border-slate-300 flex items-center justify-center text-slate-500 text-xs font-semibold overflow-hidden relative">
            <div className="text-center p-4">
              <MapPin className="w-8 h-8 text-indigo-600 mx-auto mb-1 animate-pulse" />
              <span>Interactive Operations Center Map</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Covering 24 major metropolitan centers</p>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-2">
          <Card title="Send a Message" subtitle="Fill out the form below and our team will get right back to you.">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  placeholder="Jane Doe"
                  {...register('name', { required: 'Full name is required' })}
                  error={errors.name?.message}
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="jane@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Please enter a valid email address',
                    },
                  })}
                  error={errors.email?.message}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Phone Number"
                  placeholder="+1 (555) 000-0000"
                  {...register('phone')}
                />
                <Input
                  label="Subject"
                  placeholder="Booking inquiry, provider question..."
                  {...register('subject', { required: 'Subject is required' })}
                  error={errors.subject?.message}
                />
              </div>

              <Textarea
                label="Your Message"
                rows={5}
                placeholder="Describe how we can assist you..."
                {...register('message', { required: 'Message cannot be blank' })}
                error={errors.message?.message}
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={isSubmitting}
                icon={Send}
                className="w-full sm:w-auto"
              >
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto space-y-6 pt-8 border-t border-slate-200">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500">Quick answers to common questions about HomeServe</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {faqs.map((faq, i) => (
            <div key={i} className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1.5">
              <h3 className="text-sm font-bold text-slate-800 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                {faq.q}
              </h3>
              <p className="text-xs text-slate-500 pl-6 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
