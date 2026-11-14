import React, { useState } from 'react';
import {
  Gift,
  Plus,
  Pencil,
  Trash2,
  Sparkles,
  Plane,
  Sofa,
  Utensils,
  Tv,
  Globe,
  Home,
  CheckCircle2,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import ProgressBar from '../components/common/ProgressBar';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import EmptyState from '../components/common/EmptyState';
import { useWedding } from '../context/WeddingContext';
import { formatCurrency } from '../utils/formatCurrency';
import { validateRequired } from '../utils/validators';

const CATEGORIES = [
  'Honeymoon',
  'Furniture',
  'Kitchen',
  'Electronics',
  'Travel',
  'Home',
  'Other',
];

export default function Wishlist() {
  const { wishlistItems, addItem, updateItem, deleteItem } = useWedding();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    category: 'Honeymoon',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Open modal for new item
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      targetAmount: '',
      category: 'Honeymoon',
    });
    setErrors({});
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      targetAmount: String(item.targetAmount),
      category: item.category || 'Honeymoon',
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    const titleVal = validateRequired(formData.title, 'Goal title');
    if (!titleVal.valid) newErrors.title = titleVal.message;

    if (!formData.targetAmount || Number(formData.targetAmount) <= 0) {
      newErrors.targetAmount = 'Please enter a valid target amount (greater than 0)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingItem) {
        await updateItem(editingItem.id, {
          title: formData.title,
          description: formData.description,
          targetAmount: Number(formData.targetAmount),
          category: formData.category,
        });
      } else {
        await addItem({
          title: formData.title,
          description: formData.description,
          targetAmount: Number(formData.targetAmount),
          category: formData.category,
        });
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmItem) return;
    try {
      await deleteItem(deleteConfirmItem.id);
      setDeleteConfirmItem(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Category Icon helper
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Honeymoon':
        return Plane;
      case 'Furniture':
        return Sofa;
      case 'Kitchen':
        return Utensils;
      case 'Electronics':
        return Tv;
      case 'Travel':
        return Globe;
      default:
        return Home;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-navy">
            Wishlist Management
          </h2>
          <p className="text-sm text-navy/60 font-body">
            Create, refine, and monitor your personal goals and contributions in real time.
          </p>
        </div>

        <Button
          variant="secondary"
          size="md"
          icon={Plus}
          onClick={handleOpenAdd}
        >
          Add Wishlist Goal
        </Button>
      </div>

      {/* Wishlist Items Grid */}
      {wishlistItems.length === 0 ? (
        <EmptyState
          icon={Gift}
          title="No Wishlist Goals Yet"
          description="Your registry is currently empty. Add your honeymoon, furniture, or dream experiences to let guests start contributing."
          action={{
            label: 'Add First Goal',
            onClick: handleOpenAdd,
            icon: Plus,
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => {
            const Icon = getCategoryIcon(item.category);
            const isCompleted = item.currentAmount >= item.targetAmount;

            return (
              <Card
                key={item.id}
                hover
                padding="none"
                className={`flex flex-col justify-between border ${
                  isCompleted ? 'border-emerald/40 bg-emerald/5' : 'border-navy/10 bg-white'
                }`}
              >
                {/* Header with icon and category */}
                <div className="p-6 pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant={isCompleted ? 'emerald' : 'gold'} size="sm">
                      {item.category}
                    </Badge>

                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Funded!</span>
                      </span>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-ivory flex items-center justify-center text-navy/60">
                        <Icon className="w-4 h-4 text-gold" />
                      </div>
                    )}
                  </div>

                  <h3 className="font-heading text-lg font-bold text-navy mb-1.5 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-navy/60 line-clamp-2 min-h-[32px] leading-relaxed">
                    {item.description || 'No description provided.'}
                  </p>
                </div>

                {/* Progress section */}
                <div className="px-6 py-4 bg-navy/2 border-t border-b border-navy/5">
                  <ProgressBar
                    current={item.currentAmount}
                    target={item.targetAmount}
                    showAmount={true}
                    size="sm"
                  />
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 px-6 flex items-center justify-between bg-white">
                  <span className="text-[11px] text-navy/40 font-medium">
                    Goal: {formatCurrency(item.targetAmount)}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 text-navy/60 hover:text-navy hover:bg-navy/5 rounded-lg transition-colors cursor-pointer"
                      title="Edit Goal"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmItem(item)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Goal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Wishlist Goal' : 'Add New Wishlist Goal'}
        subtitle="Guests will be able to contribute toward this dream."
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Goal Title"
            name="title"
            placeholder="e.g. Dream Honeymoon to Bali"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-navy/70 mb-1.5">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full text-sm bg-white border border-navy/15 rounded-lg px-3 py-2.5 text-navy focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Target Amount (₹ INR)"
              name="targetAmount"
              type="number"
              placeholder="e.g. 100000"
              value={formData.targetAmount}
              onChange={handleChange}
              error={errors.targetAmount}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy/70 mb-1.5">
              Goal Description
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe this dream and what it means for your new beginning..."
              className="w-full text-sm bg-white border border-navy/15 rounded-lg p-3 text-navy placeholder:text-navy/30 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition-all leading-relaxed"
            />
          </div>

          <div className="pt-4 border-t border-navy/10 flex items-center justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              icon={Sparkles}
            >
              {editingItem ? 'Update Goal' : 'Save Goal'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmItem}
        onClose={() => setDeleteConfirmItem(null)}
        title="Remove Wishlist Goal"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-navy/70 leading-relaxed">
            Are you sure you want to remove{' '}
            <strong className="text-navy">{deleteConfirmItem?.title}</strong>? Any past
            demonstration contributions will remain in activity logs.
          </p>

          <div className="pt-4 border-t border-navy/10 flex items-center justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setDeleteConfirmItem(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              icon={Trash2}
            >
              Confirm Remove
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
