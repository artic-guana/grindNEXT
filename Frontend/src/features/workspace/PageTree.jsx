import { FileText, Plus, Trash2 } from 'lucide-react';

export default function PageTree({ pages, activeId, onSelect, onCreate, onDelete }) {
  const roots = pages.filter((page) => !page.parentPage);

  const renderNode = (page, depth = 0) => {
    const children = pages.filter((candidate) => {
      const parentId = candidate.parentPage?._id ?? candidate.parentPage;
      return parentId === page._id;
    });

    return (
      <div key={page._id}>
        <div
          className={`group flex items-center gap-2 rounded-lg px-2 py-2 text-sm ${
            activeId === page._id
              ? 'bg-sky-500/10 text-sky-200'
              : 'text-slate-300 hover:bg-slate-800/70'
          }`}
          style={{ paddingLeft: `${8 + depth * 14}px` }}
        >
          <button
            type="button"
            className="flex min-w-0 flex-1 items-center gap-2 text-left"
            onClick={() => onSelect(page._id)}
          >
            <span>{page.icon || <FileText className="h-4 w-4" />}</span>
            <span className="truncate">{page.title || 'Untitled'}</span>
          </button>

          <button
            type="button"
            className="opacity-0 transition group-hover:opacity-100"
            onClick={() => onCreate(page._id)}
            title="Add child page"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            className="opacity-0 transition group-hover:opacity-100"
            onClick={() => onDelete(page._id)}
            title="Delete page"
          >
            <Trash2 className="h-3.5 w-3.5 text-rose-300" />
          </button>
        </div>

        {children.map((child) => renderNode(child, depth + 1))}
      </div>
    );
  };

  return <div className="space-y-1">{roots.map((page) => renderNode(page))}</div>;
}
