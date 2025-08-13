import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CategoryQuestion from '@/components/category-fill/CategoryQuestion';
import ComprehensionQues from '@/components/comprehension/comprehension-fill/ComprehensionQues';
import ClozeQuestion from '@/components/cloze/cloze-fill/ClozeQuestion';
import { Button } from "@/components/ui/button";

const FillForm = () => {
    const { formId } = useParams();
    const form = useSelector((state) =>
        state.form.forms.find((f) => f._id === formId)
    );

    const [answers, setAnswers] = useState(() => {
        return form?.questions?.map((q) => {
            switch (q.type) {
                case "category":
                    return {};
                case "cloze":
                    return "";
                case "comprehension": {
                    const subAnswers = {};
                    q.questions?.forEach(subQ => {
                        if (subQ.type === "mca") subAnswers[subQ.id] = [];
                        else subAnswers[subQ.id] = "";
                    });
                    return subAnswers;
                }
                default:
                    return null;
            }
        }) || [];
    });

    const [results, setResults] = useState(null);

    const handleAnswerChange = (questionIndex, answer, subQuestionId = null) => {
        setAnswers(prev => {
            const updated = [...prev];
            if (subQuestionId) {
                updated[questionIndex] = {
                    ...updated[questionIndex],
                    [subQuestionId]: answer
                };
            } else {
                updated[questionIndex] = answer;
            }
            return updated;
        });
    };

    const handleSubmit = () => {
        const newResults = form.questions.map((q, idx) => {
            const userAnswer = answers[idx];

            if (q.type === "category" || q.type === "categorize") {
                const categoryResult = {};
                let correctCount = 0;
                q.items.forEach(item => {
                    const correctCategory = item.category;
                    const userCategory = userAnswer?.[item.name] || null;
                    categoryResult[item.name] = {
                        correctCategory,
                        userCategory,
                        isCorrect: userCategory === correctCategory
                    };
                    if (userCategory === correctCategory) correctCount++;
                });
                const score = (correctCount / q.items.length) * 100;
                return { type: "category", score, detail: categoryResult };
            } 
            else if (q.type === "cloze") {
                const isCorrect = userAnswer === q.answer;
                return { type: "cloze", isCorrect, userAnswer, correctAnswer: q.answer, score: isCorrect ? 100 : 0 };
            } 
            else if (q.type === "comprehension") {
                const subResults = {};
                let total = 0;
                let correct = 0;

                q.questions.forEach(subQ => {
                    total++;
                    const ua = userAnswer?.[subQ.id];
                    let isCorrect = false;

                    if (subQ.type === "short-text") {
                        isCorrect = ua === subQ.answer;
                    } else if (subQ.type === "mcq") {
                        isCorrect = ua === subQ.correctAnswer;
                    } else if (subQ.type === "mca") {
                        const correctSet = new Set(subQ.correctAnswers);
                        const uaSet = new Set(ua || []);
                        isCorrect =
                            correctSet.size === uaSet.size &&
                            [...correctSet].every(ans => uaSet.has(ans));
                    }

                    subResults[subQ.id] = {
                        isCorrect,
                        userAnswer: ua,
                        correctAnswer: subQ.answer || subQ.correctAnswer || subQ.correctAnswers
                    };
                    if (isCorrect) correct++;
                });

                const score = (correct / total) * 100;
                return { type: "comprehension", score, detail: subResults };
            } 
            else {
                return { type: q.type, score: 0 };
            }
        });

        setResults(newResults);
        console.log("Results:", newResults);
    };

    if (!form) return <p>Form not found!</p>;

    return (
        <div className="w-full max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">{form.formTitle}</h1>

            {form.questions.length === 0 && <p>No questions in this form.</p>}

            <div className="space-y-6">
                {form.questions.map((ques, questionIndex) => (
                    <div
                        key={ques.id}
                        className="p-4 border rounded-lg bg-white shadow-sm"
                    >
                        <h2 className="font-semibold mb-4">{ques.text}</h2>

                        {ques.type === "categorize" || ques.type === "category" ? (
                            <CategoryQuestion
                                question={ques}
                                answers={answers[questionIndex] || {}}
                                onAnswerChange={(ans) => handleAnswerChange(questionIndex, ans)}
                                showResult={results?.[questionIndex]}
                            />
                        ) : ques.type === "cloze" ? (
                            <ClozeQuestion
                                question={ques}
                                answers={answers[questionIndex] || ""}
                                onAnswerChange={(ans) => handleAnswerChange(questionIndex, ans)}
                                showResult={results?.[questionIndex]}
                            />
                        ) : (
                            <ComprehensionQues
                                question={ques}
                                answers={answers[questionIndex] || {}}
                                onAnswerChange={(subId, ans) =>
                                    handleAnswerChange(questionIndex, ans, subId)
                                }
                                showResult={results?.[questionIndex]}
                            />
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-6">
                <Button onClick={handleSubmit} className="w-full">
                    Submit Answers
                </Button>
            </div>

            {results && (
                <div className="mt-6 p-4 border rounded-md bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4">Results</h3>
                    {results.map((res, idx) => (
                        <div key={idx} className="mb-4">
                            <p className="font-medium">
                                Question {idx + 1} ({res.type}) - Score: {res.score.toFixed(0)}%
                            </p>

                            {res.type === "category" && (
                                <ul className="ml-4 list-disc">
                                    {Object.entries(res.detail).map(([item, val]) => (
                                        <li key={item} className={val.isCorrect ? "text-green-600" : "text-red-600"}>
                                            {item}: your answer = {val.userCategory || "none"}, correct = {val.correctCategory}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {res.type === "comprehension" && (
                                <ul className="ml-4 list-disc">
                                    {Object.entries(res.detail).map(([subId, val]) => (
                                        <li key={subId} className={val.isCorrect ? "text-green-600" : "text-red-600"}>
                                            {subId}: your answer = {JSON.stringify(val.userAnswer)}, correct = {JSON.stringify(val.correctAnswer)}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {res.type === "cloze" && (
                                <p className={res.isCorrect ? "text-green-600" : "text-red-600"}>
                                    Your answer: {res.userAnswer || "none"} | Correct: {res.correctAnswer}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FillForm;
