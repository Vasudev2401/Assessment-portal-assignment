import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import {
  fetchDomains,
  addDomain,
  updateDomain,
  deleteDomain,
  addCategory,
  updateCategory,
  deleteCategory,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  Domain,
  Category,
  Question,
} from '../store/domainsSlice';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import DomainCard from '../components/DomainCard';
import DomainModal from '../components/modals/DomainModal';
import CategoryModal from '../components/modals/CategoryModal';
import QuestionModal from '../components/modals/QuestionModal';
import ConfirmationModal from '../components/modals/ConfirmationModal';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { domains, status } = useAppSelector((state) => state.domains);
  const { mode } = useAppSelector((state) => state.theme);

  // State for selected domain
  const [selectedDomainId, setSelectedDomainId] = useState<number | null>(null);
  
  // State for search
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDomains, setFilteredDomains] = useState<Domain[]>([]);
  
  // Modal states
  const [domainModal, setDomainModal] = useState({
    isOpen: false,
    domain: null as Domain | null,
    isEdit: false,
  });
  
  const [categoryModal, setCategoryModal] = useState({
    isOpen: false,
    domainId: null as number | null,
    category: null as Category | null,
    isEdit: false,
  });
  
  const [questionModal, setQuestionModal] = useState({
    isOpen: false,
    domainId: null as number | null,
    categoryId: null as number | null,
    question: null as Question | null,
    isEdit: false,
  });
  
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Fetch domains on component mount
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDomains());
    }
  }, [dispatch, status]);

  // Filter domains based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredDomains(domains);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = domains.filter((domain) => {
      // Check if domain name matches
      if (domain.name.toLowerCase().includes(query)) {
        return true;
      }

      // Check if any category name matches
      const categoryMatch = domain.categories.some(
        (category) => category.name.toLowerCase().includes(query)
      );
      if (categoryMatch) {
        return true;
      }

      // Check if any question text matches
      const questionMatch = domain.categories.some((category) =>
        category.questions.some((question) => question.text.toLowerCase().includes(query))
      );
      if (questionMatch) {
        return true;
      }

      return false;
    });

    setFilteredDomains(filtered);
  }, [domains, searchQuery]);

  // Domain handlers
  const handleAddDomain = () => {
    setDomainModal({
      isOpen: true,
      domain: null,
      isEdit: false,
    });
  };

  const handleEditDomain = (domain: Domain) => {
    setDomainModal({
      isOpen: true,
      domain,
      isEdit: true,
    });
  };

  const handleDeleteDomain = (domainId: number) => {
    setConfirmationModal({
      isOpen: true,
      title: 'Delete Domain',
      message: 'Are you sure you want to delete this domain? This action cannot be undone.',
      onConfirm: () => {
        dispatch(deleteDomain(domainId));
        setConfirmationModal({ ...confirmationModal, isOpen: false });
      },
    });
  };

  const handleDomainSubmit = (name: string) => {
    if (domainModal.isEdit && domainModal.domain) {
      dispatch(updateDomain({ id: domainModal.domain.id, name }));
    } else {
      dispatch(addDomain(name));
    }
    setDomainModal({ ...domainModal, isOpen: false });
  };

  // Category handlers
  const handleAddCategory = (domainId: number) => {
    setCategoryModal({
      isOpen: true,
      domainId,
      category: null,
      isEdit: false,
    });
  };

  const handleEditCategory = (domainId: number, category: Category) => {
    setCategoryModal({
      isOpen: true,
      domainId,
      category,
      isEdit: true,
    });
  };

  const handleDeleteCategory = (domainId: number, categoryId: number) => {
    setConfirmationModal({
      isOpen: true,
      title: 'Delete Category',
      message: 'Are you sure you want to delete this category? This action cannot be undone.',
      onConfirm: () => {
        dispatch(deleteCategory({ domainId, categoryId }));
        setConfirmationModal({ ...confirmationModal, isOpen: false });
      },
    });
  };

  const handleCategorySubmit = (name: string) => {
    if (categoryModal.isEdit && categoryModal.category && categoryModal.domainId) {
      dispatch(
        updateCategory({
          domainId: categoryModal.domainId,
          categoryId: categoryModal.category.id,
          name,
        })
      );
    } else if (categoryModal.domainId) {
      dispatch(addCategory({ domainId: categoryModal.domainId, name }));
    }
    setCategoryModal({ ...categoryModal, isOpen: false });
  };

  // Question handlers
  const handleAddQuestion = (domainId: number, categoryId: number) => {
    setQuestionModal({
      isOpen: true,
      domainId,
      categoryId,
      question: null,
      isEdit: false,
    });
  };

  const handleEditQuestion = (domainId: number, categoryId: number, questionId: number) => {
    const domain = domains.find((d) => d.id === domainId);
    if (!domain) return;

    const category = domain.categories.find((c) => c.id === categoryId);
    if (!category) return;

    const question = category.questions.find((q) => q.id === questionId);
    if (!question) return;

    setQuestionModal({
      isOpen: true,
      domainId,
      categoryId,
      question,
      isEdit: true,
    });
  };

  const handleDeleteQuestion = (domainId: number, categoryId: number, questionId: number) => {
    setConfirmationModal({
      isOpen: true,
      title: 'Delete Question',
      message: 'Are you sure you want to delete this question? This action cannot be undone.',
      onConfirm: () => {
        dispatch(deleteQuestion({ domainId, categoryId, questionId }));
        setConfirmationModal({ ...confirmationModal, isOpen: false });
      },
    });
  };

  const handleQuestionSubmit = (questionData: Omit<Question, 'id'>) => {
    if (
      questionModal.isEdit &&
      questionModal.question &&
      questionModal.domainId &&
      questionModal.categoryId
    ) {
      dispatch(
        updateQuestion({
          domainId: questionModal.domainId,
          categoryId: questionModal.categoryId,
          questionId: questionModal.question.id,
          question: questionData,
        })
      );
    } else if (questionModal.domainId && questionModal.categoryId) {
      dispatch(
        addQuestion({
          domainId: questionModal.domainId,
          categoryId: questionModal.categoryId,
          question: questionData,
        })
      );
    }
    setQuestionModal({ ...questionModal, isOpen: false });
  };

  // Filter domains based on selection
  const displayedDomains = selectedDomainId
    ? filteredDomains.filter((domain) => domain.id === selectedDomainId)
    : filteredDomains;

  return (
    <div className={mode}>
      <div className="min-h-screen bg-background text-foreground">
        <Header onSearch={setSearchQuery} />
        
        <div className="flex">
          <Sidebar onSelectDomain={setSelectedDomainId} selectedDomainId={selectedDomainId} />
          
          <main className="flex-1 p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Assessment Portal Dashboard</h1>
              <button
                onClick={handleAddDomain}
                className="btn btn-primary flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add Domain</span>
              </button>
            </div>
            
            {status === 'loading' ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : status === 'failed' ? (
              <div className="text-center text-destructive p-4">
                Failed to load domains. Please try again.
              </div>
            ) : displayedDomains.length > 0 ? (
              <div className="space-y-4">
                {displayedDomains.map((domain) => (
                  <DomainCard
                    key={domain.id}
                    domain={domain}
                    onEditDomain={handleEditDomain}
                    onDeleteDomain={handleDeleteDomain}
                    onAddCategory={handleAddCategory}
                    onEditCategory={handleEditCategory}
                    onDeleteCategory={handleDeleteCategory}
                    onAddQuestion={handleAddQuestion}
                    onEditQuestion={handleEditQuestion}
                    onDeleteQuestion={handleDeleteQuestion}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center p-8 border border-dashed border-border rounded-lg">
                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? 'No domains found matching your search.'
                    : 'No domains found. Create your first domain to get started.'}
                </p>
                {!searchQuery && (
                  <button onClick={handleAddDomain} className="btn btn-primary">
                    Add Domain
                  </button>
                )}
              </div>
            )}
          </main>
        </div>
        
        {/* Modals */}
        <DomainModal
          isOpen={domainModal.isOpen}
          onClose={() => setDomainModal({ ...domainModal, isOpen: false })}
          onSubmit={handleDomainSubmit}
          domain={domainModal.domain || undefined}
          title={domainModal.isEdit ? 'Edit Domain' : 'Add Domain'}
        />
        
        <CategoryModal
          isOpen={categoryModal.isOpen}
          onClose={() => setCategoryModal({ ...categoryModal, isOpen: false })}
          onSubmit={handleCategorySubmit}
          category={categoryModal.category || undefined}
          title={categoryModal.isEdit ? 'Edit Category' : 'Add Category'}
        />
        
        <QuestionModal
          isOpen={questionModal.isOpen}
          onClose={() => setQuestionModal({ ...questionModal, isOpen: false })}
          onSubmit={handleQuestionSubmit}
          question={questionModal.question || undefined}
          title={questionModal.isEdit ? 'Edit Question' : 'Add Question'}
        />
        
        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={() => setConfirmationModal({ ...confirmationModal, isOpen: false })}
          onConfirm={confirmationModal.onConfirm}
          title={confirmationModal.title}
          message={confirmationModal.message}
        />
      </div>
    </div>
  );
};

export default Dashboard;