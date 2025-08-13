import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, CheckCircle2, FileText, List, SquareCheck, Type } from "lucide-react";

const AddQuestionInComprehension = ({ onAdd }) => {
    const [open, setOpen] = useState(false);
    const [type, setType] = useState("");
    const [questionText, setQuestionText] = useState("");
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const questionTypes = [
        {
            value: "mcq",
            label: "Multiple Choice (Single Answer)",
            icon: <CheckCircle2 className="w-4 h-4" />,
            description: "One correct answer from multiple options"
        },
        {
            value: "mca",
            label: "Multiple Choice (Multiple Answers)",
            icon: <SquareCheck className="w-4 h-4" />,
            description: "Multiple correct answers possible"
        },
        {
            value: "short-text",
            label: "Short Text Answer",
            icon: <Type className="w-4 h-4" />,
            description: "Brief written response required"
        }
    ];

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleAdd();
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!type) {
            newErrors.type = "Please select a question type";
        }
        
        if (!questionText.trim()) {
            newErrors.questionText = "Please enter a question";
        } else if (questionText.trim().length < 10) {
            newErrors.questionText = "Question should be at least 10 characters long";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAdd = async () => {
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 300));
        
        onAdd({
            type,
            text: questionText.trim(),
        });
        
        setOpen(false);
        setType("");
        setQuestionText("");
        setErrors({});
        setIsSubmitting(false);
    };

    const handleOpenChange = (newOpen) => {
        if (!newOpen) {
            setErrors({});
            setType("");
            setQuestionText("");
        }
        setOpen(newOpen);
    };

    const selectedType = questionTypes.find(qt => qt.value === type);

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button 
                    variant="outline" 
                    className="mt-2 h-9 text-sm font-medium border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" /> 
                    Add Question
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[440px] p-0">
                <div className="px-6 pt-6 pb-4">
                    <DialogHeader className="space-y-1">
                        <DialogTitle className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                            <List className="w-5 h-5 text-neutral-600" />
                            Add Question
                        </DialogTitle>
                        <DialogDescription className="text-sm text-neutral-600">
                            Create a new question for your comprehension test.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="px-6 space-y-5">
                    {/* Question Type Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="question-type" className="text-sm font-medium text-neutral-700">
                            Question Type
                        </Label>
                        <Select
                            value={type}
                            onValueChange={(value) => {
                                setType(value);
                                setErrors(prev => ({ ...prev, type: undefined }));
                            }}
                        >
                            <SelectTrigger className={`h-10 ${errors.type ? 'border-red-300 focus:border-red-400' : 'border-neutral-200 focus:border-neutral-400'} transition-colors`}>
                                <SelectValue placeholder="Choose question type" />
                            </SelectTrigger>
                            <SelectContent>
                                {questionTypes.map((questionType) => (
                                    <SelectItem key={questionType.value} value={questionType.value} className="py-2.5">
                                        <div className="flex items-center gap-3">
                                            <div className="text-neutral-500">
                                                {questionType.icon}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium text-neutral-900 text-sm">{questionType.label}</div>
                                                <div className="text-xs text-neutral-500 leading-tight">{questionType.description}</div>
                                            </div>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.type && (
                            <p className="text-xs text-red-600">{errors.type}</p>
                        )}
                    </div>

                    {/* Selected Type Preview */}
                    {selectedType && (
                        <div className="bg-neutral-50 rounded-md p-3 border border-neutral-100">
                            <div className="flex items-center gap-2 text-sm">
                                <div className="text-neutral-500">
                                    {selectedType.icon}
                                </div>
                                <span className="font-medium text-neutral-700">{selectedType.label}</span>
                            </div>
                        </div>
                    )}

                    {/* Question Text Input */}
                    <div className="space-y-2">
                        <Label htmlFor="question-text" className="text-sm font-medium text-neutral-700">
                            Question Text
                        </Label>
                        <div className="relative">
                            <Input
                                id="question-text"
                                placeholder="Enter your question..."
                                value={questionText}
                                onChange={(e) => {
                                    setQuestionText(e.target.value);
                                    setErrors(prev => ({ ...prev, questionText: undefined }));
                                }}
                                onKeyDown={handleKeyDown}
                                className={`h-10 pr-12 ${errors.questionText ? 'border-red-300 focus:border-red-400' : 'border-neutral-200 focus:border-neutral-400'} transition-colors`}
                                maxLength={300}
                            />
                            {questionText.length > 0 && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-neutral-400">
                                    {questionText.length}/300
                                </div>
                            )}
                        </div>
                        {errors.questionText && (
                            <p className="text-xs text-red-600">{errors.questionText}</p>
                        )}
                        {questionText.length >= 10 && !errors.questionText && (
                            <p className="text-xs text-emerald-600 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Perfect
                            </p>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex gap-3 mt-6">
                    <Button 
                        variant="outline" 
                        onClick={() => setOpen(false)}
                        className="flex-1 h-9 text-sm border-neutral-200 hover:bg-white"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleAdd} 
                        className="flex-1 h-9 text-sm bg-neutral-900 hover:bg-neutral-800 text-white"
                        disabled={isSubmitting || !type || !questionText.trim()}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                                Adding...
                            </div>
                        ) : (
                            "Add Question"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddQuestionInComprehension;