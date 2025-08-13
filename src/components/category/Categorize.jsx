import { useState, useEffect } from "react";
import CategoryCard from "./CategoryCard.jsx";
import ItemCard from "./ItemCard.jsx";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ImagePlus, X, Save, Plus, Image } from "lucide-react";

export default function Categorize({ question, onSave }) {

    const [categories, setCategories] = useState(question.categories);
    const [newCategoryInput, setNewCategoryInput] = useState("");
    const [items, setItems] = useState(question.items);
    const [newItemName, setNewItemName] = useState("");
    const [newItemCategory, setNewItemCategory] = useState("");

    const [picture, setPicture] = useState(question.picture);
    const [isChanged, setIsChanged] = useState(false);

    const originalPicture = question.picture;

    useEffect(() => {
        const categoriesChanged =
            JSON.stringify(categories) !== JSON.stringify(question.categories);
        const itemsChanged =
            JSON.stringify(items) !== JSON.stringify(question.items);
        const pictureChanged = picture !== originalPicture;

        setIsChanged(categoriesChanged || itemsChanged || pictureChanged);
    }, [categories, items, picture, question]);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setPicture(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleRemovePicture = () => {
        setPicture("");
    };

    const deleteCategory = (cat) => {
        if (categories.length === 2) {
            toast.error("At least 2 categories required");
            return;
        }
        const updatedCategories = categories.filter((c) => c !== cat);
        setCategories(updatedCategories);

        const updatedItems = items.filter((item) => item.category !== cat);
        setItems(updatedItems);
    };

    const handleCategoryKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const trimmed = newCategoryInput.trim();
            if (!trimmed) {
                toast.error("Category name cannot be empty");
                return;
            }
            if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
                toast.error("Category name already exists");
                return;
            }
            setCategories([...categories, trimmed]);
            setNewCategoryInput("");
        }
    };

    const handleItemKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const trimmedName = newItemName.trim();
            if (!trimmedName) {
                toast.error("Item name cannot be empty");
                return;
            }
            if (!newItemCategory) {
                toast.error("Please select a category for the item");
                return;
            }
            const isDuplicateName = items.some(
                (item) => item.name.toLowerCase() === trimmedName.toLowerCase()
            );
            if (isDuplicateName) {
                toast.error("Item name already exists");
                return;
            }
            setItems([...items, { name: trimmedName, category: newItemCategory }]);
            setNewItemName("");
            setNewItemCategory("");
        }
    };

    const updateItem = (index, updatedItem) => {
        const newItems = [...items];
        newItems[index] = updatedItem;
        setItems(newItems);
    };

    const deleteItem = (index) => {
        if (items.length === 1) {
            toast.error("At least 1 item required");
            return;
        }
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        onSave(question.id, {
            ...question,
            categories,
            items,
            picture,
        });
        toast.success("Categorize question saved!");
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            {/* Header with Save Button */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-muted-foreground mt-1">
                        Configure categories and items for your categorization question
                    </p>
                </div>

            </div>

            <Separator />

            {/* Picture Upload Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Image className="h-5 w-5" />
                        Question Picture
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="hidden"
                            id="picture-upload"
                        />
                        <label htmlFor="picture-upload">
                            <Button variant="outline" className="gap-2 cursor-pointer" asChild>
                                <span>
                                    <ImagePlus className="h-4 w-4" />
                                    {picture ? 'Change Picture' : 'Upload Picture'}
                                </span>
                            </Button>
                        </label>
                        {picture && (
                            <Badge variant="secondary">Picture uploaded</Badge>
                        )}
                    </div>

                    {picture && (
                        <div className="relative max-w-md">
                            <div className="border rounded-lg p-3 bg-muted/30">
                                <img
                                    src={picture}
                                    alt="Question"
                                    className="rounded-md w-full object-contain max-h-60"
                                />
                                <Button
                                    onClick={handleRemovePicture}
                                    variant="destructive"
                                    size="sm"
                                    className="absolute -top-2 -right-2 h-8 w-8 rounded-full p-0"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Categories Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Categories</span>
                        <Badge variant="outline">{categories.length} categories</Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Manage the categories that items can be sorted into
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-3">
                        {categories.map((cat) => (
                            <CategoryCard key={cat} category={cat} onDelete={deleteCategory} />
                        ))}
                    </div>

                    <div className="flex gap-2 items-center pt-2">
                        <Plus className="h-4 w-4 text-muted-foreground" />
                        <Input
                            value={newCategoryInput}
                            onChange={(e) => setNewCategoryInput(e.target.value)}
                            onKeyDown={handleCategoryKeyDown}
                            onBlur={() => setNewCategoryInput("")}
                            placeholder="Add new category and press Enter"
                            className="flex-1"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Items Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Items</span>
                        <Badge variant="outline">{items.length} items</Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Add items that will be categorized in the question
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-3">
                        {items.map((item, index) => (
                            <ItemCard
                                key={index}
                                item={item}
                                categories={categories}
                                onChange={(updatedItem) => updateItem(index, updatedItem)}
                                onDelete={() => deleteItem(index)}
                            />
                        ))}
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex gap-2 items-center mb-2">
                            <Plus className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-muted-foreground">Add New Item</span>
                        </div>
                        <div className="flex gap-2" onKeyDown={handleItemKeyDown}>
                            <Input
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                placeholder="Item name"
                                className="flex-1"
                            />
                            <Select value={newItemCategory} onValueChange={setNewItemCategory}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Press Enter to add the item
                        </p>
                    </div>
                </CardContent>
            </Card>
            <Button
                onClick={handleSave}
                disabled={!isChanged}
                size="lg"
                className="gap-2"
            >
                <Save className="h-4 w-4" />
                Save Changes
            </Button>
        </div>
    );
}