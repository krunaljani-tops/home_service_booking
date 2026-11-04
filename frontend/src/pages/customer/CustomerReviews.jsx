import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';
import { Star, MessageSquare } from 'lucide-react';

export default function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await api.get('/api/v1/reviews');
        setReviews(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Ratings & Reviews</h1>
        <p className="text-gray-500">Service ratings and feedback you have submitted for past bookings.</p>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="py-12 flex justify-center"><LoadingSpinner /></div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-900">No reviews submitted yet</h3>
            <p className="text-xs text-gray-500 mt-1">Once a technician completes your booking, you can rate and review their service quality.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < r.rating ? 'fill-amber-400 stroke-amber-400' : 'stroke-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-xs font-bold text-gray-700 ml-1.5">{r.rating}.0 / 5</span>
                    </div>
                    <p className="text-sm text-gray-800 mt-2">{r.comment || 'No written feedback provided.'}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {r.created_at ? new Date(r.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>

                {r.response && (
                  <div className="mt-3 bg-gray-50 border-l-4 border-indigo-500 p-3 rounded text-xs text-gray-700">
                    <span className="font-semibold text-gray-900 block mb-0.5">Provider Response:</span>
                    {r.response}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

