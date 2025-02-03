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
          <h2 className="text-2xl font-semibold text-white mb-4">Glass on Gradient</h2>
          <p className="text-zinc-300 mb-4">Glass morphism effects combined with interactive gradient backgrounds</p>
          <a href="/experiments/glass-on-gradient" className="text-blue-400 hover:text-blue-300">
            View experiment →
          </a>
        </div>
        <div className="bg-zinc-900 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">Blender Import</h2>
          <p className="text-zinc-300 mb-4">3D model visualization with glass dispersion effects</p>
          <a href="/experiments/blender-import" className="text-blue-400 hover:text-blue-300">
            View experiment →
          </a>
        </div>
        <div className="bg-zinc-900 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">Neural Networks</h2>
          <p className="text-zinc-300 mb-4">Interactive 3D visualization of neural network architecture</p>
          <a href="/experiments/neuralnets" className="text-blue-400 hover:text-blue-300">
            View experiment →
          </a>
        </div>
        <div className="bg-zinc-900 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">RSphere</h2>
          <p className="text-zinc-300 mb-4">3D rotating sphere with decentralized network visualization</p>
          <a href="/experiments/rsphere" className="text-blue-400 hover:text-blue-300">
            View experiment →
          </a>
        </div>
        <div className="bg-zinc-900 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">TransSphere</h2>
          <p className="text-zinc-300 mb-4">Interactive transparent sphere with adjustable opacity and network effects</p>
          <a href="/experiments/transphere" className="text-blue-400 hover:text-blue-300">
            View experiment →
          </a>
        </div>
      </div>
    </div>
  );
}
