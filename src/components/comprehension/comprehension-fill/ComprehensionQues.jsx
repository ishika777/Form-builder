import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import QuestionRenderer from "./QuestionRenderer";

const ComprehensionQues = ({ question, answers, onAnswerChange }) => {

    const handleAnswerChange = (subQuestionId, answer) => {
        onAnswerChange(subQuestionId, answer); 
    };

    return (
    <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 backdrop-blur-sm">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5 pointer-events-none" />
        
        <CardHeader className="relative pb-4 border-b border-gray-100/80">
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <div className="flex-1">
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent leading-tight">
                        Comprehension
                    </CardTitle>
                    <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-2" />
                </div>
            </div>
            <div className="mt-4 relative">
                <p className="text-gray-700 leading-relaxed text-base bg-white/60 rounded-lg p-4 border border-gray-100/50 shadow-sm">
                    {question.comprehension}
                </p>
            </div>
        </CardHeader>

        <CardContent className="relative pt-6 space-y-8">
            {question.questions.map((subQ, index) => (
                <div key={subQ.id} className="relative">
                    {/* Question separator line with number */}
                    {index > 0 && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-3">
                            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent w-20" />
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-xs font-semibold text-blue-600 border border-blue-200/50">
                                {index + 1}
                            </div>
                            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent w-20" />
                        </div>
                    )}
                    
                    <QuestionRenderer
                        question={subQ}
                        answer={answers[subQ.id] || ""}
                        onAnswerChange={(val) => handleAnswerChange(subQ.id, val)}
                    />
                </div>
            ))}
        </CardContent>
    </Card>
);
}

export default ComprehensionQues;
