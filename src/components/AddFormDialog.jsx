import React, { useState } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const AddFormDialog = ({ onAdd }) => {

    const [open, setOpen] = useState(false);
    const [formTitle, setFormTitle] = useState("");

    const {creating} = useSelector((state) => state.form);

    const handleAdd = () => {
        if (formTitle.trim().length < 5) {
            toast.error("Form title should be at least 5 characters");
            return;
        }
        onAdd(formTitle.trim());
        setFormTitle("");
        setOpen(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAdd();
        }
    };

    return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button 
                disabled={creating} 
                variant="outline" 
                className="group relative overflow-hidden border-2 border-blue-200 hover:border-blue-400 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 hover:text-blue-800 shadow-md hover:shadow-lg transition-all duration-300 font-medium"
            >
                {/* Animated background on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                
                <div className="relative flex items-center gap-2">
                    {creating ? (
                        <Loader2 className="animate-spin h-4 w-4 text-blue-600" />
                    ) : (
                        <div className="relative">
                            <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-blue-400 rounded-full scale-0 group-hover:scale-100 opacity-20 transition-transform duration-300" />
                        </div>
                    )}
                    <span className="relative z-10">
                        {creating ? "Creating..." : "Add Form"}
                    </span>
                </div>
            </Button>
        </DialogTrigger>

        <DialogContent 
            onKeyDown={handleKeyDown} 
            className="sm:max-w-[450px] border-0 shadow-2xl bg-white/95 backdrop-blur-lg rounded-2xl overflow-hidden"
        >
            {/* Decorative header gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500" />
            
            <DialogHeader className="relative pt-8 pb-2">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <div>
                        <DialogTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            Create New Form
                        </DialogTitle>
                        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-1" />
                    </div>
                </div>
                <DialogDescription className="text-gray-600 leading-relaxed">
                    Give your form a descriptive title to help organize and identify it later.
                </DialogDescription>
            </DialogHeader>

            <div className="px-6 py-4">
                <div className="relative">
                    <Input
                        autoFocus
                        placeholder="e.g., Customer Feedback Survey"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder-gray-400"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-xl pointer-events-none opacity-0 focus-within:opacity-100 transition-opacity duration-200" />
                </div>
            </div>

            <DialogFooter className="px-6 pb-6 gap-3">
                <Button 
                    variant="ghost" 
                    onClick={() => setOpen(false)}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                >
                    Cancel
                </Button>
                <Button 
                    onClick={handleAdd}
                    disabled={!formTitle.trim()}
                    className="px-8 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    <div className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Create Form
                    </div>
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);
}

export default AddFormDialog;
