import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Star, MessageSquare } from 'lucide-react';

export default function ProviderReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState('');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/v1/reviews');
      setReviews(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSendReply = async (id) => {
    if (!replyText.trim()) return;
    try {
      await api.put(`/api/v1/reviews/${id}/respond`, {
        response: replyText.trim(),
      });
      toast.success('Reply submitted to customer');
      setReplyingId(null);
      setReplyText('');
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to submit response');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customer Feedback & Ratings</h1>
        <p className="text-gray-500">Monitor client satisfaction scores and respond directly to user reviews.</p>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="py-12 flex justify-center"><LoadingSpinner /></div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-900">No reviews yet</h3>
            <p className="text-xs text-gray-500 mt-1">Customer ratings and reviews after completed jobs will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="p-4 border border-gray-100 rounded-lg space-y-3">
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
                      <span className="text-xs font-bold text-gray-700 ml-1.5">{r.rating}.0</span>
                    </div>
                    <p className="text-sm text-gray-800 mt-2">{r.comment || 'No written review given.'}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {r.created_at ? new Date(r.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>

                {r.response ? (
                  <div className="bg-indigo-50 border-l-4 border-indigo-600 p-3 rounded text-xs text-indigo-900">
                    <span className="font-bold block mb-0.5">Your Response:</span>
                    {r.response}
                  </div>
                ) : replyingId === r.id ? (
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <textarea
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg p-2 text-xs"
                      placeholder="Write a polite response to this customer..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="secondary" onClick={() => setReplyingId(null)}>Cancel</Button>
                      <Button size="sm" variant="primary" onClick={() => handleSendReply(r.id)}>Submit Reply</Button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-gray-100">
                    <button
                      onClick={() => { setReplyingId(r.id); setReplyText(''); }}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Reply to Customer
                    </button>
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
