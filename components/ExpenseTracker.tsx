
import React, { useState, useEffect } from 'react';
import { Expense, ExpenseCategory, DaySchedule } from '../types';
import { supabase } from '../src/lib/supabase';
import ExpenseModal from './ExpenseModal';

interface ExpenseTrackerProps {
    isOpen: boolean;
    onClose: () => void;
    schedule: DaySchedule[];
    activeDayId: string;
    isViewOnly?: boolean;
}

const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({
    isOpen,
    onClose,
    schedule,
    activeDayId,
    isViewOnly = false
}) => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'day' | 'category' | 'all'>('day');

    useEffect(() => {
        if (isOpen) {
            fetchExpenses();
        }
    }, [isOpen]);

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('expenses')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            const formattedExpenses: Expense[] = data.map((exp: any) => ({
                id: exp.id,
                dayId: exp.day_id,
                itemId: exp.item_id,
                category: exp.category as ExpenseCategory,
                amount: parseFloat(exp.amount),
                currency: exp.currency,
                description: exp.description,
                createdAt: exp.created_at,
            }));

            setExpenses(formattedExpenses);
        } catch (error) {
            console.error('Error fetching expenses:', error);
            alert('無法載入支出資料');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveExpense = async (expenseData: Partial<Expense>) => {
        try {
            if (editingExpense) {
                // Update existing expense
                const { error } = await supabase
                    .from('expenses')
                    .update({
                        category: expenseData.category,
                        amount: expenseData.amount,
                        currency: expenseData.currency,
                        description: expenseData.description,
                        item_id: expenseData.itemId,
                    })
                    .eq('id', editingExpense.id);

                if (error) throw error;
            } else {
                // Create new expense
                const newId = `exp-${Date.now()}`;
                const { error } = await supabase.from('expenses').insert({
                    id: newId,
                    day_id: expenseData.dayId,
                    item_id: expenseData.itemId,
                    category: expenseData.category,
                    amount: expenseData.amount,
                    currency: expenseData.currency,
                    description: expenseData.description,
                });

                if (error) throw error;
            }

            fetchExpenses();
            setEditingExpense(undefined);
        } catch (error) {
            console.error('Error saving expense:', error);
            alert('儲存失敗');
        }
    };

    const handleDeleteExpense = async (expenseId: string) => {
        if (!window.confirm('確定要刪除此支出嗎？')) return;

        try {
            const { error } = await supabase.from('expenses').delete().eq('id', expenseId);
            if (error) throw error;
            fetchExpenses();
        } catch (error) {
            console.error('Error deleting expense:', error);
            alert('刪除失敗');
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

    const getFilteredExpenses = () => {
        if (viewMode === 'day') {
            return expenses.filter(exp => exp.dayId === activeDayId);
        } else if (viewMode === 'all') {
            return expenses;
        }
        return expenses;
    };

    const groupExpensesByCategory = (exps: Expense[]) => {
        const grouped: Record<ExpenseCategory, Expense[]> = {
            [ExpenseCategory.FOOD]: [],
            [ExpenseCategory.TRANSPORT]: [],
            [ExpenseCategory.ACCOMMODATION]: [],
            [ExpenseCategory.ACTIVITY]: [],
            [ExpenseCategory.SHOPPING]: [],
            [ExpenseCategory.OTHER]: [],
        };

        exps.forEach(exp => {
            grouped[exp.category].push(exp);
        });

        return grouped;
    };

    const calculateTotal = (exps: Expense[], currency?: string) => {
        return exps
            .filter(exp => !currency || exp.currency === currency)
            .reduce((sum, exp) => sum + exp.amount, 0);
    };

    const getCurrencies = (exps: Expense[]) => {
        return [...new Set(exps.map(exp => exp.currency))];
    };

    if (!isOpen) return null;

    const filteredExpenses = getFilteredExpenses();
    const currencies = getCurrencies(filteredExpenses);
    const activeDay = schedule.find(d => d.id === activeDayId);
    const itemOptions = activeDay?.items.map(item => ({ id: item.id, title: item.title })) || [];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                {/* Header */}
                <div className="bg-jp-green px-6 py-4 flex justify-between items-center text-white shrink-0">
                    <div>
                        <h3 className="font-serif font-bold text-xl">記帳本</h3>
                        <p className="text-sm opacity-90 mt-0.5">追蹤旅行支出</p>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* View Mode Tabs */}
                <div className="border-b border-stone-200 px-6 pt-4 shrink-0">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('day')}
                            className={`px-4 py-2 rounded-t-lg font-bold text-sm transition-colors ${viewMode === 'day'
                                    ? 'bg-white text-jp-green border-b-2 border-jp-green'
                                    : 'text-stone-500 hover:text-stone-700'
                                }`}
                        >
                            當日支出
                        </button>
                        <button
                            onClick={() => setViewMode('category')}
                            className={`px-4 py-2 rounded-t-lg font-bold text-sm transition-colors ${viewMode === 'category'
                                    ? 'bg-white text-jp-green border-b-2 border-jp-green'
                                    : 'text-stone-500 hover:text-stone-700'
                                }`}
                        >
                            分類統計
                        </button>
                        <button
                            onClick={() => setViewMode('all')}
                            className={`px-4 py-2 rounded-t-lg font-bold text-sm transition-colors ${viewMode === 'all'
                                    ? 'bg-white text-jp-green border-b-2 border-jp-green'
                                    : 'text-stone-500 hover:text-stone-700'
                                }`}
                        >
                            全部支出
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="text-center py-10 text-stone-400">載入中...</div>
                    ) : filteredExpenses.length === 0 ? (
                        <div className="text-center py-10 text-stone-400">
                            尚無支出記錄
                        </div>
                    ) : viewMode === 'category' ? (
                        // Category View
                        <div className="space-y-4">
                            {Object.entries(groupExpensesByCategory(filteredExpenses)).map(([category, exps]) => {
                                if (exps.length === 0) return null;
                                const cat = category as ExpenseCategory;
                                return (
                                    <div key={category} className="bg-stone-50 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-2xl">{getCategoryIcon(cat)}</span>
                                            <h4 className="font-bold text-lg">{getCategoryLabel(cat)}</h4>
                                            <span className="ml-auto text-sm text-stone-500">
                                                {exps.length} 筆
                                            </span>
                                        </div>
                                        {getCurrencies(exps).map(curr => (
                                            <div key={curr} className="text-right text-jp-green font-bold">
                                                {calculateTotal(exps, curr).toFixed(2)} {curr}
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        // List View
                        <div className="space-y-3">
                            {filteredExpenses.map((expense) => (
                                <div key={expense.id} className="bg-stone-50 rounded-lg p-4 hover:bg-stone-100 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3 flex-1">
                                            <span className="text-2xl">{getCategoryIcon(expense.category)}</span>
                                            <div className="flex-1">
                                                <div className="font-bold text-stone-800">{getCategoryLabel(expense.category)}</div>
                                                {expense.description && (
                                                    <p className="text-sm text-stone-600 mt-1">{expense.description}</p>
                                                )}
                                                <p className="text-xs text-stone-400 mt-1">
                                                    {new Date(expense.createdAt).toLocaleDateString('zh-TW')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <div className="font-bold text-lg text-jp-green">
                                                    {expense.amount.toFixed(2)}
                                                </div>
                                                <div className="text-xs text-stone-500">{expense.currency}</div>
                                            </div>
                                            {!isViewOnly && (
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => {
                                                            setEditingExpense(expense);
                                                            setIsExpenseModalOpen(true);
                                                        }}
                                                        className="p-1.5 hover:bg-stone-200 rounded-full transition-colors"
                                                        title="編輯"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-stone-600">
                                                            <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteExpense(expense.id)}
                                                        className="p-1.5 hover:bg-red-100 rounded-full transition-colors"
                                                        title="刪除"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-red-600">
                                                            <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer with Total */}
                <div className="border-t border-stone-200 px-6 py-4 bg-stone-50 shrink-0">
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="text-xs text-stone-500 uppercase font-bold">總支出</div>
                            <div className="flex gap-4 mt-1">
                                {currencies.map(curr => (
                                    <div key={curr} className="font-bold text-xl text-jp-green">
                                        {calculateTotal(filteredExpenses, curr).toFixed(2)} {curr}
                                    </div>
                                ))}
                            </div>
                        </div>
                        {!isViewOnly && (
                            <button
                                onClick={() => {
                                    setEditingExpense(undefined);
                                    setIsExpenseModalOpen(true);
                                }}
                                className="px-4 py-2 bg-jp-green text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                            >
                                + 新增支出
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Expense Modal */}
            <ExpenseModal
                isOpen={isExpenseModalOpen}
                onClose={() => {
                    setIsExpenseModalOpen(false);
                    setEditingExpense(undefined);
                }}
                onSave={handleSaveExpense}
                dayId={activeDayId}
                expense={editingExpense}
                itemOptions={itemOptions}
            />
        </div>
    );
};

export default ExpenseTracker;
