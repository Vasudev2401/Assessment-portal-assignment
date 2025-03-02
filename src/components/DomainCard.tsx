import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Edit, Trash2 } from 'lucide-react';
import { Domain, Category } from '../store/domainsSlice';
import CategoryItem from './CategoryItem';

interface DomainCardProps {
  domain: Domain;
  onEditDomain: (domain: Domain) => void;
  onDeleteDomain: (domainId: number) => void;
  onAddCategory: (domainId: number) => void;
  onEditCategory: (domainId: number, category: Category) => void;
  onDeleteCategory: (domainId: number, categoryId: number) => void;
  onAddQuestion: (domainId: number, categoryId: number) => void;
  onEditQuestion: (domainId: number, categoryId: number, questionId: number) => void;
  onDeleteQuestion: (domainId: number, categoryId: number, questionId: number) => void;
}

const DomainCard: React.FC<DomainCardProps> = ({
  domain,
  onEditDomain,
  onDeleteDomain,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
}) => {
  const [expanded, setExpanded] = useState(true);
  const categoryCount = domain.categories.length;

  return (
    <div className="card mb-4">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <button
            className="flex items-center space-x-2 font-medium text-lg"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
            <span>
              {domain.name} <span className="text-muted-foreground">({categoryCount} categories)</span>
            </span>
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onAddCategory(domain.id)}
              className="btn btn-icon btn-ghost text-primary"
              title="Add Category"
            >
              <Plus className="h-5 w-5" />
            </button>
            <button
              onClick={() => onEditDomain(domain)}
              className="btn btn-icon btn-ghost"
              title="Edit Domain"
            >
              <Edit className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDeleteDomain(domain.id)}
              className="btn btn-icon btn-ghost text-destructive"
              title="Delete Domain"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {expanded && (
        <div className="px-4 pb-4">
          {domain.categories.length > 0 ? (
            <div className="space-y-2">
              {domain.categories.map((category) => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  domainId={domain.id}
                  onEditCategory={(category) => onEditCategory(domain.id, category)}
                  onDeleteCategory={(categoryId) => onDeleteCategory(domain.id, categoryId)}
                  onAddQuestion={(categoryId) => onAddQuestion(domain.id, categoryId)}
                  onEditQuestion={(categoryId, questionId) =>
                    onEditQuestion(domain.id, categoryId, questionId)
                  }
                  onDeleteQuestion={(categoryId, questionId) =>
                    onDeleteQuestion(domain.id, categoryId, questionId)
                  }
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No categories found. Add a category to get started.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DomainCard;