import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

interface ChapterCardProps {
  chapter: {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    locked: boolean;
  };
  onClick: () => void;
}

const ChapterCard: React.FC<ChapterCardProps> = ({ chapter, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Card 
        className={`cursor-pointer transition-colors duration-200 ${
          chapter.completed ? 'bg-green-100 border-green-500' : 'bg-white'
        } ${chapter.locked ? 'opacity-50' : ''}`}
        onClick={onClick}
      >
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-center text-blue-800 flex items-center justify-center">
            {chapter.locked && <Lock className="mr-2" size={16} />}
            {chapter.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-2">{chapter.description}</p>
          <p className="text-center">
            {chapter.completed ? (
              <span className="text-green-500">✓ Completed</span>
            ) : chapter.locked ? (
              <span className="text-gray-500">Locked</span>
            ) : (
              <span className="text-blue-500">Not started</span>
            )}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ChapterCard;