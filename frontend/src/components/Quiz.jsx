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
  { id: 10, question: "What does DBMS stand for?", options: ["Data Base Management System", "Data Building Management System", "Data Block Management System", "Data Basic Management System"], answer: "Data Base Management System" },
  { id: 11, question: "Which HTML tag is used to create a hyperlink?", options: ["<img>", "<a>", "<link>", "<href>"], answer: "<a>" },
  { id: 12, question: "Which method is used to find the length of a string in JavaScript?", options: ["length()", "size()", "len()", "length"], answer: "length" },
  { id: 13, question: "Which sorting algorithm is known for being the simplest to implement?", options: ["Quick Sort", "Bubble Sort", "Merge Sort", "Heap Sort"], answer: "Bubble Sort" },
  { id: 14, question: "Which of the following is not a JavaScript data type?", options: ["Undefined", "Number", "Boolean", "Float"], answer: "Float" },
  { id: 15, question: "What does CSS stand for?", options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"], answer: "Cascading Style Sheets" },
  { id: 16, question: "Which HTML element is used to define the title of a document?", options: ["<meta>", "<head>", "<title>", "<header>"], answer: "<title>" },
  { id: 17, question: "What is the purpose of a for loop in programming?", options: ["To iterate over a sequence of elements", "To define a function", "To conditionally execute a block of code", "To create an infinite loop"], answer: "To iterate over a sequence of elements" },
  { id: 18, question: "Which operation is typically used to remove an element from the end of a stack?", options: ["Pop", "Push", "Insert", "Enqueue"], answer: "Pop" },
  { id: 19, question: "What is an if statement used for in programming?", options: ["To iterate over a sequence of elements", "To execute a block of code only if a specified condition is true", "To define a constant", "To return a value from a function"], answer: "To execute a block of code only if a specified condition is true" },
  { id: 20, question: "What does the acronym AI stand for in computer science?", options: ["Artificial Insight", "Algorithmic Intelligence", "Advanced Integration", "Artificial Intelligence"], answer: "Artificial Intelligence" },

  { id: 21, question: "Which programming language is primarily used for developing Android apps?", options: ["Swift", "Kotlin", "Ruby", "C++"], answer: "Kotlin" },
  { id: 22, question: "Which algorithm is commonly used for finding the shortest path in a graph?", options: ["Quick Sort", "Dijkstra's Algorithm", "Merge Sort", "Binary Search"], answer: "Dijkstra's Algorithm" },
  { id: 23, question: "Which of the following is an example of a NoSQL database?", options: ["MySQL", "PostgreSQL", "MongoDB", "SQLite"], answer: "MongoDB" },
  { id: 24, question: "What does the acronym HTTP stand for?", options: ["Hypertext Transfer Protocol", "Hyperlink Text Transfer Protocol", "Hypertext Transmission Protocol", "Hypertext Transfer Program"], answer: "Hypertext Transfer Protocol" },
  { id: 25, question: "Which HTML tag is used to define an unordered list?", options: ["<ol>", "<ul>", "<li>", "<list>"], answer: "<ul>" },
  { id: 26, question: "In CSS, how do you select an element with the ID 'header'?", options: [".header", "#header", "header", "*header"], answer: "#header" },
  { id: 27, question: "Which data structure is used to implement a queue?", options: ["Stack", "Linked List", "Array", "Tree"], answer: "Linked List" },
  { id: 28, question: "What is the primary use of a hash table?", options: ["Storing data in sorted order", "Mapping keys to values", "Finding the maximum value in a list", "Implementing a stack"], answer: "Mapping keys to values" },
  { id: 29, question: "Which sorting algorithm has an average time complexity of O(n log n)?", options: ["Bubble Sort", "Merge Sort", "Insertion Sort", "Selection Sort"], answer: "Merge Sort" },
  { id: 30, question: "Which JavaScript function is used to parse a string and return an integer?", options: ["parseInt()", "toInt()", "int()", "Number()"], answer: "parseInt()" },
  { id: 31, question: "In a binary search algorithm, what is the time complexity of searching an element in a sorted array?", options: ["O(n)", "O(log n)", "O(n^2)", "O(1)"], answer: "O(log n)" },
  { id: 32, question: "Which of the following algorithms is used for searching in a balanced binary search tree (BST)?", options: ["Breadth-First Search", "Depth-First Search", "Binary Search", "Linear Search"], answer: "Binary Search" },
  { id: 33, question: "Which CSS property is used to change the text color of an element?", options: ["font-color", "text-color", "color", "background-color"], answer: "color" },
  { id: 34, question: "Which data structure is used to implement recursion?", options: ["Queue", "Stack", "Linked List", "Heap"], answer: "Stack" },
  { id: 35, question: "What does the acronym JSON stand for?", options: ["JavaScript Object Notation", "JavaScript Oriented Notation", "Java System Object Notation", "JavaScript Object Network"], answer: "JavaScript Object Notation" },
  { id: 36, question: "Which HTML attribute is used to define inline styles?", options: ["style", "class", "id", "link"], answer: "style" },
  { id: 37, question: "In JavaScript, which method is used to add an element to the end of an array?", options: ["push()", "append()", "add()", "insert()"], answer: "push()" },
  { id: 38, question: "Which of the following is not a valid SQL command?", options: ["SELECT", "INSERT", "UPDATE", "MODIFY"], answer: "MODIFY" },
  { id: 39, question: "Which method is used to convert a string to lowercase in JavaScript?", options: ["toLowerCase()", "lower()", "strtolower()", "stringToLower()"], answer: "toLowerCase()" },
  { id: 40, question: "Which data structure is used for implementing a priority queue?", options: ["Stack", "Heap", "Queue", "Linked List"], answer: "Heap" },

  { id: 41, question: "What has keys but can't open locks?", options: ["A piano", "A map", "A computer", "A telephone"], answer: "A piano" },
  { id: 42, question: "What comes once in a minute, twice in a moment, but never in a thousand years?", options: ["The letter 'M'", "The number 1", "The letter 'E'", "The letter 'O'"], answer: "The letter 'M'" },
  { id: 43, question: "A man is looking at a picture of someone. His friend asks, 'Who is it you are looking at?' The man replies, 'Brothers and sisters, I have none. But that person in the picture is my father’s son’s son.' Who is the person in the picture?", options: ["The man himself", "His father", "His son", "His brother"], answer: "His son" },
  { id: 44, question: "What has a neck but no head, two arms but no hands?", options: ["A shirt", "A clock", "A bottle", "A sweater"], answer: "A shirt" },
  { id: 45, question: "You see a house with two doors. One door leads to certain death and the other door leads to freedom. You can ask one question to determine which door leads to freedom. What do you ask?", options: ["Which door would the other person say leads to freedom?", "What’s behind each door?", "Which door is the safest?", "Which door is the most secure?"], answer: "Which door would the other person say leads to freedom?" },
  { id: 46, question: "I speak without a mouth and hear without ears. I have nobody, but I come alive with the wind. What am I?", options: ["An echo", "A shadow", "A breeze", "A drum"], answer: "An echo" },
  { id: 47, question: "A man is trapped in a room with two doors. One door leads to a lion that hasn’t eaten in 3 years, and the other door leads to a room full of fire. Which door should he choose to survive?", options: ["The door with the lion", "The door with the fire", "Either door", "The door without a lion or fire"], answer: "The door with the lion" },
  { id: 48, question: "What can travel around the world while staying in a corner?", options: ["A stamp", "A shadow", "A kite", "A coin"], answer: "A stamp" },
  { id: 49, question: "A man is pushing his car along a road when he comes to a hotel. He shouts, 'I’m bankrupt!' Why?", options: ["He’s playing Monopoly", "He’s out of gas", "He’s lost all his money", "He’s stuck in a traffic jam"], answer: "He’s playing Monopoly" },
  { id: 50, question: "What is so fragile that saying its name breaks it?", options: ["Silence", "Glass", "A promise", "A balloon"], answer: "Silence" },
  { id: 51, question: "A box without hinges, key, or lid, yet golden treasure inside is hid. What am I?", options: ["An egg", "A book", "A safe", "A chest"], answer: "An egg" },
  { id: 52, question: "What has many teeth but can’t bite?", options: ["A comb", "A saw", "A zipper", "A rake"], answer: "A comb" },
  { id: 53, question: "A man is found dead in a locked room with a puddle of water around him. How did he die?", options: ["He fell from a height", "He was drowned", "He was trapped in the room with ice that melted", "He was poisoned"], answer: "He was trapped in the room with ice that melted" },
  { id: 54, question: "What can be cracked, made, told, and played?", options: ["A joke", "A code", "A record", "A book"], answer: "A joke" },
  { id: 55, question: "A word I know, six letters it contains, remove one letter and 12 remains. What is the word?", options: ["Dozens", "Circle", "Twelve", "Dozen"], answer: "Dozen" },
  { id: 56, question: "What has cities, but no houses; forests, but no trees; and rivers, but no water?", options: ["A map", "A globe", "A painting", "A book"], answer: "A map" },
  { id: 57, question: "What has an end but no beginning, a home but no house, and a bed but never sleeps?", options: ["A river", "A road", "A dream", "A shadow"], answer: "A river" },
  { id: 58, question: "What has a head, a tail, is brown, and has no legs?", options: ["A penny", "A snake", "A coin", "A lizard"], answer: "A penny" },
  { id: 59, question: "What gets wetter as it dries?", options: ["A towel", "A sponge", "A paper", "A mop"], answer: "A towel" },
  { id: 60, question: "What is so fragile that saying its name breaks it?", options: ["Silence", "Bubble", "Promise", "Secret"], answer: "Silence" }
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

