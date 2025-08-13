import React, { useState, useMemo } from "react";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import AddQuestionInComprehension from "./AddQuestionInComprehesion";
import MCQQuestion from "./MCQQuestion";
import MCAQuestion from "./MCAQuestion";
import ShortTextQuestion from "./ShortTextQuestion";
import { nanoid } from "nanoid";
import SortableList from "@/SortableList";
import { 
    GripVertical, 
    FileText, 
    CheckCircle2, 
    SquareCheck, 
    Type, 
    AlertCircle,
    Save
} from "lucide-react";
import { toast } from "sonner";

const Comprehension = ({ question, onSave }) => {
    const [questions, setQuestions] = useState(question.questions);
    const [comprehensionText, setComprehensionText] = useState(question.comprehension);
    const [isSaving, setIsSaving] = useState(false);

    const addQuestion = ({ type, text }) => {
        let newQuestion;
        const baseQuestion = {
            id: nanoid(),
            type,
            text,
            picture: null,
        };

        if (type === "mcq") {
            newQuestion = {
                ...baseQuestion,
                options: Array(4).fill().map(() => ({ id: nanoid(), label: "" })),
                correctAnswer: null,
            };
        } else if (type === "mca") {
            newQuestion = {
                ...baseQuestion,
                options: Array(4).fill().map(() => ({ id: nanoid(), label: "" })),
                correctAnswers: [],
            };
        } else if (type === "short-text") {
            newQuestion = { ...baseQuestion, answer: "" };
        }
        setQuestions((prev) => [...prev, newQuestion]);
        toast.success("Question added successfully!");
    };

    const updateQuestion = (index, updated) => {
        const newQuestions = [...questions];
        newQuestions[index] = updated;
        setQuestions(newQuestions);
    };

    const handleOrderChange = (newQuestions) => {
        setQuestions(newQuestions);
    };

    const hasChanges = useMemo(() => {
        return (
            comprehensionText.trim() !== question.comprehension.trim() ||
            JSON.stringify(questions) !== JSON.stringify(question.questions)
        );
    }, [comprehensionText, questions, question]);

    const handleSave = async () => {
        if (!comprehensionText.trim()) {
            toast.error("Comprehension text cannot be empty");
            return;
        }
        if (questions.length === 0) {
            toast.error("Please add at least one question");
            return;
        }

        setIsSaving(true);
        
        // Simulate save operation
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const updatedQues = {
            ...question,
            comprehension: comprehensionText.trim(),
            questions,
        };
        onSave(question.id, updatedQues);
        toast.success("Comprehension question saved!");
        setIsSaving(false);
    };

    const getQuestionIcon = (type) => {
        switch (type) {
            case "mcq":
                return <CheckCircle2 className="w-4 h-4 text-blue-600" />;
            case "mca":
                return <SquareCheck className="w-4 h-4 text-green-600" />;
            case "short-text":
                return <Type className="w-4 h-4 text-purple-600" />;
            default:
                return <FileText className="w-4 h-4 text-neutral-500" />;
        }
    };

    const getQuestionTypeName = (type) => {
        switch (type) {
            case "mcq":
                return "Multiple Choice (Single)";
            case "mca":
                return "Multiple Choice (Multiple)";
            case "short-text":
                return "Short Text";
            default:
                return "Unknown";
        }
    };

    return (
        <div className="space-y-6">
            {/* Comprehension Text Section */}
            <Card className="border-neutral-200">
                <CardContent className="p-5">
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold text-neutral-800 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Comprehension Passage
                        </Label>
                        <Textarea
                            value={comprehensionText}
                            onChange={(e) => setComprehensionText(e.target.value)}
                            placeholder="Enter the comprehension passage that students will read before answering questions..."
                            rows={5}
                            className="resize-none border-neutral-200 focus:border-neutral-400 text-sm leading-relaxed"
                        />
                        <div className="flex items-center justify-between text-xs text-neutral-500">
                            <span>This passage will be shown to students before the questions</span>
                            <span>{comprehensionText.length} characters</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Questions Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-neutral-800">
                        Questions ({questions.length})
                    </h3>
                    {questions.length === 0 && (
                        <div className="flex items-center gap-1 text-xs text-amber-600">
                            <AlertCircle className="w-3 h-3" />
                            Add at least one question
                        </div>
                    )}
                </div>

                {questions.length > 0 ? (
                    <SortableList
                        items={questions}
                        onOrderChange={handleOrderChange}
                        dragHandle={<GripVertical className="w-4 h-4 text-neutral-400 hover:text-neutral-600 cursor-grab" />}
                        renderItem={(questionItem, index) => (
                            <Card key={questionItem.id} className="border-neutral-200 hover:shadow-sm transition-shadow">
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value={questionItem.id} className="border-none">
                                        <AccordionTrigger className="px-5 py-4 hover:no-underline">
                                            <div className="flex items-center gap-3 text-left">
                                                {getQuestionIcon(questionItem.type)}
                                                <div className="flex-1">
                                                    <div className="font-medium text-neutral-800 text-sm">
                                                        {questionItem.text || "Untitled Question"}
                                                    </div>
                                                    <div className="text-xs text-neutral-500 mt-1">
                                                        {getQuestionTypeName(questionItem.type)} • Question {index + 1}
                                                    </div>
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="px-5 pb-5">
                                            <div className="space-y-4 pt-2">
                                                <div>
                                                    <Label className="text-sm font-medium text-neutral-700 mb-2 block">
                                                        Question Text
                                                    </Label>
                                                    <Input
                                                        placeholder="Enter your question..."
                                                        value={questionItem.text}
                                                        onChange={(e) => {
                                                            if (e.target.value === "") {
                                                                toast.error("Question text can't be empty!");
                                                                return;
                                                            }
                                                            updateQuestion(index, { ...questionItem, text: e.target.value });
                                                        }}
                                                        className="border-neutral-200 focus:border-neutral-400"
                                                    />
                                                </div>

                                                <div className="border-t border-neutral-100 pt-4">
                                                    {questionItem.type === "mcq" && (
                                                        <MCQQuestion
                                                            question={questionItem}
                                                            onChange={(updated) => updateQuestion(index, updated)}
                                                        />
                                                    )}
                                                    {questionItem.type === "mca" && (
                                                        <MCAQuestion
                                                            question={questionItem}
                                                            onChange={(updated) => updateQuestion(index, updated)}
                                                        />
                                                    )}
                                                    {questionItem.type === "short-text" && (
                                                        <ShortTextQuestion
                                                            question={questionItem}
                                                            onChange={(updated) => updateQuestion(index, updated)}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </Card>
                        )}
                    />
                ) : (
                    <Card className="border-neutral-200 border-dashed">
                        <CardContent className="p-8 text-center">
                            <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                            <h4 className="font-medium text-neutral-600 mb-1">No questions yet</h4>
                            <p className="text-sm text-neutral-500 mb-4">
                                Add your first question to get started with this comprehension test.
                            </p>
                        </CardContent>
                    </Card>
                )}

                <AddQuestionInComprehension onAdd={addQuestion} />
            </div>

            {/* Save Section */}
            <Card className="border-neutral-200 bg-neutral-50">
                <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-neutral-600">
                            {hasChanges ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    Unsaved changes
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    All changes saved
                                </span>
                            )}
                        </div>
                        <Button
                            onClick={handleSave}
                            disabled={!hasChanges || isSaving}
                            className={`h-9 ${
                                hasChanges 
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
                                    Save Changes
                                </div>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Comprehension;