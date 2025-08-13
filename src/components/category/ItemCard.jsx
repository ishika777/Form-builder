import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Package, Tag } from "lucide-react";

export default function ItemCard({ item, categories, onChange, onDelete }) {
    return (
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 group">
            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                <Package className="h-4 w-4 text-gray-600" />
            </div>
            
            <div className="flex-1 space-y-2">
                <Input
                    value={item.name}
                    onChange={(e) => onChange({ ...item, name: e.target.value })}
                    placeholder="Item name"
                    className="bg-white/80 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                />
                
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium">Category:</span>
                    <Select
                        value={item.category}
                        onValueChange={(value) => onChange({ ...item, category: value })}
                    >
                        <SelectTrigger className="w-[160px] h-8 bg-white/80 border-gray-200 text-sm">
                            <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((cat) => (
                                <SelectItem key={cat} value={cat} className="text-sm">
                                    <div className="flex items-center gap-2">
                                        <Tag className="h-3 w-3 text-blue-500" />
                                        {cat}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {item.category && (
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            {item.category}
                        </Badge>
                    )}
                </div>
            </div>

            <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                aria-label={`Delete item ${item.name}`}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all duration-200"
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
    );
}