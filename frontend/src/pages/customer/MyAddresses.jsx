import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Trash2, Home, Briefcase } from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

export default function MyAddresses() {
  const [addresses, setAddresses] = useState([
    { id: 1, label: 'Home', address_line1: '42, MG Road, Near City Mall', city: 'Mumbai', state: 'Maharashtra', postal_code: '400001', is_default: true }
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [label, setLabel] = useState('Home');
  const [line1, setLine1] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [postal, setPostal] = useState('400001');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!line1) return toast.error("Please enter street address");
    const newAddr = {
      id: Date.now(),
      label,
      address_line1: line1,
      city,
      state,
      postal_code: postal,
      is_default: addresses.length === 0,
    };
    setAddresses([...addresses, newAddr]);
    setShowAdd(false);
    setLine1('');
    toast.success("Address added successfully");
  };

  const handleDelete = (id) => {
    setAddresses(addresses.filter(a => a.id !== id));
    toast.success("Address removed");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Addresses</h1>
          <p className="text-gray-500">Service locations for technician dispatch and scheduling.</p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? 'Cancel' : 'Add Address'}
        </Button>
      </div>

      {showAdd && (
        <Card className="p-6">
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                <select
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:ring-indigo-500"
                >
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <Input label="Postal Code" value={postal} onChange={(e) => setPostal(e.target.value)} required />
            </div>
            <Input label="Street Address Line" value={line1} onChange={(e) => setLine1(e.target.value)} required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} required />
              <Input label="State" value={state} onChange={(e) => setState(e.target.value)} required />
            </div>
            <Button type="submit" variant="primary">Save Address</Button>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((a) => (
          <Card key={a.id} className="p-5 flex items-start justify-between">
            <div className="flex gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg h-fit">
                {a.label === 'Home' ? <Home className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{a.label}</span>
                  {a.is_default && (
                    <span className="text-xs bg-indigo-100 text-indigo-800 font-medium px-2 py-0.5 rounded">Default</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{a.address_line1}</p>
                <p className="text-sm text-gray-500">{a.city}, {a.state} - {a.postal_code}</p>
              </div>
            </div>
            <button onClick={() => handleDelete(a.id)} className="text-gray-400 hover:text-red-600 p-1">
              <Trash2 className="w-4 h-4" />
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}

