import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ComprehensionQues = ({ question, answer, onAnswerChange }) => {
    return (
        <Card className="space-y-6">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">{question.title || "Comprehension"}</CardTitle>
                <p className="mt-2 text-gray-700">{question.text}</p>

                {question.picture && (
                    <div className="p-2 flex justify-center">
                        <img
                            src={question.picture}
                            alt="Question"
                            className="max-h-60 object-contain rounded"
                        />
                    </div>
                )}
            </CardHeader>

            <CardContent>
                <textarea
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type your answer here..."
                    value={answer}
                    onChange={(e) => onAnswerChange(e.target.value)}
                    rows={6}
                />
            </CardContent>
        </Card>
    );
};

export default ComprehensionQues;
