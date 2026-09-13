import { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';

export default function Editor({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing...',
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: content || { type: 'doc', content: [] },
    editorProps: {
      attributes: {
        class: 'min-h-[55vh] text-slate-200',
      },
    },
    onUpdate: ({ editor: instance }) => {
      onChange(instance.getJSON());
    },
  });

  useEffect(() => {
    if (!editor || !content) return;

    const current = JSON.stringify(editor.getJSON());
    const next = JSON.stringify(content);

    if (current !== next) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [editor, content]);

  return <EditorContent editor={editor} />;
}
