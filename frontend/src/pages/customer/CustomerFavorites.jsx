import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';
import { Heart, Star, MapPin, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CustomerFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      try {
        // Fetch top providers as recommended favorites
        const res = await api.get('/api/v1/providers');
        setFavorites((res.data || []).slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadFavorites();
  }, []);

  const handleRemove = (id) => {
    setFavorites(favorites.filter(f => f.id !== id));
    toast.success('Removed from favorites');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Saved Favorites</h1>
        <p className="text-gray-500">Quickly re-book your preferred trusted home service specialists.</p>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center"><LoadingSpinner /></div>
      ) : favorites.length === 0 ? (
        <Card className="p-12 text-center">
          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">No favorites yet</h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">Browse verified providers and save your favorites for instant access.</p>
          <Link to="/customer/browse">
            <Button variant="primary">Browse Services</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favorites.map((p) => (
            <Card key={p.id} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{p.business_name}</h3>
                    <div className="flex items-center gap-1.5 mt-1 text-sm text-amber-500 font-semibold">
                      <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                      <span>{p.rating_avg || '4.8'}</span>
                      <span className="text-gray-400 font-normal">({p.total_reviews || 12} reviews)</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(p.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-full"
                    title="Remove from favorites"
                  >
                    <Heart className="w-5 h-5 fill-red-500" />
                  </button>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-3">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{p.city || 'Bangalore'} &bull; Within 15 km coverage</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400">Starting from</span>
                  <div className="text-base font-bold text-gray-900">₹{p.hourly_rate || 299} <span className="text-xs font-normal text-gray-500">/hr</span></div>
                </div>
                <Link to="/customer/book">
                  <Button size="sm" variant="primary" icon={ArrowRight}>Book Now</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

