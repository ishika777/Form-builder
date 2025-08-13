import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ShortTextQuestion = ({ question, onChange }) => {
    const [localAnswer, setLocalAnswer] = useState(question.answer);

    const [picture, setPicture] = useState(question.picture);
    const [isChanged, setIsChanged] = useState(false);

    const originalAnswer = question.answer;
    const originalPicture = question.picture;

    useEffect(() => {
        setLocalAnswer(question.answer);
        setPicture(question.picture);
        setIsChanged(false);
    }, [question]);

    useEffect(() => {
        const answerChanged = localAnswer.trim() !== originalAnswer.trim();
        const imageChanged = picture !== originalPicture;
        setIsChanged(answerChanged || imageChanged);
    }, [localAnswer, picture, originalAnswer, originalPicture]);

    const handleInputChange = (e) => {
        setLocalAnswer(e.target.value);
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
        setPicture("");
    };

    const handleSave = () => {
        if (!localAnswer.trim() && !picture) {
            toast.error("Answer text or image required!");
            return;
        }

        onChange({
            ...question,
            answer: localAnswer,
            picture: picture, // send preview/Base64/URL
        });

        toast.success("Answer saved!");
        setIsChanged(false);
    };

    return (
        <div className="space-y-6">
            {picture && (
                <div className="relative w-40 h-40 mx-auto group">
                    <img
                        src={picture}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg border shadow-sm"
                    />
                    <Button
                        variant="destructive"
                        size="icon"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                        ×
                    </Button>
                </div>
            )}

            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Expected Answer</label>
                <Input
                    placeholder="Type the expected short answer"
                    value={localAnswer}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border shadow-sm focus-visible:ring-2 focus-visible:ring-ring"
                />
            </div>

            <div className="flex items-center gap-3 pt-2">
                <label htmlFor="image-upload" className="flex-1">
                    <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-muted-foreground/50 hover:bg-muted/30 transition-colors cursor-pointer">
                        <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="text-sm text-muted-foreground font-medium">
                            {picture ? 'Change Image' : 'Upload Image'}
                        </span>
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
                    className="px-6 py-3"
                >
                    Save
                </Button>
            </div>
        </div>
    );
}

export default ShortTextQuestion;
