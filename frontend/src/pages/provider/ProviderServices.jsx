import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Wrench, CheckCircle2 } from 'lucide-react';

export default function ProviderServices() {
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [providerServices, setProviderServices] = useState(new Set());

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await api.get('/api/v1/services');
        const services = res.data?.items || res.data || [];
        setAllServices(services);
        // Initially select first few as active services
        setProviderServices(new Set(services.slice(0, 3).map(s => s.id)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  const toggleService = (id) => {
    const next = new Set(providerServices);
    if (next.has(id)) {
      next.delete(id);
      toast.success('Service removed from your portfolio');
    } else {
      next.add(id);
      toast.success('Service added to your portfolio');
    }
    setProviderServices(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services Offered</h1>
          <p className="text-gray-500">Enable or disable service offerings and configure custom dispatch availability.</p>
        </div>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="py-12 flex justify-center"><LoadingSpinner /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allServices.map((service) => {
              const isOffered = providerServices.has(service.id);
              return (
                <div
                  key={service.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isOffered ? 'border-indigo-500 bg-indigo-50/20 shadow-xs' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg ${isOffered ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                        <Wrench className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{service.name}</h4>
                        <span className="text-xs text-gray-500">{service.duration_minutes || 60} mins standard</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">{service.description || 'Professional home service maintenance.'}</p>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="font-bold text-indigo-600 text-sm">₹{service.base_price}</div>
                    <Button
                      size="sm"
                      variant={isOffered ? 'primary' : 'secondary'}
                      onClick={() => toggleService(service.id)}
                    >
                      {isOffered ? 'Offering' : 'Add Service'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
