import React, { useState, useEffect, useCallback } from 'react';
import WordBank from './WordBank';
import SentenceDisplay from './SentenceDisplay';
import ActionButtons from './ActionButtons';

const ClozeQuestion = ({ question, answers, onAnswerChange }) => {
    // Initialize words for the word bank
    const createWordBank = useCallback(() => {
        const words = question.underlinedWords.map((word, i) => ({
            id: `word-${i}`,
            content: question.sentence.substring(word.index, word.index + word.length),
            originalIndex: word.index
        }));
        return words.sort(() => Math.random() - 0.5);
    }, [question]);

    const [words, setWords] = useState(createWordBank);
    const [filledBlanks, setFilledBlanks] = useState({});
    const [usedWords, setUsedWords] = useState([]);

    // Load saved answers if exist
    useEffect(() => {
        const saved = answers[question.id] || {};
        if (saved.filledBlanks) {
            setFilledBlanks(saved.filledBlanks);
            setUsedWords(Object.values(saved.filledBlanks));
        }
    }, [answers, question.id]);

    const handleDrop = useCallback((blankId, draggedItemId) => {
        const draggedWord = words.find(w => w.id === draggedItemId);
        if (!draggedWord || usedWords.includes(draggedItemId)) return;

        const previousWord = filledBlanks[blankId];
        if (previousWord) {
            const previousWordId = words.find(w => w.content === previousWord)?.id;
            if (previousWordId) {
                setUsedWords(prev => prev.filter(id => id !== previousWordId));
            }
        }

        const newFilled = {
            ...filledBlanks,
            [blankId]: draggedWord.content
        };
        setFilledBlanks(newFilled);

        setUsedWords(prev => [...prev.filter(id => {
            const word = words.find(w => w.id === id);
            return word && filledBlanks[blankId] !== word.content;
        }), draggedItemId]);

        // Update parent answers
        onAnswerChange(question.id, { filledBlanks: newFilled }, "cloze");
    }, [words, filledBlanks, usedWords, onAnswerChange, question.id]);

    const handleReset = useCallback(() => {
        setFilledBlanks({});
        setUsedWords([]);
        onAnswerChange(question.id, { filledBlanks: {} }, "cloze");
    }, [onAnswerChange, question.id]);

    const handleShuffle = useCallback(() => {
        setWords(prev => [...prev].sort(() => Math.random() - 0.5));
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {question.picture && (
                <div className="p-2 flex justify-center">
                    <img
                        src={question.picture}
                        alt="Question"
                        className="max-h-60 object-contain rounded"
                    />
                </div>
            )}

            <WordBank
                words={words}
                usedWords={usedWords}
                onShuffle={handleShuffle}
            />

            <SentenceDisplay
                sentence={question.sentence}
                blanks={question.underlinedWords}
                filledBlanks={filledBlanks}
                onDrop={handleDrop}
                correctAnswers={question.underlinedWords}
            />

            <ActionButtons
                onReset={handleReset}
            />
        </div>
    );
};

export default ClozeQuestion;
