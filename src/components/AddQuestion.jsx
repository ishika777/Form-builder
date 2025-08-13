import React, { useState } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const AddQuestion = ({ onAdd }) => {
    const [open, setOpen] = useState(false);
    const [questionType, setQuestionType] = useState("");
    const [questionText, setQuestionText] = useState("");

    const handleAdd = () => {
        if (!questionType) {
            toast.error("Add a category first");
            return;
        }
        if (!questionText.trim()) {
            toast.error("Add a question");
            return;
        }
        onAdd(questionType, questionText);
        setQuestionType("");
        setQuestionText("");
        setOpen(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAdd();
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="border-2 border-green-300 text-green-700 hover:bg-green-50 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Question
                    </div>
                </Button>
            </DialogTrigger>

            <DialogContent
                onKeyDown={handleKeyDown}
                className="w-full max-w-md bg-white rounded-lg shadow-lg p-6"
            >
                {/* Header */}
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-xl font-bold text-gray-800">
                        Add New Question
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 text-sm">
                        Select the question type and enter the question content.
                    </DialogDescription>
                </DialogHeader>

                {/* Question Type */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Question Type
                    </label>
                    <Select onValueChange={setQuestionType} value={questionType}>
                        <SelectTrigger className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500">
                            <SelectValue placeholder="Choose question type..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 rounded-lg">
                            <SelectItem value="categorize">Categorize</SelectItem>
                            <SelectItem value="cloze">Cloze</SelectItem>
                            <SelectItem value="comprehension">Comprehension</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Question Text */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Question Content
                    </label>
                    <Input
                        placeholder="Enter your question text..."
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    />
                </div>

                {/* Footer */}
                <DialogFooter className="flex justify-end gap-3">
                    <Button
                        variant="ghost"
                        onClick={() => setOpen(false)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAdd}
                        disabled={!questionType || !questionText.trim()}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Add Question
                        </div>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );

}

export default AddQuestion;
