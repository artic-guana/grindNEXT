import { useEffect, useState } from 'react';
import PageHeader from '../components/common/PageHeader.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import CollectibleCard from '../features/collectibles/CollectibleCard.jsx';
import { collectibleApi } from '../api/collectible.api.js';
import { errorMessage } from '../lib/utils.js';
import { useGrindNextStore } from '../store/useGrindNextStore.js';

export default function CollectionPage() {
  const refreshProfile = useGrindNextStore((state) => state.refreshProfile);
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await collectibleApi.mine();
      setItems(Array.isArray(response) ? response : []);
    } catch (error) {
      setError(errorMessage(error, 'Could not load your collection.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const equip = async (ownedId) => {
    try {
      setBusy(ownedId);
      await collectibleApi.equip(ownedId);
      await refreshProfile();
    } catch (error) {
      setError(errorMessage(error, 'Could not equip collectible.'));
    } finally {
      setBusy('');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Collection"
        subtitle="Your unlocked anime characters and Pokémon companions."
      />

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : items.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <CollectibleCard
              key={item._id}
              item={item}
              owned
              onEquip={equip}
              busy={busy === item._id}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="Your collection is empty" description="Visit the shop to unlock your first collectible." />
      )}
    </div>
  );
}
