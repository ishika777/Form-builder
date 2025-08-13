import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const QuestionRenderer = ({ question, answer, onAnswerChange }) => {
    // Helper to safely get value for MCAQ
    const selected = Array.isArray(answer) ? answer : [];

    return (
        <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white/90">
            {/* Subtle hover effect border */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <CardHeader className="relative pb-4">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-sm group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors duration-300">
                        <svg className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-900 leading-tight flex-1">
                        {question.title || question.text}
                    </CardTitle>
                </div>
            </CardHeader>

            {question.picture && (
                <div className="px-6 pb-4">
                    <div className="relative rounded-xl overflow-hidden shadow-md bg-gray-50">
                        <img
                            src={question.picture}
                            alt="Question"
                            className="w-full max-h-60 object-contain hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none" />
                    </div>
                </div>
            )}

            <CardContent className="relative">
                {question.type === "short-text" ? (
                    <div className="relative">
                        <textarea
                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder-gray-400 text-gray-900 leading-relaxed resize-none hover:border-gray-300"
                            placeholder="Share your thoughts here..."
                            value={answer}
                            onChange={(e) => onAnswerChange(e.target.value)}
                            rows={6}
                        />
                        <div className="absolute bottom-3 right-3 text-xs text-gray-400 pointer-events-none">
                            {answer?.length || 0} characters
                        </div>
                    </div>
                ) : question.type === "mcq" ? (
                    <RadioGroup
                        value={answer || ""}
                        onValueChange={onAnswerChange}
                        className="space-y-3"
                    >
                        {question.options.map((option, idx) => (
                            <div key={option.id} className="group/option relative">
                                <div className="flex items-center space-x-4 p-3 rounded-lg border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200 cursor-pointer">
                                    <RadioGroupItem
                                        value={option.id}
                                        id={`${question.text}-${idx}`}
                                        className="border-2 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 group-hover/option:border-blue-400"
                                    />
                                    <Label
                                        htmlFor={`${question.text}-${idx}`}
                                        className="flex-1 cursor-pointer text-gray-700 group-hover/option:text-gray-900 font-medium"
                                    >
                                        {option.label}
                                    </Label>
                                    {answer === option.id && (
                                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </RadioGroup>
                ) : question.type === "mca" ? (
                    <div className="space-y-3">
                        {question.options.map((option, idx) => (
                            <div key={option.id} className="group/option relative">
                                <div className="flex items-center space-x-4 p-3 rounded-lg border-2 border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-200 cursor-pointer">
                                    <Checkbox
                                        id={`${question.text}-${idx}`}
                                        checked={selected.includes(option.id)}
                                        onCheckedChange={(checked) => {
                                            if (checked) onAnswerChange([...selected, option.id]);
                                            else onAnswerChange(selected.filter(v => v !== option.id));
                                        }}
                                        className="border-2 border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:ring-2 group-hover/option:border-indigo-400"
                                    />
                                    <Label
                                        htmlFor={`${question.text}-${idx}`}
                                        className="flex-1 cursor-pointer text-gray-700 group-hover/option:text-gray-900 font-medium"
                                    >
                                        {option.label}
                                    </Label>
                                    {selected.includes(option.id) && (
                                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                    )}
                                </div>
                            </div>
                        ))}
                        {selected.length > 0 && (
                            <div className="text-xs text-gray-500 mt-2 px-3">
                                {selected.length} option{selected.length !== 1 ? 's' : ''} selected
                            </div>
                        )}
                    </div>
                ) : null}
            </CardContent>
        </Card>
    );
}

export default QuestionRenderer;
