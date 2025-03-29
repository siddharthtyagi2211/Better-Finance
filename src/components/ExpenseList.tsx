import { useMemo } from "react";
import { Expense, Category } from "@/types/finance";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDistance } from "date-fns";
import { cn } from "@/lib/utils";

interface ExpenseListProps {
  expenses: Expense[];
  categories: Category[];
  limit?: number;
  onUpdateCategory?: (expenseId: string, newCategoryId: string) => void;
  showCategorySelect?: boolean;
}

const ExpenseList = ({ 
  expenses, 
  categories, 
  limit,
  onUpdateCategory,
  showCategorySelect = false
}: ExpenseListProps) => {
  const sortedExpenses = useMemo(() => {
    return [...expenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }, [expenses, limit]);

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "Unknown";
  };

  const getCategoryColor = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.color || "#888888";
  };

  const formatCurrency = (amount: number) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      signDisplay: 'never',
    }).format(Math.abs(amount));
    
    return amount >= 0 ? `+${formatted}` : `-${formatted}`;
  };

  const formatDateDistance = (dateString: string) => {
    return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {limit ? "Recent Transactions" : "All Expenses"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedExpenses.length > 0 ? (
          <div className="space-y-4">
            {sortedExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: getCategoryColor(expense.categoryId) }}
                  >
                    {getCategoryName(expense.categoryId).charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">
                      {expense.description || getCategoryName(expense.categoryId)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDateDistance(expense.date)} • {expense.paymentMethod}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {showCategorySelect && onUpdateCategory ? (
                    <Select
                      value={expense.categoryId}
                      onValueChange={(value) => onUpdateCategory(expense.id, value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue>{getCategoryName(expense.categoryId)}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center">
                              <span
                                className="w-2 h-2 rounded-full mr-2"
                                style={{ backgroundColor: category.color }}
                              />
                              {category.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="text-sm text-gray-600">
                      {getCategoryName(expense.categoryId)}
                    </span>
                  )}
                  <span className={cn(
                    "font-semibold",
                    expense.amount >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {formatCurrency(expense.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            No transactions recorded yet
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpenseList;
