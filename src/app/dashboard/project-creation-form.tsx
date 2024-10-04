import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function CreateProjectForm() {
  const [image, setImage] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: Implement project creation logic
    console.log('Creating project:', { image, name, description });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div className="flex items-start space-x-4">
        <div className="relative w-[100px] h-[100px] border-2 border-dashed border-white rounded-lg overflow-hidden group">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 group-hover:bg-gray-700 transition-colors">
            {image ? (
              <img src={URL.createObjectURL(image)} alt="Project" className="w-full h-full object-cover" />
            ) : (
              <PlusIcon className="w-8 h-8 text-white" />
            )}
          </div>
          <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs text-white">Choose image</span>
        </div>
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter a project name"
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-md"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a project description"
            rows={1}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-md resize-none"
          />
        </div>
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Create Project
      </button>
    </form>
  );
}