import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

interface LessonCardProps {
  lesson: {
    id: number;
    title: string;
    completed: boolean;
    locked: boolean;
  };
  onClick: () => void;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Card 
        className={`cursor-pointer transition-colors duration-200 ${
          lesson.completed ? 'bg-green-100 border-green-500' : 'bg-white'
        } ${lesson.locked ? 'opacity-50' : ''}`}
        onClick={onClick}
      >
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-center text-blue-800 flex items-center justify-center">
            {lesson.locked && <Lock className="mr-2" size={16} />}
            {lesson.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {lesson.completed ? (
            <span className="text-green-500">✓ Completed</span>
          ) : lesson.locked ? (
            <span className="text-gray-500">Locked</span>
          ) : (
            <span className="text-blue-500">Not started</span>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LessonCard;