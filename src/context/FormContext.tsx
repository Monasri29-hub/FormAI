import React, { createContext, useContext, useState, useEffect } from 'react';
import { Form, FormResponse, GroupAnalysis, Question } from '../types';
import { MOCK_RESPONSES, MOCK_GROUP_ANALYSIS } from '../dummyData/mockResponses';

const API_BASE = `http://${window.location.hostname}:5000/api`;

interface FormContextType {
  forms: Form[];
  addForm: (form: Form) => Promise<void>;
  deleteForm: (id: string) => void;
  updateForm: (id: string, updates: Partial<Form>) => void;
  responses: FormResponse[];
  selectedFormId: string | null;
  setSelectedFormId: (id: string | null) => void;
  isLoading: boolean;
  fetchResponses: (formId: string) => Promise<FormResponse[]>;
  fetchGroupAnalysis: (formId: string) => Promise<GroupAnalysis>;
  submitResponse: (formId: string, responseData: { userName: string; userEmail: string; answers: { [key: string]: any }; completionTime: number; emotion: string }) => Promise<FormResponse>;
  generateFormFromLink: (url: string) => Promise<{ title: string; description: string; questions: Question[] }>;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<string | null>('hackathon-1');
  const [responses, setResponses] = useState<FormResponse[]>(MOCK_RESPONSES);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch all forms on load
  const fetchForms = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/forms`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setForms(data);
          // Set default selected form if available
          if (!selectedFormId || !data.some((f: any) => f.id === selectedFormId)) {
            setSelectedFormId(data[0].id);
          }
        } else {
          // If server database is empty, seed forms locally as backup
          setForms(FALLBACK_FORMS);
        }
      } else {
        setForms(FALLBACK_FORMS);
      }
    } catch (err) {
      console.warn('⚠️ Failed to connect to backend server. Operating in robust offline mode.');
      setForms(FALLBACK_FORMS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  // Fetch responses for active selected form
  useEffect(() => {
    if (!selectedFormId) return;

    const loadResponses = async () => {
      try {
        const res = await fetch(`${API_BASE}/forms/${selectedFormId}/responses`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setResponses(data);
          } else if (selectedFormId === 'hackathon-1') {
            setResponses(MOCK_RESPONSES);
          } else {
            setResponses([]);
          }
        }
      } catch (err) {
        console.warn('Offline mode: displaying local mock responses for hackathon form.');
        if (selectedFormId === 'hackathon-1') {
          setResponses(MOCK_RESPONSES);
        } else {
          setResponses([]);
        }
      }
    };

    loadResponses();
  }, [selectedFormId]);

  const addForm = async (form: Form) => {
    try {
      const res = await fetch(`${API_BASE}/forms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        const newForm = await res.json();
        setForms(prev => [newForm, ...prev]);
        setSelectedFormId(newForm.id);
      } else {
        // Fallback save in-memory
        setForms(prev => [form, ...prev]);
        setSelectedFormId(form.id);
      }
    } catch (err) {
      setForms(prev => [form, ...prev]);
      setSelectedFormId(form.id);
    }
  };

  const deleteForm = (id: string) => {
    // Basic local delete
    setForms(prev => prev.filter(f => f.id !== id));
    if (selectedFormId === id) {
      setSelectedFormId(forms.find(f => f.id !== id)?.id || null);
    }
  };

  const updateForm = (id: string, updates: Partial<Form>) => {
    setForms(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const fetchResponses = async (formId: string): Promise<FormResponse[]> => {
    try {
      const res = await fetch(`${API_BASE}/forms/${formId}/responses`);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (err) {
      console.warn('Fetch responses failed, using fallback.');
    }
    return formId === 'hackathon-1' ? MOCK_RESPONSES : [];
  };

  const fetchGroupAnalysis = async (formId: string): Promise<GroupAnalysis> => {
    try {
      const res = await fetch(`${API_BASE}/forms/${formId}/analysis`);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (err) {
      console.warn('Fetch group analysis failed, using fallback.');
    }
    return MOCK_GROUP_ANALYSIS;
  };

  const submitResponse = async (formId: string, responseData: { userName: string; userEmail: string; answers: { [key: string]: any }; completionTime: number; emotion: string }): Promise<FormResponse> => {
    try {
      const res = await fetch(`${API_BASE}/forms/${formId}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(responseData)
      });
      if (res.ok) {
        const submitted = await res.json();
        // Update local responses
        setResponses(prev => [submitted, ...prev]);
        // Update form response count in local forms list
        setForms(prev => prev.map(f => f.id === formId ? { ...f, responsesCount: (f.responsesCount || 0) + 1 } : f));
        return submitted;
      }
      throw new Error('Failed to submit response to backend');
    } catch (err: any) {
      console.error('Submission failed, compiling in-memory response:', err);
      // Simulation fallback if offline
      const mockResult: FormResponse = {
        id: `r_${Math.random().toString(36).substr(2, 6)}`,
        formId,
        userName: responseData.userName,
        userEmail: responseData.userEmail,
        answers: responseData.answers,
        submittedAt: new Date().toISOString(),
        emotion: responseData.emotion as any,
        isSpam: false,
        completionTime: responseData.completionTime,
        analysis: {
          sentiment: 'positive',
          personality: ['Sincere', 'Analytical'],
          confidence: 85,
          interestAreas: ['Coding', 'Development'],
          engagementScore: 90,
          summary: 'Successfully saved in-memory (backend offline fallback). Feedback is logical and sincere.',
          isSpam: false,
          spamRisk: 5
        }
      };
      setResponses(prev => [mockResult, ...prev]);
      setForms(prev => prev.map(f => f.id === formId ? { ...f, responsesCount: (f.responsesCount || 0) + 1 } : f));
      return mockResult;
    }
  };

  const generateFormFromLink = async (url: string): Promise<{ title: string; description: string; questions: Question[] }> => {
    try {
      const res = await fetch(`${API_BASE}/forms/generate-from-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      if (res.ok) {
        return await res.json();
      }
      throw new Error('Failed to compile URL template from server');
    } catch (err: any) {
      console.error('URL form generation failed, providing custom template:', err);
      // Offline mock fallback questions
      return {
        title: `AI Form from ${url.replace('https://', '').replace('http://', '').split('/')[0]}`,
        description: `Custom smart feedback designed based on link reference context: ${url}`,
        questions: [
          { id: 'off_q1', type: 'text', title: 'User Identity (Full Name)', required: true },
          { id: 'off_q2', type: 'rating', title: 'Rate your experience matching the link objectives', required: true },
          { id: 'off_q3', type: 'multiple-choice', title: 'What is your primary category of interest?', options: ['Developer Track', 'Content Quality', 'UI Layout', 'General Support'], required: true },
          { id: 'off_q4', type: 'yes-no', title: 'Would you recommend this website platform to colleagues?', required: true }
        ]
      };
    }
  };

  return (
    <FormContext.Provider value={{ 
      forms, 
      addForm, 
      deleteForm, 
      updateForm, 
      responses, 
      selectedFormId, 
      setSelectedFormId,
      isLoading,
      fetchResponses,
      fetchGroupAnalysis,
      submitResponse,
      generateFormFromLink
    }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForms = () => {
  const context = useContext(FormContext);
  if (!context) throw new Error('useForms must be used within a FormProvider');
  return context;
};

// Fallback initial structures
const FALLBACK_FORMS: Form[] = [
  {
    id: 'hackathon-1',
    title: 'Hackathon Registration',
    description: 'Registration form for the upcoming dev hackathon',
    questions: [
      { id: 'h1', type: 'text', title: 'Student Name', required: true },
      { id: 'h2', type: 'email', title: 'Email Address', required: true },
      { id: 'h3', type: 'text', title: 'College Name', required: true },
      { id: 'h4', type: 'multiple-choice', title: 'Preferred Domain', options: ['Web Dev', 'App Dev', 'AI/ML', 'Blockchain', 'Cloud'], required: true },
      { id: 'h5', type: 'text', title: 'Skills (e.g. React, Python, UI/UX)', required: true },
      { id: 'h6', type: 'yes-no', title: 'Previous Hackathon Experience', required: true },
      { id: 'h7', type: 'rating', title: 'How comfortable are you coding under tight timelines?', required: true }
    ],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    responsesCount: 4,
    status: 'active',
    shareUrl: `${window.location.origin}/?fill=hackathon-1`
  },
  {
    id: 'feedback-1',
    title: 'College Event Feedback',
    description: 'Collect student feedback after the annual fest',
    questions: [
      { id: 'f1', type: 'text', title: 'Name', required: false },
      { id: 'f2', type: 'rating', title: 'Rate the organization quality', required: true },
      { id: 'f3', type: 'multiple-choice', title: 'Which session did you find most valuable?', options: ['AI Keynote', 'Robotics Workshop', 'Panel Discussion', 'Project Expo'], required: true },
      { id: 'f4', type: 'yes-no', title: 'Would you attend next year?', required: true },
      { id: 'f5', type: 'text', title: 'What could we improve for the next event?', required: false }
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    responsesCount: 0,
    status: 'active',
    shareUrl: `${window.location.origin}/?fill=feedback-1`
  }
];
