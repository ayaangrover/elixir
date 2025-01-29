import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lesson } from '@/lib/lessons';
import CodeEditor from './CodeEditor';

interface LessonContentProps {
  lesson: Lesson;
  onComplete: () => void;
  onBack: () => void;
}

const LessonContent: React.FC<LessonContentProps> = ({
  lesson,
  onComplete,
  onBack
}) => {
  const [showPractice, setShowPractice] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const steps = lesson.code.split('\n').filter(step => step.trim() !== '');

  useEffect(() => {
    console.log(`Current code:\n${steps.join('\n')}`);
  }, [steps]);

  const renderDemonstration = () => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Demonstration</CardTitle>
      </CardHeader>
      <CardContent>
        <CodeEditor
          initialCode={steps.join('\n')}
          readOnly={true}
        />
        <div className="mt-4 flex justify-between">
          <Button 
            onClick={() => {
              setShowPractice(true);
              console.log('Moving to practice question');
            }}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderPractice = () => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Practice: {lesson.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{lesson.practice.instructions}</p>
        <CodeEditor
          initialCode={lesson.practice.initialCode}
          onSubmit={(code) => {
            console.log('Submitted practice code:', code);
            if (lesson.practice.test(code)) {
              console.log('Practice completed successfully');
              onComplete();
            } else {
              console.log('Practice attempt failed');
              alert('Your solution is not correct. Please try again!');
            }
          }}
        />
        <Button 
          onClick={() => setShowAnswer(!showAnswer)} 
          className="mt-4"
        >
          {showAnswer ? 'Hide Answer' : 'Reveal Answer'}
        </Button>
        {showAnswer && (
          <div className="mt-4">
            <h3 className="text-lg font-bold">Answer:</h3>
            <CodeEditor
              initialCode={lesson.practice.solution}
              readOnly={true}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{lesson.title}</h2>
      <p className="mb-4">{lesson.content}</p>
      {showPractice ? renderPractice() : renderDemonstration()}
      <Button onClick={() => {
        console.log('Returning to lesson selection');
        onBack();
      }} className="mt-4">Back to Lessons</Button>
    </div>
  );
};

export default LessonContent;