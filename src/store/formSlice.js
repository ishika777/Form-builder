import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
    creating: false,
    deleting: false,
    loading: false,
    deletingFormId: null,
    forms: []
};

const formSlice = createSlice({
    name: 'forms',
    initialState,
    reducers: {
        setForms: (state, action) => {
            state.forms = action.payload;
        },

        setCreating: (state, action) => {
            state.creating = action.payload;
        },

        setDeleting: (state, action) => {
            state.deleting = action.payload;
        },

        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        setDeletingFormId: (state, action) => {
            state.deletingFormId = action.payload;
        },


        setFormTitle: (state, action) => {
            const { formId, title } = action.payload;
            const form = state.forms.find(f => f._id === formId);
            if (form) form.formTitle = title;
        },



        addQuestion: {
            reducer: (state, action) => {
                const { formId, question } = action.payload;
                const form = state.forms.find(f => f._id === formId);
                if (form) {
                    form.questions.push(question);
                }
            },
            prepare: (formId, type, text) => {
                let baseQues = { id: nanoid(), type, text, picture: null }; 
                if (type === "categorize") {
                    baseQues.categories = [];
                    baseQues.items = [];
                } else if (type === "cloze") {
                    baseQues.sentence = "";
                    baseQues.underlinedWords = [];
                } else {
                    baseQues.comprehension = "";
                    baseQues.questions = [];
                }
                return { payload: { formId, question: baseQues } };
            }
        },


        updateQuestion: (state, action) => {
            const { formId, id, updatedFields } = action.payload;
            const form = state.forms.find(f => f._id === formId);
            if (form) {
                const index = form.questions.findIndex(q => q.id === id);
                if (index !== -1) {
                    form.questions[index] = { ...form.questions[index], ...updatedFields };
                }
            }
        },

        updateQuestionText: (state, action) => {
            const { formId, id, text } = action.payload;
            const form = state.forms.find(f => f._id === formId);
            if (form) {
                const ques = form.questions.find(q => q.id === id);
                if (ques) ques.text = text;
            }
        },

        deleteQuestion: (state, action) => {
            const { formId, id } = action.payload;
            const form = state.forms.find(f => f._id === formId);
            if (form) {
                form.questions = form.questions.filter(q => q.id !== id);
            }
        },

        reorderQuestions: (state, action) => {
            const { formId, questions } = action.payload;
            const form = state.forms.find(f => f._id === formId);
            if (form) form.questions = questions;
        },

        resetForm: () => initialState,

        setForm: (state, action) => {
            const { formId, formData } = action.payload;
            const form = state.forms.find(f => f._id === formId);
            if (form) {
                Object.assign(form, formData);
            }
        }
    },
});

export const {
    // addForm,
    // deleteForm, 
    setFormTitle,
    addQuestion,
    updateQuestion,
    updateQuestionText,
    deleteQuestion,
    reorderQuestions,
    resetForm,
    setForm,
    setForms,
    setCreating,
    setDeleting,
    setLoading,
    setDeletingFormId
} = formSlice.actions;

export default formSlice.reducer;


// deleteForm: (state, action) => {
//     const formId = action.payload;
//     state.forms = state.forms.filter(f => f.id !== formId);
// },

// addForm: (state, action) => {
//     const newForm = {
//         id: nanoid(),
//         formTitle: action.payload,
//         questions: []
//     };
//     state.forms.push(newForm);
// },
