import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Copy } from 'lucide-react';

interface TutorialProps {
  lesson: {
    id: number;
    title: string;
    description: string;
    steps: {
      code: string;
      explanation: string;
    }[];
  };
  onClose: () => void;
  onComplete: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ lesson, onClose, onComplete }) => {
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nextStep = () => {
    if (step < lesson.steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
      onClose();
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      >
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full overflow-hidden">
          <div className="p-6">
            <h2 className="text-3xl font-bold mb-2 text-blue-800">{lesson.title}</h2>
            <p className="text-xl text-blue-700 mb-4">{lesson.description}</p>
            <Card className="bg-blue-50 border-blue-300 shadow-lg mb-4">
              <CardContent className="p-4 relative">
                <pre className="text-sm text-blue-900 whitespace-pre-wrap overflow-x-auto">
                  <code>{lesson.steps[step].code}</code>
                </pre>
                <Button
                  onClick={() => copyCode(lesson.steps[step].code)}
                  className="absolute top-2 right-2 p-2"
                  variant="ghost"
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-blue-500" />}
                </Button>
              </CardContent>
            </Card>
            <p className="text-lg text-blue-800 mb-4">{lesson.steps[step].explanation}</p>
          </div>
          <div className="flex justify-between p-6 bg-blue-100">
            <Button onClick={prevStep} variant="outline" className="bg-white text-blue-700 hover:bg-blue-50 hover:text-blue-800 border-blue-300">
              {step === 0 ? 'Exit' : 'Previous'}
            </Button>
            <Button onClick={nextStep} className="bg-blue-600 text-white hover:bg-blue-700">
              {step === lesson.steps.length - 1 ? 'Complete' : 'Next'}
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Tutorial;