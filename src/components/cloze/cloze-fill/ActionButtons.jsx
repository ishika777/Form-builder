import React from 'react'
import { CheckCircle, RotateCcw, Shuffle } from 'lucide-react';


const ActionButtons = ({ onReset }) => {
    return (
        <div className="flex gap-3 justify-center">

            <button
                onClick={onReset}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 
                   text-white px-6 py-2 rounded-lg transition-colors"
            >
                <RotateCcw className="w-4 h-4" />
                Reset
            </button>
        </div>
    );
};

export default ActionButtons