'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ChapterCard from './components/ChapterCard';
import ProgressBar from './components/ProgressBar';
import AuthForm from './components/AuthForm';
import { auth, db } from '@/lib/firebase';
import { User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { chapters, finalExam } from '@/lib/lessons';
import ChapterContent from './components/ChapterContent';
import FinalExam from './components/FinalExam';
import CodeEditor from './components/CodeEditor';

const Page = () => {
  const [currentChapter, setCurrentChapter] = useState<number | null>(null);
  const [currentLesson, setCurrentLesson] = useState<number | null>(null);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [user, setUser] = useState<User | null>(null);
  const [showFinalExam, setShowFinalExam] = useState(false);
  const [finalExamCompleted, setFinalExamCompleted] = useState(false);
  const [certificateGenerated, setCertificateGenerated] = useState(false);
  const [showFreeCoding, setShowFreeCoding] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        fetchProgress(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchProgress = async (userId: string) => {
    const docRef = doc(db, 'progress', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as Record<string, boolean>;
      setProgress(data);
      setFinalExamCompleted(data.finalExamCompleted || false);
    } else {
      const initialProgress = chapters.reduce((acc, chapter) => {
        acc[`chapter_${chapter.id}`] = false;
        chapter.lessons.forEach(lesson => {
          acc[`lesson_${chapter.id}_${lesson.id}`] = false;
        });
        return acc;
      }, {} as Record<string, boolean>);
      initialProgress.finalExamCompleted = false;
      await setDoc(docRef, initialProgress);
      setProgress(initialProgress);
    }
  };

  const updateProgress = async (key: string, completed: boolean) => {
    if (user) {
      const newProgress = { ...progress, [key]: completed };
      setProgress(newProgress);
      await setDoc(doc(db, 'progress', user.uid), newProgress);

      const [type, chapterId, lessonId] = key.split('_');
      if (type === 'lesson') {
        const chapter = chapters.find(ch => ch.id === parseInt(chapterId));
        if (chapter && chapter.lessons.every(lesson => newProgress[`lesson_${chapterId}_${lesson.id}`])) {
          newProgress[`chapter_${chapterId}`] = true;
          setProgress(newProgress);
          await setDoc(doc(db, 'progress', user.uid), newProgress);
        }
      }
    }
  };

  const handleAuthSuccess = () => {
    if (user) {
      fetchProgress(user.uid);
    }
  };

  const handleSignOut = async () => {
    await auth.signOut();
    setUser(null);
    setProgress({});
    setCurrentChapter(null);
    setCurrentLesson(null);
    setShowFinalExam(false);
    setFinalExamCompleted(false);
    setShowFreeCoding(false);
  };

  const isChapterLocked = (chapterId: number) => {
    if (chapterId === 1) return false;
    return !progress[`chapter_${chapterId - 1}`];
  };

  const allChaptersCompleted = chapters.every(chapter => progress[`chapter_${chapter.id}`]);
  const completedChapters = chapters.filter(chapter => progress[`chapter_${chapter.id}`]).length;
  const progressPercentage = (completedChapters / chapters.length) * 100;

  const handleGenerateCertificate = async () => {
    if (!user) return;

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) return;

    const { fullName, email } = userDoc.data();
    const issueDate = new Date().toISOString().split('T')[0];
    const expiryDate = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0];
    console.log("Generating certificate for:", fullName, email);
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${process.env.NEXT_PUBLIC_CERTIFIER_API_KEY}`
      },
      body: JSON.stringify({
        recipient: { name: fullName, email: email },
        issueDate: issueDate,
        expiryDate: expiryDate,
        groupId: process.env.NEXT_PUBLIC_CERTIFIER_GROUP_ID
      })
    };

    try {
      const res = await fetch('https://api.certifier.io/v1/credentials/create-issue-send', options);
      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }
      const data = await res.json();
      // console.log(data);
      setCertificateGenerated(true);
      alert("Certificate generated successfully! Check your email.");
    } catch (err) {
      console.error(err);
      alert("This feature isn't working right now. Please try again later!");
    }
  };

  const handleRunCode = async (code: string) => {
    try {
      const res = await fetch('https://elixir.ayaangrover.hackclub.app/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }
      const data = await res.json();
      console.log('Code execution output:', data.output);
      alert(`Code execution output:\n${data.output}`);
    } catch (err) {
      console.error(err);
      alert('Failed to execute code. Please try again later.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-blue-400 to-white py-8 px-4 sm:px-6 lg:px-8"
    >
      <Card className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <CardHeader className="bg-blue-600 p-6 text-center">
          <CardTitle className="text-4xl font-extrabold text-white">
            Elixir Academy
          </CardTitle>
          <p className="text-xl text-blue-100 mt-2">Master the art of magical programming!</p>
        </CardHeader>
        <CardContent className="p-6">
          {user ? (
            <>
              <div className="mb-8 flex justify-between items-center">
                <ProgressBar progress={progressPercentage} />
                <Button onClick={handleSignOut} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full text-lg transition-colors duration-200">
                  Sign Out
                </Button>
              </div>
              {currentChapter === null ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {chapters.map((chapter) => (
                    <ChapterCard
                      key={chapter.id}
                      chapter={{
                        id: chapter.id,
                        title: chapter.title,
                        description: chapter.description,
                        completed: progress[`chapter_${chapter.id}`] || false,
                        locked: isChapterLocked(chapter.id)
                      }}
                      onClick={() => !isChapterLocked(chapter.id) && setCurrentChapter(chapter.id)}
                    />
                  ))}
                </div>
              ) : (
                <ChapterContent
                  chapter={chapters[currentChapter - 1]}
                  currentLesson={currentLesson}
                  setCurrentLesson={setCurrentLesson}
                  progress={progress}
                  updateProgress={updateProgress}
                  onClose={() => {
                    setCurrentChapter(null);
                    setCurrentLesson(null);
                  }}
                />
              )}
              {allChaptersCompleted && !showFinalExam && !finalExamCompleted && (
                <div className="mt-8 text-center">
                  <Button 
                    onClick={() => setShowFinalExam(true)}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full text-lg transition-colors duration-200"
                  >
                    Take Final Exam
                  </Button>
                </div>
              )}
              {showFinalExam && (
                <FinalExam
                  exam={finalExam}
                  onComplete={async () => {
                    alert("Congratulations! You've completed the final exam!");
                    setFinalExamCompleted(true);
                    await updateProgress('finalExamCompleted', true);
                  }}
                  onClose={() => setShowFinalExam(false)}
                />
              )}
              {finalExamCompleted && (
                <>
                  {!certificateGenerated && (
                    <div className="mt-8 text-center">
                      <Button 
                        onClick={handleGenerateCertificate}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full text-lg transition-colors duration-200"
                      >
                        Get Certificate
                      </Button>
                    </div>
                  )}
                  {certificateGenerated && (
                    <div className="mt-8 text-center">
                      <p className="text-green-600 font-bold">Your certificate has been generated and sent to your email!</p>
                    </div>
                  )}
                  <div className="mt-8 text-center">
                    <Button 
                      onClick={() => setShowFreeCoding(true)}
                      className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-full text-lg transition-colors duration-200 mt-4"
                    >
                      Free Coding
                    </Button>
                  </div>
                </>
              )}
              {showFreeCoding && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4">Free Coding</h2>
                  <CodeEditor
                    initialCode=""
                    onSubmit={handleRunCode}
                  />
                </div>
              )}
            </>
          ) : (
            <AuthForm onSuccess={handleAuthSuccess} />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Page;