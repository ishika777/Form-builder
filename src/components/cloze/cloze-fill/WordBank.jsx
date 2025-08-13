import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, RotateCcw, Shuffle } from 'lucide-react';
import DraggableBadge from './DraggableBadge';


const WordBank = ({ words, usedWords, onShuffle }) => {
    return (
        <Card className="mb-6">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-700">
                        Word Bank
                    </CardTitle>
                    <button
                        onClick={onShuffle}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        title="Shuffle words"
                    >
                        <Shuffle className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2">
                    {words.map((word) => (
                        <DraggableBadge
                            key={word.id}
                            item={word}
                            isUsed={usedWords.includes(word.id)}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
export default WordBank