import React from 'react';
import { Search } from 'lucide-react';

import { VISIBILITY_FILTERS } from './listFilters';

// Search + visibility + category filter for the admin lists.
const ListToolbar = ({
    search,
    onSearch,
    visibility,
    onVisibility,
    counts,
    searchPlaceholder,
    category,
    onCategoryChange,
    categories,
}) => (
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

        {categories && categories.length > 0 && (
            <div className="min-w-[180px]">
                <select
                    value={category || 'all'}
                    onChange={(e) => onCategoryChange && onCategoryChange(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-medium cursor-pointer"
                >
                    <option value="all">Tất cả danh mục</option>
                    {categories.map((c) => (
                        <option key={c.slug} value={c.slug}>
                            {c.name} {c.count !== undefined ? `(${c.count})` : ''}
                        </option>
                    ))}
                </select>
            </div>
        )}

        <div className="flex gap-1.5">
            {VISIBILITY_FILTERS.map((f) => (
                <button
                    key={f.key}
                    onClick={() => onVisibility(f.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
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
