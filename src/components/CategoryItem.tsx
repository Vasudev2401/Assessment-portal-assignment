import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Edit, Trash2 } from 'lucide-react';
import { Category, Question } from '../store/domainsSlice';
import QuestionItem from './QuestionItem';

interface CategoryItemProps {
  category: Category;
  domainId: number;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: number) => void;
  onAddQuestion: (categoryId: number) => void;
  onEditQuestion: (categoryId: number, questionId: number) => void;
  onDeleteQuestion: (categoryId: number, questionId: number) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  domainId,
  onEditCategory,
  onDeleteCategory,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
}) => {
  const [expanded, setExpanded] = useState(false);
  const questionCount = category.questions.length;

  return (
    <div className="border border-border rounded-md">
      <div className="p-3 flex items-center justify-between">
        <button
          className="flex items-center space-x-2"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          <span>
            {category.name}{' '}
            <span className="text-muted-foreground">({questionCount} questions)</span>
          </span>
        </button>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onAddQuestion(category.id)}
            className="btn btn-icon btn-ghost text-primary"
            title="Add Question"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEditCategory(category)}
            className="btn btn-icon btn-ghost"
            title="Edit Category"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDeleteCategory(category.id)}
            className="btn btn-icon btn-ghost text-destructive"
            title="Delete Category"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {expanded && (
        <div className="px-3 pb-3">
          {category.questions.length > 0 ? (
            <div className="space-y-2">
              {category.questions.map((question: Question) => (
                <QuestionItem
                  key={question.id}
                  question={question}
                  onEditQuestion={() => onEditQuestion(category.id, question.id)}
                  onDeleteQuestion={() => onDeleteQuestion(category.id, question.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-3 text-muted-foreground">
              No questions found. Add a question to get started.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryItem;