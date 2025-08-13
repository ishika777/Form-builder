import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const MCAQ = ({ question, options, selected = [], onChange }) => {
    return (
        <Card className="mb-4">
            <CardHeader>
                <CardTitle className="text-lg">{question.text}</CardTitle>
            </CardHeader>

            {question.picture && (
                <div className="p-2 flex justify-center">
                    <img
                        src={question.picture}
                        alt="Question"
                        className="max-h-60 object-contain rounded"
                    />
                </div>
            )}

            <CardContent className="space-y-3">
                {options?.map((option, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                        <Checkbox
                            id={`${question.text}-${idx}`}
                            checked={selected.includes(option.id)} // compare by ID
                            onCheckedChange={(checked) => {
                                if (checked) {
                                    onChange([...selected, option.id]);
                                } else {
                                    onChange(selected.filter(item => item !== option.id));
                                }
                            }}
                        />
                        <Label htmlFor={`${question.text}-${idx}`}>{option.label}</Label>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};



export default MCAQ;
