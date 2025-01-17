export default function ExperimentsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-white mb-8">Experiments</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-zinc-900 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">Glass</h2>
          <p className="text-zinc-300 mb-4">Explore glass morphism and modern UI effects</p>
          <a href="/experiments/glass" className="text-blue-400 hover:text-blue-300">
            View experiment →
          </a>
        </div>
        <div className="bg-zinc-900 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">3D Solids</h2>
          <p className="text-zinc-300 mb-4">Interactive 3D geometry experiments</p>
          <a href="/experiments/3d-solids" className="text-blue-400 hover:text-blue-300">
            View experiment →
          </a>
        </div>
        <div className="bg-zinc-900 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">Gradient</h2>
          <p className="text-zinc-300 mb-4">Interactive Three.js noise gradient with scroll animation</p>
          <a href="/experiments/gradient" className="text-blue-400 hover:text-blue-300">
            View experiment →
          </a>
        </div>
        <div className="bg-zinc-900 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">Glass Gradient</h2>
          <p className="text-zinc-300 mb-4">Glass torus with animated gradient background</p>
          <a href="/experiments/glass-gradient" className="text-blue-400 hover:text-blue-300">
            View experiment →
          </a>
        </div>
      </div>
    </div>
  );
}
