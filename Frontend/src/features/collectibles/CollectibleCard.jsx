import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import { rarityBadgeVariant } from '../../constants/rarities.js';

export default function CollectibleCard({
  item,
  owned = false,
  onBuy,
  onEquip,
  busy = false,
}) {
  const collectible = item.collectible ?? item;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
      <div className="flex h-52 items-center justify-center bg-slate-950/80">
        {collectible.animatedImage || collectible.image ? (
          <img
            src={collectible.animatedImage || collectible.image}
            alt={collectible.name}
            className={`h-full w-full ${
              collectible.category === 'pokemon'
                ? 'object-contain p-4'
                : 'object-cover origin-center'
            }`}
            loading="lazy"
          />
        ) : (
          <span className="text-sm text-slate-500">Image unavailable</span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-white">
              {item.nickname || collectible.name}
            </h3>
            <p className="mt-1 text-xs capitalize text-slate-400">
              {collectible.type}
              {collectible.anime?.title ? ` · ${collectible.anime.title}` : ''}
            </p>
          </div>

          <Badge variant={rarityBadgeVariant[collectible.rarity] || 'default'}>
            {collectible.rarity}
          </Badge>
        </div>

        {owned ? (
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-slate-300">
              Lv {item.level || 1}
              {item.shiny ? ' · ✨ Shiny' : ''}
            </span>
            <Button
              variant="secondary"
              className="px-3 py-2"
              onClick={() => onEquip?.(item._id)}
              disabled={busy}
            >
              Equip
            </Button>
          </div>
        ) : (
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-amber-300">
              {collectible.price || 0} coins
            </span>
            <Button
              className="px-3 py-2"
              onClick={() => onBuy?.(collectible._id)}
              disabled={busy}
            >
              {busy ? 'Buying...' : 'Buy'}
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}
