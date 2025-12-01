
import React, { useState, useEffect } from 'react';
import { Expense, ExpenseCategory } from '../types';
import { EXCHANGE_RATES } from '../constants';
import { fetchExchangeRate } from '../src/utils/currency';

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
        originalAmount: 0,
        originalCurrency: 'EUR',
        description: '',
        itemId: undefined,
    });
    const [currentRate, setCurrentRate] = useState<number>(1);
    const [isLoadingRate, setIsLoadingRate] = useState(false);

    useEffect(() => {
        if (expense) {
            setFormData({
                ...expense,
                originalAmount: expense.originalAmount || expense.amount,
                originalCurrency: expense.originalCurrency || expense.currency,
            });
            // Calculate implied rate from existing data
            if (expense.originalAmount && expense.amount) {
                setCurrentRate(expense.amount / expense.originalAmount);
            } else {
                setCurrentRate(1);
            }
        } else {
            setFormData({
                category: ExpenseCategory.FOOD,
                amount: 0,
                currency: 'TWD',
                originalAmount: 0,
                originalCurrency: 'EUR',
                description: '',
                itemId: undefined,
            });
            setCurrentRate(36.42); // Default EUR rate approx, will be updated by fetch if triggered or just use fallback
        }
    }, [expense, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.amount && formData.amount > 0) {
            // Ensure we save TWD as the main currency/amount
            onSave({
                ...formData,
                dayId,
                currency: 'TWD',
                // If original currency is TWD, ensure originalAmount matches amount
                originalAmount: formData.originalCurrency === 'TWD' ? formData.amount : formData.originalAmount,
                originalCurrency: formData.originalCurrency
            });
            onClose();
        }
    };

    const handleOriginalAmountChange = (val: number) => {
        setFormData({
            ...formData,
            originalAmount: val,
            amount: parseFloat((val * currentRate).toFixed(2))
        });
    };

    const handleOriginalCurrencyChange = async (currency: string) => {
        if (currency === 'TWD') {
            setCurrentRate(1);
            setFormData({
                ...formData,
                originalCurrency: currency,
                amount: formData.originalAmount
            });
            return;
        }

        setIsLoadingRate(true);
        try {
            const rate = await fetchExchangeRate(currency);
            setCurrentRate(rate);
            const currentOriginalAmount = formData.originalAmount || 0;
            setFormData({
                ...formData,
                originalCurrency: currency,
                amount: parseFloat((currentOriginalAmount * rate).toFixed(2))
            });
        } catch (error) {
            console.error('Failed to fetch rate', error);
            // Fallback to constant if fetch fails (handled in utility, but just in case)
        } finally {
            setIsLoadingRate(false);
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
                                金額 ({formData.originalCurrency})
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-jp-green/50"
                                value={formData.originalAmount || ''}
                                onChange={(e) => handleOriginalAmountChange(parseFloat(e.target.value) || 0)}
                                required
                            />
                        </div>
                        <div className="w-24">
                            <label className="block text-xs font-bold text-stone-500 uppercase mb-2">
                                幣別
                            </label>
                            <select
                                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-jp-green/50 bg-white"
                                value={formData.originalCurrency}
                                onChange={(e) => handleOriginalCurrencyChange(e.target.value)}
                            >
                                {Object.keys(EXCHANGE_RATES).map(curr => (
                                    <option key={curr} value={curr}>{curr}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Converted Amount Display */}
                    {formData.originalCurrency && (
                        <div className="bg-stone-100 p-3 rounded-lg flex justify-between items-center">
                            <span className="text-sm text-stone-500 flex items-center gap-2">
                                匯率: {isLoadingRate ? (
                                    <span className="animate-pulse">載入中...</span>
                                ) : (
                                    currentRate.toFixed(4)
                                )}
                            </span>
                            <span className="font-bold text-jp-green text-lg">
                                ≈ {formData.amount?.toFixed(0)} TWD
                            </span>
                        </div>
                    )}

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
