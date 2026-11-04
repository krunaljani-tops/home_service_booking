import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';
import { Plus, User, Wrench, Trash2 } from 'lucide-react';

export default function TechnicianManagement() {
  const [techs, setTechs] = useState([
    { id: 1, name: 'Ravi Gupta', phone: '9876600001', specialization: 'Deep Cleaning, Carpet Cleaning', experience: 5, active: true },
    { id: 2, name: 'Sanjay Das', phone: '9876600002', specialization: 'Kitchen Cleaning, Sanitization', experience: 3, active: true },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [spec, setSpec] = useState('');
  const [exp, setExp] = useState(2);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name || !phone) return toast.error("Please fill required fields");
    setTechs([...techs, {
      id: Date.now(),
      name,
      phone,
      specialization: spec || 'General Maintenance',
      experience: exp,
      active: true,
    }]);
    setShowAdd(false);
    setName('');
    setPhone('');
    setSpec('');
    toast.success("Technician onboarded successfully!");
  };

  const removeTech = (id) => {
    setTechs(techs.filter(t => t.id !== id));
    toast.success("Technician removed");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Technician Fleet</h1>
          <p className="text-gray-500">Manage field staff, specializations, and booking assignments.</p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? 'Cancel' : 'Add Technician'}
        </Button>
      </div>

      {showAdd && (
        <Card className="p-6">
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Technician Name" value={name} onChange={e => setName(e.target.value)} required />
              <Input label="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Specialization" placeholder="e.g. Electrical, HVAC, Plumbing" value={spec} onChange={e => setSpec(e.target.value)} />
              <Input label="Years of Experience" type="number" value={exp} onChange={e => setExp(e.target.value)} />
            </div>
            <Button type="submit" variant="primary">Save Technician</Button>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {techs.map(t => (
          <Card key={t.id} className="p-5 flex justify-between items-start">
            <div className="flex gap-3">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{t.name}</h3>
                <p className="text-sm text-gray-500">{t.phone}</p>
                <div className="flex items-center gap-1 text-xs text-indigo-700 mt-2 font-medium">
                  <Wrench className="w-3.5 h-3.5" />
                  <span>{t.specialization} ({t.experience} yrs exp)</span>
                </div>
              </div>
            </div>
            <button onClick={() => removeTech(t.id)} className="text-gray-400 hover:text-red-600 p-1">
              <Trash2 className="w-4 h-4" />
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}

