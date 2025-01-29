import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CodeEditor from './CodeEditor';

interface FinalExamProps {
  exam: {
    instructions: string;
    initialCode: string;
    solution: string;
    test: (code: string) => boolean;
  };
  onComplete: () => void;
  onClose: () => void;
}

const FinalExam: React.FC<FinalExamProps> = ({ exam, onComplete, onClose }) => {
  const [completed, setCompleted] = useState(false);

  const handleSubmit = (code: string) => {
      setCompleted(true);
      onComplete();
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Final Exam</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{exam.instructions}</p>
        <CodeEditor
          initialCode={exam.initialCode}
          onSubmit={handleSubmit}
        />
        {completed && (
          <div className="mt-4 text-center">
            <p className="text-green-600 font-bold">Congratulations! You've completed the final exam!</p>
            <Button onClick={onClose} className="mt-2">
              Close Exam
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinalExam;