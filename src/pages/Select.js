const Select = () => {
    return (
        <div class="overflow-auto h-72 relative max-w-sm mx-auto bg-white dark:bg-slate-800 dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl flex flex-col divide-y dark:divide-slate-200/5">
            <div class="flex items-center gap-4 p-4">
                <div class="flex flex-col">
                    <strong class="text-slate-900 text-sm font-medium dark:text-slate-200">Andrew Alfred</strong>
                    <span class="text-slate-500 text-sm font-medium dark:text-slate-400">Technical advisor</span>
                </div>
            </div>
            <div class="flex items-center gap-4 p-4">
                <div class="flex flex-col">
                    <strong class="text-slate-900 text-sm font-medium dark:text-slate-200">Debra Houston</strong>
                    <span class="text-slate-500 text-sm font-medium dark:text-slate-400">Analyst</span>
                </div>
            </div>
            <div class="flex items-center gap-4 p-4">
                <div class="flex flex-col">
                    <strong class="text-slate-900 text-sm font-medium dark:text-slate-200">Jane White</strong>
                    <span class="text-slate-500 text-sm font-medium dark:text-slate-400">Director, Marketing</span>
                </div>
            </div>
            <div class="flex items-center gap-4 p-4">
                <div class="flex flex-col">
                    <strong class="text-slate-900 text-sm font-medium dark:text-slate-200">Ray Flint</strong>
                    <span class="text-slate-500 text-sm font-medium dark:text-slate-400">Technical Advisor</span>
                </div>
            </div>
        </div>
    );
};

export default Select;