import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddQuestion from '@/components/AddQuestion';
import Categorize from '@/components/category/Categorize';
import { Trash2 } from 'lucide-react';
import Cloze from '@/components/cloze/Cloze';
import Comprehension from '@/components/comprehension/comprehension-design/Comprehension';
import SortableList from "@/SortableList";
import { GripVertical } from "lucide-react";
import { toast } from 'sonner';

import { useSelector, useDispatch } from 'react-redux';
import {
    setFormTitle,
    updateQuestion,
    updateQuestionText,
    deleteQuestion,
    reorderQuestions,
    // setForm,
    addQuestion
} from '../store/formSlice';
import { useParams } from 'react-router-dom';
import { updateFormAction } from '@/actions/form-actions';


const EditForm = () => {

    const { formId } = useParams();
    const dispatch = useDispatch();

    const { forms } = useSelector(state => state.form);

    const currentForm = forms.find(f => f._id === formId);

    const { formTitle, questions } = currentForm;

    const handleAddQues = async (type, text) => {
        dispatch(addQuestion(formId, type, text));
    };

    const handleSaveCategorizeQues = (id, updatedQues) => {
        dispatch(updateQuestion({ formId, id, updatedFields: updatedQues }));
    };

    const handleSaveClozeQues = (id, updatedQues) => {
        dispatch(updateQuestion({ formId, id, updatedFields: updatedQues }));
    };

    const handleSaveComprehensionQues = (id, updatedQues) => {
        console.log("Saving comprehension question:", updatedQues);
        dispatch(updateQuestion({ formId, id, updatedFields: updatedQues }));
    };

    const deleteQuestionHandler = (id) => {
        dispatch(deleteQuestion({ formId, id }));
    };

    const updateQuestionTextHandler = (id, text) => {
        dispatch(updateQuestionText({ formId, id, text }));
    };

    const handleOrderChange = (newQuestions) => {
        dispatch(reorderQuestions({ formId, questions: newQuestions }));
    };

    const handleTitleChange = (e) => {
        const title = e.target.value;
        if (title.length < 5) {
            toast.error("Form title should be at least 5 characters long");
            return;
        }
        dispatch(setFormTitle({ formId, title }));
    };




    const handleSubmit = async (e) => {
        e.preventDefault();

        for (const ques of questions) {
            if (!ques.text || !ques.text.trim()) {
                toast.error("Please fill the question text for all questions.");
                return;
            }


            if (ques.type === "categorize") {
                if (ques.categories.length < 2) {
                    const label = `at least 2 categories ${ques.text}`
                    toast.error(label);
                    return;
                }
                if (ques.items.length < 1) {
                    const label = `at least 2 items ${ques.text}`
                    toast.error(label);
                    return;
                }
            }
            if (ques.type === "cloze") {
                toast("validation left")

                console.log(ques)

                if (!ques.sentence.trim()) {
                    const label = `sentence text cannot be empty ${ques.text}`
                    toast.error(label);
                    return;
                }

                if (ques.underlinedWords.length === 0) {
                    const label = `Underlined words must contain at least one blank ${ques.text}`
                    toast.error(label);
                    return;
                }
            }

            if (ques.type === "comprehension") {

                if (!ques.questions || ques.questions.length < 1) {
                    const label = `Comprehension question must contain at least one sub-question ${ques.text}`
                    toast.error(label);
                    return;
                }
                for (const q of ques.questions) {
                    if (q.type === "short-text") {
                        if (!q.answer.trim()) {
                            const label = `answer cannot be empty ${q.text}`
                            toast.error(label);
                            return
                        }
                    }
                    if (q.type === "mca" || q.type === "mcq") {
                        const appeared = new Set();
                        for (const option of q.options) {
                            if (!option.label.trim()) {
                                const label = `option cant-t be empty for ${q.type} ques ${q.text}`
                                toast.error(label);
                                return
                            }
                            if (appeared.has(option.label.trim())) {
                                const label = `duplicate option for ${q.type} ques ${q.text}`
                                toast.error(label);
                                return
                            }
                            appeared.add(option.label);
                        }
                        if (appeared.size != 4) {
                            const label = `chk2 duplicate option for ${q.type} ques ${q.text}`
                            toast.error(label);
                            return
                        }

                    }

                    if (q.type === "mca") {
                        if (q.correctAnswers.length === 0) {
                            const label = `Please select atleast on correct option for mca ques ${q.text}`
                            toast.error(label);
                            return
                        }
                    }
                    if (q.type === "mcq") {
                        if (q.correctAnswer === null) {
                            const label = `Please select atleast on correct option for mcq ques ${q.text}`
                            toast.error(label);
                            return
                        }
                    }
                }

                if (!ques.comprehension || !ques.comprehension.trim()) {
                    const label = `Comprehension text cannot be empty ${ques.text}`
                    toast.error(label);
                    return;
                }


            }


        }
        console.log(formTitle);
        console.log("Form submitted:", questions);

        try {
            const res = await updateFormAction(dispatch, formId, formTitle, questions);
            if (res) {
                toast.success("Form saved!");
            }

            console.log(res);
        } catch (error) {
            console.error("Error creating form:", error);
        }
    };

    return (
  <div className="min-h-screen w-full bg-gray-50">
    <div className="p-6 w-full mx-auto flex flex-col">
      
      {/* Title Input */}
      <div className="mb-8">
        <Input
          type="text"
          value={formTitle}
          onChange={handleTitleChange}
          placeholder="Form title..."
          className="w-full text-3xl font-bold text-gray-800 border-b border-gray-300 focus:border-blue-500 focus:ring-0 bg-transparent px-0 py-2"
        />
      </div>

      <div className="space-y-6 w-full">
        {/* Questions Accordion */}
        <Accordion type="multiple" className="w-full space-y-4">
          <SortableList
            items={questions}
            onOrderChange={handleOrderChange}
            dragHandle={
              <div className="p-2 hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing">
                <GripVertical size={18} className="text-gray-400" />
              </div>
            }
            renderItem={(ques, index) => (
              <AccordionItem
                key={ques.id}
                value={ques.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm"
              >
                {/* Question number */}
                <div className="absolute top-4 left-4 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  {index + 1}
                </div>

                <AccordionTrigger className="px-12 py-4 text-base font-medium text-gray-800 hover:bg-gray-50 rounded-t-lg">
                  <div className="flex-1">{ques.text || "Untitled Question"}</div>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs capitalize">
                    {ques.type}
                  </span>
                </AccordionTrigger>

                <AccordionContent className="px-6 py-4 bg-white border-t border-gray-200">
                  <div className="space-y-4">
                    {/* Question Text Input */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Question Text
                      </label>
                      <Input
                        value={ques.text}
                        onChange={(e) => {
                          if (e.target.value === "") {
                            toast.error("Question text can't be empty!");
                            return;
                          }
                          updateQuestionTextHandler(ques.id, e.target.value);
                        }}
                        placeholder="Enter question..."
                        className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                      />
                    </div>

                    {/* Question Type Component */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      {ques.type === "categorize" && (
                        <Categorize question={ques} onSave={handleSaveCategorizeQues} />
                      )}
                      {ques.type === "cloze" && (
                        <Cloze question={ques} onSave={handleSaveClozeQues} />
                      )}
                      {ques.type === "comprehension" && (
                        <Comprehension question={ques} onSave={handleSaveComprehensionQues} />
                      )}
                    </div>

                    {/* Delete Button */}
                    <div className="flex justify-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteQuestionHandler(ques.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          />
        </Accordion>

        {/* Add Question */}
        <div className="flex justify-center">
          <AddQuestion onAdd={handleAddQues} />
        </div>

        {/* Save Button */}
        <div className="flex justify-center pt-6 border-t border-gray-200">
          <Button
            onClick={handleSubmit}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
          >
            Save All Changes
          </Button>
        </div>
      </div>
    </div>
  </div>
);

};

export default EditForm;
