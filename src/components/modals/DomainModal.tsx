import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Domain } from '../../store/domainsSlice';

interface DomainModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  domain?: Domain;
  title: string;
}

const DomainModal: React.FC<DomainModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  domain,
  title,
}) => {
  const [name, setName] = useState(domain?.name || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name);
    setName('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="btn btn-icon">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="domain-name" className="block text-sm font-medium mb-1">
              Domain Name
            </label>
            <input
              id="domain-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input w-full"
              placeholder="Enter domain name"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {domain ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DomainModal;