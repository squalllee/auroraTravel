
import React, { useState, useEffect } from 'react';
import { Expense, ExpenseCategory } from '../types';
import { supabase } from '../src/lib/supabase';

interface ExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (expense: Partial<Expense>) => void;
    dayId: string;
    expense?: Expense;
    itemOptions?: { id: string; title: string }[];
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({
    isOpen,
    onClose,
    onSave,
    dayId,
    expense,
    itemOptions = []
}) => {
    const [formData, setFormData] = useState<Partial<Expense>>({
        category: ExpenseCategory.FOOD,
        amount: 0,
        currency: 'TWD',
        description: '',
        itemId: undefined,
    });

    useEffect(() => {
        if (expense) {
            setFormData(expense);
        } else {
            setFormData({
                category: ExpenseCategory.FOOD,
                amount: 0,
                currency: 'TWD',
                description: '',
                itemId: undefined,
            });
        }
    }, [expense, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.amount && formData.amount > 0) {
            onSave({ ...formData, dayId });
            onClose();
        }
    };

    const getCategoryIcon = (category: ExpenseCategory) => {
        switch (category) {
            case ExpenseCategory.FOOD: return '🍽️';
            case ExpenseCategory.TRANSPORT: return '🚗';
            case ExpenseCategory.ACCOMMODATION: return '🏨';
            case ExpenseCategory.ACTIVITY: return '🎫';
            case ExpenseCategory.SHOPPING: return '🛍️';
            case ExpenseCategory.OTHER: return '💰';
            default: return '💰';
        }
    };

    const getCategoryLabel = (category: ExpenseCategory) => {
        switch (category) {
            case ExpenseCategory.FOOD: return '餐飲';
            case ExpenseCategory.TRANSPORT: return '交通';
            case ExpenseCategory.ACCOMMODATION: return '住宿';
            case ExpenseCategory.ACTIVITY: return '活動';
            case ExpenseCategory.SHOPPING: return '購物';
            case ExpenseCategory.OTHER: return '其他';
            default: return '其他';
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="bg-jp-green px-6 py-4 flex justify-between items-center text-white">
                    <h3 className="font-serif font-bold text-lg">
                        {expense ? '編輯支出' : '新增支出'}
                    </h3>
                    <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Category */}
                    <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase mb-2">
                            類別
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {Object.values(ExpenseCategory).map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, category: cat })}
                                    className={`p-3 rounded-lg border-2 transition-all ${formData.category === cat
                                            ? 'border-jp-green bg-jp-green/10 text-jp-green'
                                            : 'border-stone-200 hover:border-stone-300'
                                        }`}
                                >
                                    <div className="text-2xl mb-1">{getCategoryIcon(cat)}</div>
                                    <div className="text-xs font-bold">{getCategoryLabel(cat)}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Amount and Currency */}
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-stone-500 uppercase mb-2">
                                金額
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-jp-green/50"
                                value={formData.amount || ''}
                                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                                required
                            />
                        </div>
                        <div className="w-24">
                            <label className="block text-xs font-bold text-stone-500 uppercase mb-2">
                                幣別
                            </label>
                            <select
                                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-jp-green/50 bg-white"
                                value={formData.currency}
                                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                            >
                                <option value="TWD">TWD</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="DKK">DKK</option>
                                <option value="SEK">SEK</option>
                                <option value="NOK">NOK</option>
                                <option value="VND">VND</option>
                            </select>
                        </div>
                    </div>

                    {/* Link to Item (Optional) */}
                    {itemOptions.length > 0 && (
                        <div>
                            <label className="block text-xs font-bold text-stone-500 uppercase mb-2">
                                關聯行程 (選填)
                            </label>
                            <select
                                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-jp-green/50 bg-white"
                                value={formData.itemId || ''}
                                onChange={(e) => setFormData({ ...formData, itemId: e.target.value || undefined })}
                            >
                                <option value="">無關聯</option>
                                {itemOptions.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase mb-2">
                            說明 (選填)
                        </label>
                        <textarea
                            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-jp-green/50"
                            rows={3}
                            placeholder="輸入支出說明..."
                            value={formData.description || ''}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-jp-green text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg"
                    >
                        {expense ? '更新支出' : '新增支出'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ExpenseModal;
