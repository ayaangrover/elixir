import React from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Chapter, Lesson } from '@/lib/lessons';
import { Lock } from 'lucide-react';
import LessonContent from './LessonContent';

interface ChapterContentProps {
  chapter: Chapter;
  currentLesson: number | null;
  setCurrentLesson: (lesson: number | null) => void;
  progress: Record<string, boolean>;
  updateProgress: (key: string, completed: boolean) => void;
  onClose: () => void;
}

const ChapterContent: React.FC<ChapterContentProps> = ({
  chapter,
  currentLesson,
  setCurrentLesson,
  progress,
  updateProgress,
  onClose
}) => {
  const isLessonLocked = (lessonId: number) => {
    if (lessonId === 1) return false;
    return !progress[`lesson_${chapter.id}_${lessonId - 1}`];
  };

  if (currentLesson !== null) {
    return (
      <LessonContent
        lesson={chapter.lessons[currentLesson - 1]}
        onComplete={() => {
          updateProgress(`lesson_${chapter.id}_${currentLesson}`, true);
          if (currentLesson === chapter.lessons.length) {
            updateProgress(`chapter_${chapter.id}`, true);
            onClose();
          } else {
            setCurrentLesson(null);
          }
        }}
        onBack={() => setCurrentLesson(null)}
      />
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{chapter.title}</h2>
      <p className="mb-4">{chapter.description}</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {chapter.lessons.map((lesson) => (
          <Card 
            key={lesson.id}
            className={`cursor-pointer transition-colors duration-200 ${
              progress[`lesson_${chapter.id}_${lesson.id}`] ? 'bg-green-100 border-green-500' : 'bg-white'
            } ${isLessonLocked(lesson.id) ? 'opacity-50' : ''}`}
            onClick={() => !isLessonLocked(lesson.id) && setCurrentLesson(lesson.id)}
          >
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-center text-blue-800 flex items-center justify-center">
                {isLessonLocked(lesson.id) && <Lock className="mr-2" size={16} />}
                {lesson.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {progress[`lesson_${chapter.id}_${lesson.id}`] ? (
                <span className="text-green-500">✓ Completed</span>
              ) : isLessonLocked(lesson.id) ? (
                <span className="text-gray-500">Locked</span>
              ) : (
                <span className="text-blue-500">Start Lesson</span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <Button onClick={onClose} className="mt-4">Back to Chapters</Button>
    </div>
  );
};

export default ChapterContent;