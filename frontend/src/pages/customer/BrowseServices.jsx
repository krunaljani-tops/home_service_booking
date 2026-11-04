import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Tag, Star, ArrowRight } from 'lucide-react';
import serviceService from '../../services/serviceService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function BrowseServices() {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [cRes, sRes] = await Promise.all([
          serviceService.getCategories(),
          serviceService.getServices({ limit: 100 }),
        ]);
        setCategories(cRes || []);
        setServices(sRes.items || sRes || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = services.filter((s) => {
    const matchesCat = selectedCat === 'ALL' || s.category_id === parseInt(selectedCat);
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                          (s.description && s.description.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Explore Services</h1>
        <p className="text-gray-500">Find vetted technicians and book dependable services for your home.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search cleaning, plumbing, repairs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>
        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="border rounded-lg px-4 py-2 text-sm bg-white focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="ALL">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center"><LoadingSpinner /></div>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center text-gray-500">
          <p className="font-semibold text-gray-700">No services found matching your criteria</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((s) => (
            <Card key={s.id} className="p-6 flex flex-col justify-between hover:shadow-md transition">
              <div className="space-y-2">
                <span className="text-xs font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full">
                  Duration ~{s.duration_minutes || 60}m
                </span>
                <h3 className="text-lg font-bold text-gray-900">{s.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{s.description}</p>
              </div>
              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Starting from</p>
                  <p className="text-xl font-extrabold text-indigo-600">₹{s.base_price}</p>
                </div>
                <Link to={`/customer/book?service_id=${s.id}`}>
                  <Button variant="primary" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                    Book
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

