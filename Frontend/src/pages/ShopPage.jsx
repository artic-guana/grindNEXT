import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../components/common/PageHeader.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import CollectibleCard from '../features/collectibles/CollectibleCard.jsx';
import { collectibleApi } from '../api/collectible.api.js';
import { errorMessage } from '../lib/utils.js';
import { useGrindNextStore } from '../store/useGrindNextStore.js';

export default function ShopPage() {
  const refreshAll = useGrindNextStore((state) => state.refreshAll);
  const [catalog, setCatalog] = useState([]);
  const [owned, setOwned] = useState([]);
  const [category, setCategory] = useState('all');
  const [busy, setBusy] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const [catalogResponse, ownedResponse] = await Promise.all([
        collectibleApi.list(),
        collectibleApi.mine(),
      ]);

      setCatalog(Array.isArray(catalogResponse) ? catalogResponse : []);
      setOwned(Array.isArray(ownedResponse) ? ownedResponse : []);
    } catch (error) {
      setError(errorMessage(error, 'Could not load the shop.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const ownedIds = useMemo(
    () =>
      new Set(
        owned.map((entry) => entry.collectible?._id ?? entry.collectible)
      ),
    [owned]
  );

  const visible = catalog.filter(
    (item) =>
      (category === 'all' || item.category === category) &&
      !ownedIds.has(item._id)
  );

  const buy = async (id) => {
    try {
      setBusy(id);
      await collectibleApi.buy(id);
      await Promise.all([load(), refreshAll()]);
    } catch (error) {
      setError(errorMessage(error, 'Purchase failed.'));
    } finally {
      setBusy('');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shop"
        subtitle="Spend coins on anime characters and Pokémon companions."
      />

      <div className="flex gap-2">
        {['all', 'anime', 'pokemon'].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setCategory(value)}
            className={`rounded-full border px-3 py-1.5 text-xs capitalize ${
              category === value
                ? 'border-sky-500 bg-sky-500/10 text-sky-200'
                : 'border-slate-700 text-slate-400'
            }`}
          >
            {value}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : visible.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((item) => (
            <CollectibleCard
              key={item._id}
              item={item}
              onBuy={buy}
              busy={busy === item._id}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="Nothing to buy here" description="You may already own every collectible in this category." />
      )}
    </div>
  );
}
