import { X, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function CategoryCard({ category, onDelete }) {
    return (
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg hover:shadow-md transition-all duration-200 group">
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Tag className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                    <Badge variant="secondary" className="bg-white/80 text-blue-800 font-medium px-3 py-1">
                        {category}
                    </Badge>
                </div>
            </div>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(category)}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all duration-200"
                aria-label={`Delete category ${category}`}
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
    );
}