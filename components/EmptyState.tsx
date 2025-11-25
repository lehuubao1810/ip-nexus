import { IPAsset } from '@/lib/story-api';
import { ImageIcon } from 'lucide-react';

interface EmptyStateProps {
  recentAssets: IPAsset[];
  onSelectAsset: (ipId: string) => void;
}

export default function EmptyState({ recentAssets, onSelectAsset }: EmptyStateProps) {
  if (recentAssets.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center max-w-md px-6">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30">
            <ImageIcon className="w-10 h-10 text-cyan-500/50" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">No IP Assets Loaded</h2>
          <p className="text-gray-400 mb-6">
            Enter an IP Asset ID in the search bar above to explore the Story Protocol graph.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center z-10 p-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Recent IP Assets</h2>
          <p className="text-gray-400">Select an IP Asset to explore its genealogy</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {recentAssets.map((asset) => (
            <button
              key={asset.id}
              onClick={() => onSelectAsset(asset.id)}
              className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/50 rounded-lg p-4 text-left transition-all hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] backdrop-blur-sm"
            >
              {/* Image */}
              <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-gradient-to-br from-cyan-900/20 to-purple-900/20 border border-white/5">
                {asset.nftMetadata?.image?.cachedUrl || asset.nftMetadata?.image?.originalUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={asset.nftMetadata.image.cachedUrl || asset.nftMetadata.image.originalUrl || ''} 
                    alt={asset.name || 'IP Asset'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-cyan-500/30" />
                  </div>
                )}
              </div>

              {/* Name */}
              <h3 className="text-white font-semibold mb-1 truncate">
                {asset.name || asset.nftMetadata?.name || `IP #${asset.tokenId}`}
              </h3>

              {/* ID */}
              <p className="text-xs font-mono text-cyan-400/70 truncate">
                {asset.ipId.slice(0, 10)}...{asset.ipId.slice(-8)}
              </p>

              {/* Hover effect */}
              <div className="absolute inset-0 rounded-lg bg-cyan-500/0 group-hover:bg-cyan-500/5 transition-colors pointer-events-none" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
