import React from 'react';
import { Search } from 'lucide-react';

import { VISIBILITY_FILTERS } from './listFilters';

// Search + visibility filter for the admin lists. Both catalogues outgrew a
// plain table — dozens of rows with no way to find one, and no way to see at a
// glance which of them the landing page is actually showing.
const ListToolbar = ({ search, onSearch, visibility, onVisibility, counts, searchPlaceholder }) => (
    <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="block w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
        </div>
        <div className="flex gap-1.5">
            {VISIBILITY_FILTERS.map((f) => (
                <button
                    key={f.key}
                    onClick={() => onVisibility(f.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                        visibility === f.key
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                >
                    {f.label}
                    {f.key !== 'all' && ` (${f.key === 'visible' ? counts.visible : counts.hidden})`}
                </button>
            ))}
        </div>
    </div>
);

export default ListToolbar;
