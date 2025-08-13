import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const MCQQ = ({ question, options, selected = "", onChange }) => {
    return (
        <Card className="mb-4">
            <CardHeader>
                <CardTitle className="text-lg">{question.text}</CardTitle>
            </CardHeader>

            {/* Render picture if uploaded */}
            {question.picture && (
                <div className="p-2 flex justify-center">
                    <img
                        src={question.picture}
                        alt="Question"
                        className="max-h-60 object-contain rounded"
                    />
                </div>
            )}

            <CardContent>
                <RadioGroup
                    value={selected}
                    onValueChange={onChange}
                    className="space-y-3"
                >
                    {options?.map((option, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={`${question.text}-${idx}`} />
                            <Label htmlFor={`${question.text}-${idx}`}>{option}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </CardContent>
        </Card>
    );
};

export default MCQQ;
