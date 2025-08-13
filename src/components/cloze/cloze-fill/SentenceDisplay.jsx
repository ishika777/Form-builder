import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BlankDropZone from './BlankDropZone';


const SentenceDisplay = ({
    sentence,
    blanks,
    filledBlanks,
    onDrop,
    showFeedback,
}) => {
    const renderSentenceWithBlanks = () => {
        let result = [];
        let currentIndex = 0;

        // Sort blanks by index to process them in order
        const sortedBlanks = [...blanks].sort((a, b) => a.index - b.index);

        sortedBlanks.forEach((blank, i) => {
            // Add text before the blank
            if (blank.index > currentIndex) {
                result.push(
                    <span key={`text-${i}`}>
                        {sentence.substring(currentIndex, blank.index)}
                    </span>
                );
            }

            // Add the blank drop zone
            const blankId = `blank-${blank.index}`;
            const filledWord = filledBlanks[blankId];
            const expectedWord = sentence.substring(blank.index, blank.index + blank.length);
            const isCorrect = filledWord === expectedWord;

            result.push(
                <BlankDropZone
                    key={blankId}
                    blankId={blankId}
                    filledWord={filledWord}
                    onDrop={onDrop}
                    isCorrect={isCorrect}
                    showFeedback={showFeedback}
                />
            );

            // Update current index
            currentIndex = blank.index + blank.length;
        });

        // Add remaining text after the last blank
        if (currentIndex < sentence.length) {
            result.push(
                <span key="text-end">
                    {sentence.substring(currentIndex)}
                </span>
            );
        }

        return result;
    };

    return (
        <Card className="mb-6">
            <CardContent className="pt-6">
                <div className="text-lg leading-relaxed">
                    {renderSentenceWithBlanks()}
                </div>
            </CardContent>
        </Card>
    );
};

export default SentenceDisplay