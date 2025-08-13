import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
    GripVertical,
    ImageIcon,
    ImagePlus,
    X,
    CheckCircle2,
    Save
} from "lucide-react";

import SortableList from "@/SortableList";
import { toast } from "sonner";

const MCAQuestion = ({ question, onChange }) => {
    const [localQuestion, setLocalQuestion] = useState(question);
    const [isChanged, setIsChanged] = useState(false);
    const [picture, setPicture] = useState(question.picture);
    const [isSaving, setIsSaving] = useState(false);

    const { options = [], correctAnswers = [] } = localQuestion;
    const originalQuestion = question;
    const originalPicture = question.picture;

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

    const handleCheckboxChange = (id, checked) => {
        const updatedAnswers = checked
            ? correctAnswers.includes(id)
                ? correctAnswers
                : [...correctAnswers, id]
            : correctAnswers.filter((ansId) => ansId !== id);
        setLocalQuestion({ ...localQuestion, correctAnswers: updatedAnswers });
    };

    const handleOrderChange = (newOptions) => {
        setLocalQuestion({ ...localQuestion, options: newOptions });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast.error("Image size should be less than 5MB");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setPicture(reader.result);
            toast.success("Image uploaded successfully");
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setPicture("");
        setIsChanged(true);
        toast.success("Image removed");
    };

    const handleSave = async () => {
        // Validation
        for (const option of localQuestion.options) {
            if (!option.label.trim()) {
                toast.error("All option labels must be filled");
                return;
            }
        }

        const labels = localQuestion.options.map((opt) =>
            opt.label.trim().toLowerCase()
        );
        if (new Set(labels).size !== labels.length) {
            toast.error("All option labels must be unique");
            return;
        }

        if (localQuestion.correctAnswers.length === 0) {
            toast.error("Please select at least one correct answer");
            return;
        }

        setIsSaving(true);

        // Simulate async save
        await new Promise(resolve => setTimeout(resolve, 300));

        onChange({
            ...localQuestion,
            picture,
        });

        setIsChanged(false);
        setIsSaving(false);
        toast.success("Question saved successfully!");
    };

    const getValidationStatus = () => {
        const emptyOptions = options.filter(opt => !opt.label.trim()).length;
        const hasCorrectAnswers = correctAnswers.length > 0;

        if (emptyOptions > 0) return { type: 'error', message: `${emptyOptions} empty options` };
        if (!hasCorrectAnswers) return { type: 'error', message: 'No correct answers selected' };
        return { type: 'success', message: 'All validations passed' };
    };

    const validationStatus = getValidationStatus();

    return (
        <div className="space-y-5">
            {/* Image Section */}
            <Card className="border-neutral-200">
                <CardContent className="p-4">
                    {picture ? (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium text-neutral-700 flex items-center gap-2">
                                    <ImageIcon  className="w-4 h-4" />
                                    Question Image
                                </Label>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleRemoveImage}
                                    className="h-8 w-8 p-0 text-neutral-500 hover:text-red-600 hover:bg-red-50"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="relative bg-neutral-50 rounded-lg p-3 border border-neutral-200">
                                <img
                                    src={picture}
                                    alt="Question preview"
                                    className="w-full h-32 object-cover rounded-md"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <Label className="text-sm font-medium text-neutral-700 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" />
                                Question Image (Optional)
                            </Label>
                            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-neutral-200 border-dashed rounded-lg cursor-pointer bg-neutral-50 hover:bg-neutral-100 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-2 pb-3">
                                    <ImagePlus className="w-6 h-6 mb-1 text-neutral-400" />
                                    <p className="text-xs text-neutral-500">Click to upload image</p>
                                    <p className="text-xs text-neutral-400">Max 5MB</p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Options Section */}
            <Card className="border-neutral-200">
                <CardContent className="p-4">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium text-neutral-700">
                                Answer Options
                            </Label>
                            <div className="text-xs text-neutral-500">
                                Select multiple correct answers
                            </div>
                        </div>

                        <SortableList
                            items={options}
                            onOrderChange={handleOrderChange}
                            dragHandle={<GripVertical className="w-4 h-4 text-neutral-400 hover:text-neutral-600 cursor-grab" />}
                            renderItem={(item, idx) => (
                                <div key={item.id} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                                    <Checkbox
                                        id={`mca-${item.id}`}
                                        checked={correctAnswers.includes(item.id)}
                                        onCheckedChange={(checked) => handleCheckboxChange(item.id, checked)}
                                        className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                    />
                                    <div className="flex-1">
                                        <Input
                                            value={item.label}
                                            onChange={(e) => handleOptionChange(item.id, e.target.value)}
                                            placeholder={`Option ${idx + 1}`}
                                            className="h-9 border-neutral-200 focus:border-neutral-400 bg-white"
                                        />
                                    </div>
                                    <div className="text-xs text-neutral-400 min-w-[60px] text-center">
                                        {correctAnswers.includes(item.id) && (
                                            <span className="text-green-600 font-medium">Correct</span>
                                        )}
                                    </div>
                                </div>
                            )}
                        />

                        {/* Selected Answers Summary */}
                        {correctAnswers.length > 0 && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    <span className="font-medium text-green-800">
                                        {correctAnswers.length} correct answer{correctAnswers.length > 1 ? 's' : ''} selected
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Validation & Save Section */}
            <Card className="border-neutral-200 bg-neutral-50">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                            {validationStatus.type === 'error' ? (
                                <>
                                    <AlertCircle className="w-4 h-4 text-amber-600" />
                                    <span className="text-amber-700">{validationStatus.message}</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    <span className="text-green-700">{validationStatus.message}</span>
                                </>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {isChanged && (
                                <div className="flex items-center gap-1 text-xs text-neutral-600">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    Unsaved changes
                                </div>
                            )}
                            <Button
                                onClick={handleSave}
                                disabled={!isChanged || validationStatus.type === 'error' || isSaving}
                                className={`h-9 ${isChanged && validationStatus.type === 'success'
                                        ? "bg-neutral-900 hover:bg-neutral-800 text-white"
                                        : "bg-neutral-200 text-neutral-500 cursor-not-allowed"
                                    }`}
                            >
                                {isSaving ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                                        Saving...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Save className="w-4 h-4" />
                                        Save Question
                                    </div>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default MCAQuestion;