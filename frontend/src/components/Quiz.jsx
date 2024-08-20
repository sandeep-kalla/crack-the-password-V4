/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import api from '../services/api.js'; // Assuming you have an API service for MongoDB operations
import '../styles/quiz.css'; // Create a CSS file for quiz styling
import Lottie from 'lottie-react'; // Import the Lottie library
import successAnimation from '../assets/success-animation.json'; // Import the success animation JSON file

const questions = [
  { id: 1, question: "Who is known as the father of the computer?", options: ["Alan Turing", "Charles Babbage", "John von Neumann", "Thomas Edison"], answer: "Charles Babbage" },
  { id: 2, question: "What programming language was designed by James Gosling at Sun Microsystems in 1995?", options: ["C++", "Python", "Java", "Perl"], answer: "Java" },
  { id: 3, question: "What does SQL stand for?", options: ["Simple Query Language", "Structured Query Language", "Standard Query Language", "Sequential Query Language"], answer: "Structured Query Language" },
  { id: 4, question: "Who developed the World Wide Web in 1989?", options: ["Bill Gates", "Steve Jobs", "Tim Berners-Lee", "Vint Cerf"], answer: "Tim Berners-Lee" },
  { id: 5, question: "Which programming language is known for its use in web development and has an extension of .js?", options: ["Python", "Java", "JavaScript", "Ruby"], answer: "JavaScript" },
  { id: 6, question: "What does HTML stand for?", options: ["Hyperlinks and Text Markup Language", "Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinking Text Management Language"], answer: "Hyper Text Markup Language" },
  { id: 7, question: "Which data structure uses the Last In, First Out (LIFO) principle?", options: ["Queue", "Stack", "Array", "Linked List"], answer: "Stack" },
  { id: 8, question: "What is the time complexity of accessing an element in an array by its index?", options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"], answer: "O(1)" },
  { id: 9, question: "Which of the following is a valid JavaScript variable declaration?", options: ["var 1name;", "var _name;", "var name-1;", "var @name;"], answer: "var _name;" },
  { id: 10, question: "What does DBMS stand for?", options: ["Data Base Management System", "Data Building Management System", "Data Block Management System", "Data Basic Management System"], answer: "Data Base Management System" }
];

const Quiz = ({ userEmail, quizSubmitted }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState(Array(questions.length).fill(null));
  const [attempted, setAttempted] = useState(Array(questions.length).fill(false));
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [showSubmissionCard, setShowSubmissionCard] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionTimer, setQuestionTimer] = useState(Array(questions.length).fill(20));
  const [expiredQuestions, setExpiredQuestions] = useState([]);
  const [timer, setTimer] = useState(0);
  const [milliseconds, setMilliseconds] = useState(0);

  const isInitialMount = useRef(true);

  // Load saved state from localStorage
  useEffect(() => {
    const savedSelectedOptions = localStorage.getItem('selectedOptions');
    const savedAttempted = localStorage.getItem('attempted');
    const savedCurrentQuestionIndex = localStorage.getItem('currentQuestionIndex');
    const savedQuizCompleted = localStorage.getItem('quizCompleted');
    const savedQuestionTimer = localStorage.getItem('questionTimer');
    const savedExpiredQuestions = localStorage.getItem('expiredQuestions');
    const savedTimer = localStorage.getItem('timer');
    const savedMilliseconds = localStorage.getItem('milliseconds');

    if (savedSelectedOptions) {
      setSelectedOptions(JSON.parse(savedSelectedOptions));
    }
    if (savedAttempted) {
      setAttempted(JSON.parse(savedAttempted));
    }
    if (savedCurrentQuestionIndex) {
      setCurrentQuestionIndex(Number(savedCurrentQuestionIndex));
    }
    if (savedQuizCompleted) {
      setQuizCompleted(JSON.parse(savedQuizCompleted));
    }
    if (savedQuestionTimer) {
      setQuestionTimer(JSON.parse(savedQuestionTimer));
    }
    if (savedExpiredQuestions) {
      setExpiredQuestions(JSON.parse(savedExpiredQuestions));
    }
    if (savedTimer) {
      setTimer(Number(savedTimer));
    }
    if (savedMilliseconds) {
      setMilliseconds(Number(savedMilliseconds));
    }
  }, []);

  // Save selected options, attempted questions, and other states to localStorage
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      localStorage.setItem('selectedOptions', JSON.stringify(selectedOptions));
      localStorage.setItem('attempted', JSON.stringify(attempted));
      localStorage.setItem('currentQuestionIndex', currentQuestionIndex);
      localStorage.setItem('quizCompleted', JSON.stringify(quizCompleted));
      localStorage.setItem('questionTimer', JSON.stringify(questionTimer));
      localStorage.setItem('expiredQuestions', JSON.stringify(expiredQuestions));
      localStorage.setItem('timer', timer);
      localStorage.setItem('milliseconds', milliseconds);
    }
  }, [selectedOptions, attempted, currentQuestionIndex, quizCompleted, questionTimer, expiredQuestions, timer, milliseconds]);

  // Timer for the overall quiz
  useEffect(() => {
    const interval = setInterval(() => {
      setMilliseconds((prev) => {
        if (prev >= 99) {
          setTimer((prevTimer) => prevTimer + 1);
          return 0;
        }
        return prev + 1;
      });
    }, 10);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (questionTimer[currentQuestionIndex] > 0 && !isSubmitting) {
      const timerInterval = setInterval(() => {
        setQuestionTimer((prev) => {
          const newTimer = [...prev];
          newTimer[currentQuestionIndex] -= 1;
          return newTimer;
        });
      }, 1000);

      return () => clearInterval(timerInterval);
    } else {
      if (!attempted[currentQuestionIndex]) {
        setExpiredQuestions((prev) => [...prev, currentQuestionIndex]);
      }
      if (!isSubmitting) {
        handleNextQuestion();
      }
    }
  }, [questionTimer, currentQuestionIndex, isSubmitting]);

  const handleOptionSelect = (option) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestionIndex] = option;
    setSelectedOptions(newSelectedOptions);
    setAttempted((prev) => {
      const newAttempted = [...prev];
      newAttempted[currentQuestionIndex] = true;
      return newAttempted;
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptions((prev) => {
        const newSelected = [...prev];
        newSelected[currentQuestionIndex + 1] = null;
        return newSelected;
      });
    } else {
      const score = calculateScore();
      setQuizCompleted(true);
      setIsSubmitting(true);
      console.log(`User Email: ${userEmail}`);
      console.log(`Score: ${score}`);
      console.log(`Time: ${timer}.${milliseconds}`);

      if (!quizSubmitted) { // Check if the quiz has not been submitted before
        api.submitQuizResults({ email: userEmail, score, time: `${timer}.${milliseconds}` })
          .then(response => {
            console.log(response.data.message);
            setSubmissionMessage('Quiz submitted successfully! Thank you for participating.');
            setShowSubmissionCard(true);
          })
          .catch(error => {
            console.error('Error submitting quiz results:', error.message);
            setIsSubmitting(false);
          });
      }
    }
  };

  const calculateScore = () => {
    return attempted.reduce((score, attempted, index) => {
      return attempted && selectedOptions[index] === questions[index].answer ? score + 1 : score;
    }, 0);
  };

  const handleQuestionNumberClick = (index) => {
    if (!expiredQuestions.includes(index)) {
      setCurrentQuestionIndex(index);
      setSelectedOptions((prev) => {
        const newSelected = [...prev];
        return newSelected;
      });
    }
  };

  return (
    <div className="quiz-container">
      {quizCompleted && showSubmissionCard ? (
        <div className="submission-card-container">
          <Lottie animationData={successAnimation} loop={false} autoplay={true} style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }} />
          <div className="submission-card">
            <h2>Quiz Submitted!</h2>
            <p>{submissionMessage}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="timer">Time: {timer}.{milliseconds < 10 ? `0${milliseconds}` : milliseconds}s</div>
          <div className="question-header">
            <h2>Question {currentQuestionIndex + 1} of {questions.length}</h2>
            <div className="question-numbers">
              {questions.map((_, index) => (
                <div 
                  key={index} 
                  className={`question-number ${index === currentQuestionIndex ? 'active' : ''} ${attempted[index] ? 'attempted' : ''} ${expiredQuestions.includes(index) ? 'expired' : ''}`}
                  onClick={() => handleQuestionNumberClick(index)}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>
          <div className="question">
            <h3>{questions[currentQuestionIndex].question}</h3>
            <div className="question-timer">Time left: {questionTimer[currentQuestionIndex]}s</div>
            <div className="options">
              {questions[currentQuestionIndex].options.map((option, index) => (
                <button
                  key={index}
                  className={`option-button ${selectedOptions[currentQuestionIndex] === option ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <button className="next-button" onClick={handleNextQuestion}>
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Submit Quiz'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Quiz;

