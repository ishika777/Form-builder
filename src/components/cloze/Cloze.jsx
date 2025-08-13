import React, { useRef, useState, useMemo, useCallback } from "react";
import { Underline, Save, RotateCcw, Image as ImageIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "../ui/button";

const Cloze = ({ question, onSave }) => {
    const inputRef = useRef(null);
    const [text, setText] = useState(question?.sentence || "");
    const [underlinedWords, setUnderlinedWords] = useState(question?.underlinedWords || []);
    const [selectedWord, setSelectedWord] = useState("");
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
    const [validationErrors, setValidationErrors] = useState([]);
    const [picture, setPicture] = useState(question?.picture || "");
    const [isDirty, setIsDirty] = useState(false);

    const validateQuestion = useCallback(() => {
        const errors = [];
        if (!text.trim()) errors.push("Question text cannot be empty");
        if (text.length > 500) errors.push("Question text is too long (max 500 chars)");
        if (underlinedWords.length === 0) errors.push("At least one blank required");
        if (underlinedWords.length > 10) errors.push("Too many blanks (max 10)");

        const sorted = [...underlinedWords].sort((a, b) => a.index - b.index);
        for (let i = 0; i < sorted.length - 1; i++) {
            if (sorted[i].index + sorted[i].length > sorted[i + 1].index) {
                errors.push("Blanks cannot overlap");
                break;
            }
        }

        underlinedWords.forEach((w, idx) => {
            if (w.length === 0) errors.push(`Blank ${idx + 1} is empty`);
            if (w.index < 0 || w.index >= text.length) errors.push(`Blank ${idx + 1} out of bounds`);
            const wordText = text.slice(w.index, w.index + w.length);
            if (!wordText.trim()) errors.push(`Blank ${idx + 1} only whitespace`);
        });

        setValidationErrors(errors);
        return errors.length === 0;
    }, [text, underlinedWords]);

    const hasChanges = useMemo(() => {
        if (!question) return text.trim() !== "" || underlinedWords.length > 0 || picture;
        if (text !== question.sentence) return true;
        if (picture !== (question.picture || "")) return true;
        if (underlinedWords.length !== question.underlinedWords.length) return true;
        return !underlinedWords.every(
            (w, i) => w.index === question.underlinedWords[i]?.index && w.length === question.underlinedWords[i]?.length
        );
    }, [text, underlinedWords, picture, question]);

    const getSelectedTextOrWord = () => {
        const input = inputRef.current;
        if (!input) return null;

        const val = input.value;
        let start = input.selectionStart;
        let end = input.selectionEnd;

        const selectedText = val.slice(start, end);
        if (start !== end && /\s/.test(selectedText)) {
            start = input.selectionStart;
            end = input.selectionStart;
        }

        while (start > 0 && /\S/.test(val[start - 1])) start--;
        while (end < val.length && /\S/.test(val[end])) end++;

        if (start === end) return null;

        return { start, end, word: val.slice(start, end) };
    };

    const handleUnderline = useCallback(() => {
        const sel = getSelectedTextOrWord();
        if (!sel || !sel.word.trim()) return toast.error("Select a valid word to underline!");

        const { start, end, word } = sel;

        if (underlinedWords.some(w => start >= w.index && start < w.index + w.length)) {
            return toast.error("Cannot underline inside an existing blank!");
        }
        if (underlinedWords.some(w => w.index === start && w.length === word.length)) {
            return toast.error("Word is already underlined!");
        }
        if (underlinedWords.some(w => start < w.index + w.length && end > w.index)) {
            return toast.error("Overlapping blanks not allowed!");
        }

        setUnderlinedWords(prev => [...prev, { index: start, length: word.length }]);
        setIsDirty(true);
        setShowContextMenu(false);
        toast.success(`"${word}" marked as blank!`);
    }, [underlinedWords]);

    const handleRemoveUnderline = idx => {
        setUnderlinedWords(prev => prev.filter((_, i) => i !== idx));
        setIsDirty(true);
        toast.success("Blank removed");
    };

    const handleClearAll = () => {
        setUnderlinedWords([]);
        setIsDirty(true);
        setShowContextMenu(false);
        toast.success("All blanks cleared");
    };

    const updateCursorAndSelection = () => {
        const sel = getSelectedTextOrWord();
        setSelectedWord(sel?.word || "");
    };

    const handleTextChange = e => {
        setText(e.target.value);
        setIsDirty(true);
        setTimeout(updateCursorAndSelection, 0);
    };

    const handleContextMenu = e => {
        e.preventDefault();
        const sel = getSelectedTextOrWord();
        if (sel) {
            setSelectedWord(sel.word);
            setContextMenuPos({ x: e.clientX, y: e.clientY });
            setShowContextMenu(true);
        }
    };

    const handlePictureChange = e => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPicture(reader.result);
                setIsDirty(true);
            };
            reader.readAsDataURL(file);
        } else {
            toast.error("Please select a valid image file");
        }
    };

    const removePicture = () => {
        setPicture("");
        setIsDirty(true);
    };

    const renderPreview = () => {
        if (!underlinedWords.length) return text;

        const sorted = [...underlinedWords].sort((a, b) => a.index - b.index);
        const elems = [];
        let currentIndex = 0;

        sorted.forEach(({ index, length }, i) => {
            if (currentIndex < index) elems.push(<span key={`text-${i}`}>{text.slice(currentIndex, index)}</span>);
            const word = text.slice(index, index + length);
            elems.push(
                <span
                    key={`blank-${i}`}
                    className="bg-yellow-200 border-b-2 border-dashed border-gray-400 px-1 font-semibold"
                    title={`Blank: "${word}"`}
                >
                    {"_".repeat(Math.max(word.length, 4))}
                </span>
            );
            currentIndex = index + length;
        });

        if (currentIndex < text.length) elems.push(<span key="end">{text.slice(currentIndex)}</span>);
        return elems;
    };

    const handleSave = () => {
        if (!validateQuestion()) {
            toast.error("Fix validation errors before saving!");
            return;
        }
        const data = {
            ...question,
            id: question?.id || `cloze-${Date.now()}`,
            sentence: text,
            underlinedWords,
            picture,
            type: "cloze",
            text: "cloze",
        };
        onSave?.(data);
        setIsDirty(false);
        toast.success("Cloze question saved!");
    };

    const isValid = validationErrors.length === 0;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6" onClick={() => showContextMenu && setShowContextMenu(false)}>
            {/* Text Input */}
            <textarea
                ref={inputRef}
                value={text}
                onChange={handleTextChange}
                onClick={updateCursorAndSelection}
                onKeyUp={updateCursorAndSelection}
                onMouseUp={updateCursorAndSelection}
                onSelect={updateCursorAndSelection}
                onContextMenu={handleContextMenu}
                placeholder="Enter your question text here..."
                className="w-full p-4 rounded-lg border border-gray-300 resize-y min-h-[100px] text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Picture Upload */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 font-medium text-gray-700">
                    <ImageIcon className="w-5 h-5" /> Add Picture (Optional)
                </label>
                <input type="file" accept="image/*" onChange={handlePictureChange} className="block" />
                {picture && (
                    <div className="relative w-full max-w-sm">
                        <img
                            src={picture}
                            alt="Preview"
                            className="rounded-lg border border-gray-300 shadow-sm w-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={removePicture}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Preview */}
            <div className="p-6 bg-white rounded-lg shadow border border-gray-200">
                {text ? (
                    <div className="text-lg leading-relaxed">{renderPreview()}</div>
                ) : (
                    <p className="italic text-gray-500">Enter question text to see preview</p>
                )}
            </div>

            {/* Underlined Words */}
            {underlinedWords.length > 0 && (
                <div className="bg-white rounded-lg shadow border border-gray-200 p-6 flex flex-wrap gap-2">
                    {underlinedWords.map((word, i) => (
                        <div
                            key={i}
                            className="relative group inline-flex items-center bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-sm font-medium pr-8 cursor-pointer hover:bg-gray-200"
                        >
                            {text.slice(word.index, word.index + word.length)}
                            <button
                                onClick={() => handleRemoveUnderline(i)}
                                title="Remove this blank"
                                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                type="button"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Context Menu */}
            <Popover open={showContextMenu} onOpenChange={setShowContextMenu}>
                <PopoverTrigger asChild>
                    <div
                        style={{
                            position: "fixed",
                            left: contextMenuPos.x,
                            top: contextMenuPos.y,
                            width: 1,
                            height: 1,
                            zIndex: 1000,
                        }}
                    />
                </PopoverTrigger>
                <PopoverContent
                    align="start"
                    side="bottom"
                    className="w-48 p-1"
                    style={{
                        left: Math.min(contextMenuPos.x, window.innerWidth - 200),
                        top: Math.min(contextMenuPos.y, window.innerHeight - 150),
                    }}
                >
                    <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleUnderline}>
                        <Underline className="w-4 h-4" /> Mark "{selectedWord}" as blank
                    </Button>
                </PopoverContent>
            </Popover>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-3">
                <Button
                    variant="default"
                    onClick={handleSave}
                    disabled={!isValid || !hasChanges}
                    className="flex items-center gap-2 px-6 py-3"
                >
                    <Save className="w-4 h-4" />
                    {hasChanges ? "Save Changes" : "Saved"}
                </Button>
                {underlinedWords.length > 0 && (
                    <Button
                        variant="destructive"
                        onClick={handleClearAll}
                        className="flex items-center gap-2 px-6 py-3"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Clear All Blanks
                    </Button>
                )}
            </div>
        </div>
    );
};

export default Cloze;
