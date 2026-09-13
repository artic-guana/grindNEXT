import { useEffect, useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import Editor from '../features/workspace/Editor.jsx';
import PageTree from '../features/workspace/PageTree.jsx';
import { pageApi } from '../api/page.api.js';

export default function WorkspacePage() {
  const [pages, setPages] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [activePage, setActivePage] = useState(null);
  const [loading, setLoading] = useState(true);
  const saveTimer = useRef(null);

  const loadPages = async () => {
    try {
      setLoading(true);
      const response = await pageApi.list();
      const list = Array.isArray(response) ? response : [];
      setPages(list);

      const firstId = activeId || list[0]?._id;

      if (firstId) {
        setActiveId(firstId);
        setActivePage(await pageApi.get(firstId));
      } else {
        setActivePage(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPages();

    return () => clearTimeout(saveTimer.current);
  }, []);

  const selectPage = async (id) => {
    setActiveId(id);
    setActivePage(await pageApi.get(id));
  };

  const createPage = async (parentPage = null) => {
    const page = await pageApi.create({
      title: 'Untitled',
      parentPage: parentPage || undefined,
      content: { type: 'doc', content: [] },
    });

    setPages((items) => [...items, page]);
    setActiveId(page._id);
    setActivePage(page);
  };

  const deletePage = async (id) => {
    await pageApi.remove(id);
    const remaining = pages.filter((page) => page._id !== id);
    setPages(remaining);

    if (activeId === id) {
      const next = remaining[0] || null;
      setActiveId(next?._id || null);
      setActivePage(next ? await pageApi.get(next._id) : null);
    }
  };

  const patchPage = (changes) => {
    if (!activePage) return;

    const pageId = activePage._id;
    setActivePage((current) => ({ ...current, ...changes }));
    setPages((items) =>
      items.map((page) => (page._id === pageId ? { ...page, ...changes } : page))
    );

    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      pageApi.update(pageId, changes).catch(console.error);
    }, 600);
  };

  if (loading) {
    return <LoadingSpinner fullPage label="Loading workspace..." />;
  }

  return (
    <div className="grid min-h-[75vh] gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="rounded-2xl border border-slate-800 bg-slate-900/50 p-3">
        <Button className="mb-4 w-full" onClick={() => createPage()}>
          <Plus className="mr-2 h-4 w-4" />
          New page
        </Button>

        <PageTree
          pages={pages}
          activeId={activeId}
          onSelect={selectPage}
          onCreate={createPage}
          onDelete={deletePage}
        />
      </aside>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 sm:p-8">
        {activePage ? (
          <>
            <div className="mb-6">
              <input
                value={activePage.icon || ''}
                onChange={(event) => patchPage({ icon: event.target.value })}
                placeholder="📄"
                className="w-20 bg-transparent text-4xl outline-none"
              />

              <input
                value={activePage.title || ''}
                onChange={(event) => patchPage({ title: event.target.value })}
                placeholder="Untitled"
                className="mt-3 w-full bg-transparent text-4xl font-bold text-white outline-none placeholder:text-slate-600"
              />
            </div>

            <Editor
              content={activePage.content}
              onChange={(content) => patchPage({ content })}
            />
          </>
        ) : (
          <EmptyState
            title="No pages yet"
            description="Create your first workspace page."
            action={<Button onClick={() => createPage()}>Create page</Button>}
          />
        )}
      </section>
    </div>
  );
}
