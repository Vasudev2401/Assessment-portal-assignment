import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Question } from '../store/domainsSlice';

interface QuestionItemProps {
  question: Question;
  onEditQuestion: () => void;
  onDeleteQuestion: () => void;
}

const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  onEditQuestion,
  onDeleteQuestion,
}) => {
  return (
    <div className="border border-border rounded-md p-3">
      <div className="flex justify-between">
        <p className="font-medium">{question.text}</p>
        <div className="flex items-center space-x-2">
          <button
            onClick={onEditQuestion}
            className="btn btn-icon btn-ghost"
            title="Edit Question"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={onDeleteQuestion}
            className="btn btn-icon btn-ghost text-destructive"
            title="Delete Question"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="mt-2 space-y-1">
        {question.options.map((option) => (
          <div
            key={option.id}
            className={`p-2 rounded-md text-sm ${
              option.isCorrect
                ? 'bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-secondary'
            }`}
          >
            {option.text} {option.isCorrect && '✓'}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionItem;