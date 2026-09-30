import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { TableKit } from '@tiptap/extension-table';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Heading2,
    Heading3,
    Heading4,
    List,
    ListOrdered,
    Quote,
    Table as TableIcon,
    Minus,
    Undo,
    Redo,
    RemoveFormatting,
    Code,
    Eye,
    Plus,
    Trash2,
    FileSpreadsheet,
} from 'lucide-react';

const RichTextEditor = ({
    value = '',
    onChange,
    placeholder = 'Nhập nội dung...',
    minHeight = '180px',
    templateButtonLabel,
    templateHtml,
}) => {
    const [isHtmlMode, setIsHtmlMode] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3, 4] },
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-red-600 hover:underline',
                },
            }),
            TableKit.configure({
                resizable: true,
            }),
        ],
        content: value || '',
        onUpdate: ({ editor: ed }) => {
            const html = ed.getHTML();
            if (onChange) {
                onChange(html === '<p></p>' ? '' : html);
            }
        },
        editorProps: {
            attributes: {
                class: 'focus:outline-none px-4 py-3 text-sm text-gray-800 dark:text-gray-100 min-h-[160px]',
            },
        },
    });

    // Synchronize external value changes if not in HTML mode and content differs
    useEffect(() => {
        if (!editor || isHtmlMode) return;
        const currentHtml = editor.getHTML();
        const cleanValue = value || '';
        if (cleanValue !== currentHtml && (cleanValue !== '' || currentHtml !== '<p></p>')) {
            editor.commands.setContent(cleanValue, false);
        }
    }, [value, editor, isHtmlMode]);

    if (!editor) {
        return (
            <div className="border border-gray-300 dark:border-gray-600 rounded-md p-4 text-xs text-gray-400">
                Đang tải trình soạn thảo...
            </div>
        );
    }

    const toggleHtmlMode = () => {
        if (isHtmlMode) {
            // Switching back to visual mode: push textarea changes to editor
            editor.commands.setContent(value || '', false);
        }
        setIsHtmlMode(!isHtmlMode);
    };

    const handleInsertTemplate = () => {
        if (!templateHtml) return;
        if (editor.getText().trim().length > 0) {
            if (!window.confirm('Chèn mẫu sẽ thay thế nội dung hiện tại. Bạn có chắc chắn muốn tiếp tục?')) {
                return;
            }
        }
        editor.commands.setContent(templateHtml, true);
        if (onChange) onChange(templateHtml);
    };

    const isInsideTable = editor.isActive('table');

    return (
        <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-xs transition-colors">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 dark:bg-gray-900/90 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs">
                {/* Heading levels */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    className={`px-2 py-1 rounded font-medium transition-colors ${
                        editor.isActive('paragraph') && !editor.isActive('heading')
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 font-bold'
                            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    title="Đoạn văn thường"
                >
                    P
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-1.5 rounded transition-colors ${
                        editor.isActive('heading', { level: 2 })
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    title="Tiêu đề 2 (H2)"
                >
                    <Heading2 size={15} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`p-1.5 rounded transition-colors ${
                        editor.isActive('heading', { level: 3 })
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    title="Tiêu đề 3 (H3)"
                >
                    <Heading3 size={15} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                    className={`p-1.5 rounded transition-colors ${
                        editor.isActive('heading', { level: 4 })
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    title="Tiêu đề 4 (H4)"
                >
                    <Heading4 size={15} />
                </button>

                <div className="w-[1px] h-4 bg-gray-300 dark:bg-gray-700 mx-1" />

                {/* Text Formatting */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-1.5 rounded transition-colors ${
                        editor.isActive('bold')
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    title="In đậm (Ctrl+B)"
                >
                    <Bold size={15} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-1.5 rounded transition-colors ${
                        editor.isActive('italic')
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    title="In nghiêng (Ctrl+I)"
                >
                    <Italic size={15} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`p-1.5 rounded transition-colors ${
                        editor.isActive('underline')
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    title="Gạch chân (Ctrl+U)"
                >
                    <UnderlineIcon size={15} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`p-1.5 rounded transition-colors ${
                        editor.isActive('strike')
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    title="Gạch ngang"
                >
                    <Strikethrough size={15} />
                </button>

                <div className="w-[1px] h-4 bg-gray-300 dark:bg-gray-700 mx-1" />

                {/* Lists & Quote */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-1.5 rounded transition-colors ${
                        editor.isActive('bulletList')
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    title="Danh sách dấu chấm"
                >
                    <List size={15} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-1.5 rounded transition-colors ${
                        editor.isActive('orderedList')
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    title="Danh sách số thứ tự"
                >
                    <ListOrdered size={15} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-1.5 rounded transition-colors ${
                        editor.isActive('blockquote')
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    title="Trích dẫn / Ghi chú"
                >
                    <Quote size={15} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    title="Đường phân cách ngang"
                >
                    <Minus size={15} />
                </button>

                <div className="w-[1px] h-4 bg-gray-300 dark:bg-gray-700 mx-1" />

                {/* Table Insert & Controls */}
                <button
                    type="button"
                    onClick={() =>
                        editor
                            .chain()
                            .focus()
                            .insertTable({ rows: 3, cols: 2, withHeaderRow: true })
                            .run()
                    }
                    className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                        isInsideTable
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 font-medium'
                            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    title="Chèn bảng mới (2 cột x 3 hàng)"
                >
                    <TableIcon size={14} />
                    <span>Bảng</span>
                </button>

                {isInsideTable && (
                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 p-0.5 rounded border border-amber-200 dark:border-amber-800 text-[11px]">
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().addRowAfter().run()}
                            className="px-1.5 py-0.5 rounded hover:bg-amber-100 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-200 font-medium"
                            title="Thêm hàng dưới"
                        >
                            + Hàng
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().addColumnAfter().run()}
                            className="px-1.5 py-0.5 rounded hover:bg-amber-100 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-200 font-medium"
                            title="Thêm cột bên phải"
                        >
                            + Cột
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().deleteRow().run()}
                            className="px-1.5 py-0.5 rounded hover:bg-red-100 dark:hover:bg-red-950 text-red-600 font-medium"
                            title="Xóa hàng hiện tại"
                        >
                            - Hàng
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().deleteColumn().run()}
                            className="px-1.5 py-0.5 rounded hover:bg-red-100 dark:hover:bg-red-950 text-red-600 font-medium"
                            title="Xóa cột hiện tại"
                        >
                            - Cột
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().deleteTable().run()}
                            className="px-1.5 py-0.5 rounded hover:bg-red-200 dark:hover:bg-red-900 text-red-700 dark:text-red-300 font-bold"
                            title="Xóa toàn bộ bảng"
                        >
                            Xóa bảng
                        </button>
                    </div>
                )}

                <div className="w-[1px] h-4 bg-gray-300 dark:bg-gray-700 mx-1" />

                {/* History & Clear */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors"
                    title="Hoàn tác (Ctrl+Z)"
                >
                    <Undo size={14} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors"
                    title="Làm lại (Ctrl+Y)"
                >
                    <Redo size={14} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
                    className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-colors"
                    title="Xóa định dạng"
                >
                    <RemoveFormatting size={14} />
                </button>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Optional Template Button */}
                {templateButtonLabel && templateHtml && (
                    <button
                        type="button"
                        onClick={handleInsertTemplate}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 dark:bg-red-950/60 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 font-semibold border border-red-200 dark:border-red-800 transition-colors"
                        title="Chèn mẫu cấu trúc chuẩn"
                    >
                        <FileSpreadsheet size={13} />
                        <span>{templateButtonLabel}</span>
                    </button>
                )}

                {/* HTML Source Mode Toggle */}
                <button
                    type="button"
                    onClick={toggleHtmlMode}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded border transition-colors ${
                        isHtmlMode
                            ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                    }`}
                    title={isHtmlMode ? 'Chuyển về Trực quan (WYSIWYG)' : 'Xem / Chỉnh sửa mã HTML'}
                >
                    {isHtmlMode ? <Eye size={13} /> : <Code size={13} />}
                    <span>{isHtmlMode ? 'Trực quan' : 'Mã HTML'}</span>
                </button>
            </div>

            {/* Editor Body */}
            {isHtmlMode ? (
                <textarea
                    value={value || ''}
                    onChange={(e) => onChange && onChange(e.target.value)}
                    style={{ minHeight }}
                    className="block w-full p-3 font-mono text-xs text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 border-0 focus:outline-none focus:ring-0 leading-relaxed resize-y"
                    placeholder={placeholder || 'Nhập hoặc dán mã HTML tại đây...'}
                />
            ) : (
                <div style={{ minHeight }} className="prose prose-sm dark:prose-invert max-w-none bg-white dark:bg-gray-800">
                    <EditorContent editor={editor} />
                </div>
            )}
        </div>
    );
};

export default RichTextEditor;
