import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { useRef } from 'react';
import { postService } from '../../api/services';
import toast from 'react-hot-toast';

const ToolbarBtn = ({ onClick, active, title, children }) => (
  <button type="button" onClick={onClick} title={title}
    className={`px-2 py-1.5 rounded text-sm transition-colors ${
      active
        ? 'bg-gray-900 text-white'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`}>
    {children}
  </button>
);

export default function RichEditor({ content = '', onChange }) {
  const fileInputRef = useRef();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-blue-600 underline' } }),
      Placeholder.configure({ placeholder: 'Start writing your post…' }),
      CharacterCount,
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'prose-content min-h-[400px] focus:outline-none px-6 py-4',
      },
    },
  });

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (!url) return;
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    try {
      const { data } = await postService.uploadImage(fd);
      editor.chain().focus().setImage({ src: data.url }).run();
      toast.success('Image uploaded');
    } catch {
      toast.error('Failed to upload image');
    }
    e.target.value = '';
  };

  const wordCount = editor.storage.characterCount?.words() ?? 0;
  const charCount = editor.storage.characterCount?.characters() ?? 0;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-gray-100 bg-gray-50">
        {/* Text style */}
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')} title="Bold">B</ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')} title="Italic"><em>i</em></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')} title="Strikethrough"><s>S</s></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')} title="Inline code">`</ToolbarBtn>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* Headings */}
        {[1, 2, 3].map(level => (
          <ToolbarBtn key={level}
            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
            active={editor.isActive('heading', { level })} title={`Heading ${level}`}>
            H{level}
          </ToolbarBtn>
        ))}

        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* Lists */}
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')} title="Bullet list">• List</ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')} title="Numbered list">1. List</ToolbarBtn>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* Blocks */}
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')} title="Blockquote">" Quote</ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')} title="Code block">{'</>'}</ToolbarBtn>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* Link + Image */}
        <ToolbarBtn onClick={addLink} active={editor.isActive('link')} title="Add link">
          🔗 Link
        </ToolbarBtn>
        <ToolbarBtn onClick={() => fileInputRef.current?.click()} title="Upload image">
          🖼️ Image
        </ToolbarBtn>
        <input ref={fileInputRef} type="file" accept="image/*"
          onChange={handleImageUpload} className="hidden" />

        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* Undo/Redo */}
        <ToolbarBtn onClick={() => editor.chain().focus().undo().run()}
          active={false} title="Undo">↩</ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().redo().run()}
          active={false} title="Redo">↪</ToolbarBtn>

        <div className="ml-auto text-xs text-gray-400">
          {wordCount} words · {charCount} chars
        </div>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  );
}
