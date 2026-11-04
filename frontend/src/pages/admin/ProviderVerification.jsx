import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  ShieldCheck,
  FileText,
  Download,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Building2,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Textarea from '../../components/ui/Textarea';
import StatusBadge from '../../components/ui/StatusBadge';
import { mockProviders } from '../../utils/mockData';

export const ProviderVerification = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const provider = mockProviders.find((p) => p.id === id) || mockProviders[0];

  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAction = async (status) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    toast.success(`Provider has been marked as ${status.toUpperCase()}`);
    navigate('/admin/providers');
  };

  const documents = [
    { title: 'Commercial General Liability Insurance Certificate', date: '2026-01-15', size: '2.4 MB' },
    { title: 'Master Contractor Trade License #LIC-882910', date: '2025-11-20', size: '1.1 MB' },
    { title: 'Corporate Entity Incorporation Articles', date: '2025-06-10', size: '3.8 MB' },
    { title: 'Technician Criminal History Clearance Batch', date: '2026-02-01', size: '4.5 MB' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/admin/providers">
          <Button variant="ghost" size="sm" icon={ArrowLeft}>
            Back to Providers
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Verify Provider: {provider.companyName}
          </h1>
          <p className="text-xs text-slate-500">ID: {provider.id} • Registered Owner: {provider.ownerName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card title="Submitted Regulatory Documents">
            <div className="space-y-3">
              {documents.map((doc, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{doc.title}</p>
                      <span className="text-[10px] text-slate-400">
                        Uploaded: {doc.date} • {doc.size}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Download}
                    onClick={() => toast.success(`Downloaded: ${doc.title}`)}
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Compliance Decision & Auditor Remarks">
            <div className="space-y-4">
              <Textarea
                label="Auditor Remarks / Feedback to Provider"
                rows={4}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Specify verification notes, insurance validity confirmation, or rejection reason..."
              />

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <Button
                  variant="danger"
                  loading={loading}
                  icon={XCircle}
                  onClick={() => handleAction('rejected')}
                >
                  Reject Application
                </Button>
                <Button
                  variant="success"
                  loading={loading}
                  icon={CheckCircle2}
                  onClick={() => handleAction('approved')}
                >
                  Approve & Issue Verified Badge
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card title="Company Metadata">
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Business Email</span>
                <span className="font-semibold text-slate-800">{provider.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Phone</span>
                <span className="font-semibold text-slate-800">{provider.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Operating Address</span>
                <span className="font-semibold text-slate-800">{provider.address}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Current Status</span>
                <StatusBadge status={provider.verified ? 'verified' : 'pending'} />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProviderVerification;
