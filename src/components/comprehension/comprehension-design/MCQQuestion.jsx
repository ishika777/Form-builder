import React, { useState, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { GripVertical } from "lucide-react";
import SortableList from "@/SortableList";
import { toast } from "sonner";
import { Button } from "../../ui/button";

const MCQQuestion = ({ question, onChange }) => {
    const [localQuestion, setLocalQuestion] = useState(question);

    const [picture, setPicture] = useState(question.picture);
    const [isChanged, setIsChanged] = useState(false);

    const { options = [], correctAnswer } = localQuestion;

    const originalQuestion = question;
    const originalPicture = question.picture;

    // Check for changes in options, correctAnswer, or image
    const checkChanges = () => {
        return (
            JSON.stringify(localQuestion) !== JSON.stringify(originalQuestion) ||
            picture !== originalPicture

        );
    };

    useEffect(() => {
        setIsChanged(checkChanges());
    }, [localQuestion, picture]);

    const handleOptionChange = (id, value) => {
        const newOptions = options.map((opt) =>
            opt.id === id ? { ...opt, label: value } : opt
        );
        setLocalQuestion({ ...localQuestion, options: newOptions });
    };

    const handleCorrectAnswerChange = (value) => {
        const newIndex = options.findIndex((opt) => opt.id === value);
        if (newIndex !== -1) {
            setLocalQuestion({ ...localQuestion, correctAnswer: newIndex });
        }
    };

    const handleOrderChange = (newOptions) => {
        const oldCorrectId = options[correctAnswer]?.id;
        const newCorrectIndex = newOptions.findIndex((opt) => opt.id === oldCorrectId);
        setLocalQuestion({
            ...localQuestion,
            options: newOptions,
            correctAnswer: newCorrectIndex,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setPicture(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setPicture(null);
        setIsChanged(true);
    };

    const handleSave = () => {
        for (const option of localQuestion.options) {
            if (!option.label.trim()) {
                toast.error("Option labels cannot be empty");
                return;
            }
        }

        const labels = localQuestion.options.map((opt) => opt.label.trim().toLowerCase());
        if (new Set(labels).size !== labels.length) {
            toast.error("Option labels must be unique");
            return;
        }

        if (localQuestion.correctAnswer === null || localQuestion.correctAnswer === undefined) {
            toast.error("Please select a correct answer");
            return;
        }

        onChange({
            ...localQuestion,
            picture,
        });

        setIsChanged(false);
        toast.success("MCQ saved!");
    };

    return (
        <div className="space-y-8 p-6 bg-card rounded-xl border shadow-lg">
            {picture && (
                <div className="relative w-48 h-48 mx-auto group">
                    <div className="w-full h-full rounded-xl overflow-hidden border-2 border-border shadow-md">
                        <img
                            src={picture}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <Button
                        variant="destructive"
                        size="icon"
                        onClick={handleRemoveImage}
                        className="absolute -top-3 -right-3 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:scale-110"
                    >
                        ×
                    </Button>
                </div>
            )}

            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-6">
                    <h3 className="text-sm font-semibold text-foreground">Answer Options</h3>
                    <div className="px-2 py-1 bg-muted rounded-full">
                        <span className="text-xs text-muted-foreground">Select correct answer</span>
                    </div>
                </div>

                <RadioGroup
                    value={options[correctAnswer]?.id || ""}
                    onValueChange={handleCorrectAnswerChange}
                    className="space-y-4"
                >
                    <SortableList
                        items={options}
                        onOrderChange={handleOrderChange}
                        dragHandle={<GripVertical size={18} className="text-muted-foreground hover:text-foreground transition-colors cursor-grab active:cursor-grabbing" />}
                        renderItem={(item, idx) => (
                            <div key={item.id} className="group relative">
                                <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-border bg-background hover:bg-muted/30 hover:border-primary/20 transition-all duration-200 shadow-sm hover:shadow-md">
                                    <RadioGroupItem
                                        value={item.id}
                                        id={`mcq-${item.id}`}
                                        className="data-[state=checked]:border-primary data-[state=checked]:text-primary"
                                    />
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold shrink-0 group-hover:bg-primary/15 transition-colors">
                                        {String.fromCharCode(65 + idx)}
                                    </div>
                                    <Input
                                        value={item.label}
                                        onChange={(e) => handleOptionChange(item.id, e.target.value)}
                                        placeholder={`Enter option ${String.fromCharCode(65 + idx)}`}
                                        className="flex-1 border-0 bg-transparent text-base focus-visible:ring-2 focus-visible:ring-primary/20 placeholder:text-muted-foreground/60"
                                    />
                                </div>
                            </div>
                        )}
                    />
                </RadioGroup>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-border">
                <label htmlFor="image-upload" className="flex-1">
                    <div className="group flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed border-muted-foreground/30 rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-pointer">
                        <div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                            <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <span className="block text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                {picture ? 'Change Image' : 'Add Image'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                PNG, JPG up to 10MB
                            </span>
                        </div>
                    </div>
                </label>
                <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                />

                <Button
                    onClick={handleSave}
                    disabled={!isChanged}
                    variant={isChanged ? "default" : "secondary"}
                    size="lg"
                    className="px-8 py-4 font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                >
                    {isChanged ? 'Save Changes' : 'Saved'}
                </Button>
            </div>

            {isChanged && (
                <div className="flex justify-center pt-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full">
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-amber-700">Unsaved changes</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MCQQuestion;
