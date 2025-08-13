import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Trash2, MoreHorizontal, Loader2 } from 'lucide-react';
import AddFormDialog from '../components/AddFormDialog';

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '../components/ui/card';

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '../components/ui/dropdown-menu';

import { Link, useNavigate } from 'react-router-dom';
import { createForm, deleteFormAction } from '@/actions/form-actions';
import { setDeletingFormId } from '@/store/formSlice';

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { forms, deleting, deletingFormId } = useSelector(state => state.form);

    const handleAddForm = async (title) => {
        try {
            await createForm(dispatch, title);
        } catch (error) {
            console.error("Error creating form:", error);
        }
    };

    const handleDeleteForm = async (formId) => {
        dispatch(setDeletingFormId(formId))
        try {
            await deleteFormAction(dispatch, formId);
        } catch (error) {
            console.error("Error deleting form:", error);
        }
    };

    return (
    <div className="min-h-screen w-full bg-gray-50">
        <div className="p-8 w-full space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900">
                        Forms Dashboard
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {forms?.length || 0} forms total
                    </p>
                </div>
                <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white border shadow-sm">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
            </div>

            {/* Add Form Button */}
            <div>
                <AddFormDialog onAdd={handleAddForm} />
            </div>

            {/* Empty State */}
            {forms?.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-700">No forms yet</h3>
                    <p className="text-gray-500 text-center max-w-sm mt-1">
                        Create your first form using the "Add Form" button above.
                    </p>
                </div>
            )}

            {/* Forms Grid */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {forms?.map((form, index) => (
                    <Card
                        key={form._id}
                        className="group relative overflow-hidden border shadow-sm hover:shadow-md transition-all duration-200 bg-white"
                        style={{
                            animationDelay: `${index * 100}ms`,
                            animation: 'fadeInUp 0.4s ease-out forwards'
                        }}
                    >
                        {/* Dropdown Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    aria-label="Open menu"
                                    className="absolute top-4 right-4 p-2 rounded-full bg-gray-50 hover:bg-gray-100 border shadow-sm"
                                >
                                    <MoreHorizontal size={18} className="text-gray-600" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                side="bottom"
                                className="w-48 border shadow-lg bg-white rounded-md"
                            >
                                <DropdownMenuItem
                                    className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-600"
                                    onClick={() => handleDeleteForm(form._id)}
                                >
                                    <Trash2 size={16} />
                                    Delete Form
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-gray-700"
                                    onClick={() => navigate(`/form/fill/${form._id}`)}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Fill Form
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Card Content */}
                        <CardHeader className="pb-2">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <CardTitle className="flex-1 pr-8">
                                    <Link
                                        to={`/form/edit/${form._id}`}
                                        className="text-base font-medium text-gray-800 hover:text-blue-600"
                                    >
                                        {form.formTitle}
                                    </Link>
                                </CardTitle>
                            </div>
                        </CardHeader>

                        <CardContent>
                            {deleting && form._id === deletingFormId ? (
                                <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded">
                                    <Loader2 className="animate-spin h-4 w-4" />
                                    <span className="text-sm">Deleting...</span>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-500">
                                        {form.questions.length} question{form.questions.length !== 1 ? 's' : ''}
                                    </p>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full"
                                            style={{ width: `${Math.min(100, (form.questions.length / 10) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>

        <style jsx>{`
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `}</style>
    </div>
);

}

export default Dashboard;
