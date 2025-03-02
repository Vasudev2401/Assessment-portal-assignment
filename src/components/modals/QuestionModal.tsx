import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Question, Option } from '../../store/domainsSlice';

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (question: Omit<Question, 'id'>) => void;
  question?: Question;
  title: string;
}

const QuestionModal: React.FC<QuestionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  question,
  title,
}) => {
  const [text, setText] = useState(question?.text || '');
  const [options, setOptions] = useState<Omit<Option, 'id'>[]>(
    question?.options.map(({ text, isCorrect }) => ({ text, isCorrect })) || [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ]
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add IDs to options for the API
    const optionsWithIds = options.map((option, index) => ({
      ...option,
      id: question?.options[index]?.id || index + 1,
    }));
    
    onSubmit({
      text,
      options: optionsWithIds,
    });
    
    setText('');
    setOptions([
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ]);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], text: value };
    setOptions(newOptions);
  };

  const handleCorrectChange = (index: number) => {
    const newOptions = options.map((option, i) => ({
      ...option,
      isCorrect: i === index,
    }));
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, { text: '', isCorrect: false }]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return; // Minimum 2 options
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="btn btn-icon">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="question-text" className="block text-sm font-medium mb-1">
              Question Text
            </label>
            <textarea
              id="question-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="input w-full min-h-[100px]"
              placeholder="Enter question text"
              required
            />
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Options</label>
              <button
                type="button"
                onClick={addOption}
                className="btn btn-outline btn-sm flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add Option</span>
              </button>
            </div>
            
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="radio"
                  name="correct-option"
                  checked={option.isCorrect}
                  onChange={() => handleCorrectChange(index)}
                  className="h-4 w-4"
                  required={index === 0}
                />
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="input flex-1"
                  placeholder={`Option ${index + 1}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="btn btn-icon text-destructive"
                  disabled={options.length <= 2}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {question ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionModal;