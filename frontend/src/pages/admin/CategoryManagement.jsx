import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Layers, Search } from 'lucide-react';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import { mockCategories } from '../../utils/mockData';

export const CategoryManagement = () => {
  const [categories, setCategories] = useState(mockCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const handleOpenModal = (cat = null) => {
    setEditingCategory(cat);
    if (cat) {
      setValue('name', cat.name);
      setValue('slug', cat.slug);
      setValue('description', cat.description);
      setValue('startingPrice', cat.startingPrice);
    } else {
      reset();
    }
    setIsModalOpen(true);
  };

  const onSubmit = (data) => {
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id ? { ...c, ...data, startingPrice: Number(data.startingPrice) } : c
        )
      );
      toast.success('Category updated successfully');
    } else {
      const newCat = {
        id: 'cat_' + Date.now(),
        ...data,
        startingPrice: Number(data.startingPrice),
        serviceCount: 0,
      };
      setCategories((prev) => [...prev, newCat]);
      toast.success('New category added');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this service category?')) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success('Category deleted');
    }
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: 'name',
      title: 'Category',
      render: (val, row) => (
        <div>
          <span className="font-bold text-slate-900 block">{val}</span>
          <span className="text-[11px] text-slate-400">Slug: {row.slug}</span>
        </div>
      ),
    },
    { key: 'description', title: 'Description', render: (val) => <span className="line-clamp-1 max-w-xs">{val}</span> },
    { key: 'serviceCount', title: 'Services Count', render: (val) => `${val || 0} active` },
    { key: 'startingPrice', title: 'Starting Price', render: (val) => `$${val}` },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={Edit2} onClick={() => handleOpenModal(row)}>
            Edit
          </Button>
          <Button variant="danger" size="sm" icon={Trash2} onClick={() => handleDelete(row.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Category Directory</h1>
          <p className="text-xs text-slate-500 mt-1">Configure service sectors, base pricing, and tags.</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => handleOpenModal(null)}>
          Add Category
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
        <div className="relative w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <Table columns={columns} data={filtered} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Category Name"
            placeholder="e.g. Smart Home & Security"
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Slug"
              placeholder="e.g. smart_home"
              {...register('slug', { required: 'Slug is required' })}
              error={errors.slug?.message}
            />
            <Input
              label="Starting Price ($)"
              type="number"
              placeholder="49"
              {...register('startingPrice', { required: 'Price is required' })}
              error={errors.startingPrice?.message}
            />
          </div>

          <Textarea
            label="Description"
            rows={3}
            placeholder="Describe what services fall under this category..."
            {...register('description', { required: 'Description is required' })}
            error={errors.description?.message}
          />

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
