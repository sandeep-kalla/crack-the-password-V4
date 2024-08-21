import { useState, useEffect } from 'react';
import PasswordCard from '../components/PasswordCard';
import SuccessMessage from '../components/SuccessMessage';
import Quiz from '../components/Quiz'; // Import the Quiz component
import TimeOverMessage from '../components/TimeOverMessage'; // Import the TimeOverMessage component
import api from '../services/api.js';
import decodePassword from '../services/decodePassword'; // Import the decode function
import '../styles/homepage.css'; // Ensure this file is created or updated
import '../styles/hint.css'; // New CSS file for hint styles

const HomePage = () => {
  const [saltedPassword, setSaltedPassword] = useState('');
  const [loading, setLoading] = useState(true); // Loading state
  const [progress, setProgress] = useState(0); // Progress state
  const [hintCount, setHintCount] = useState(0); // Count of hints used
  const [hints, setHints] = useState([]); // Array to store hints
  const [hintMessage, setHintMessage] = useState(''); // Hint message
  const [showHintCard, setShowHintCard] = useState(false); // State to control hint card visibility
  const [hintCardClass, setHintCardClass] = useState(''); // Class for hint card animation
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // State to control success message visibility
  const [showTimeOverMessage, setShowTimeOverMessage] = useState(false); // State to control time over message visibility
  const [userEmail, setUserEmail] = useState(() => {
    // Initialize from local storage
    const savedEmail = localStorage.getItem('userEmail');
    return savedEmail ? savedEmail : ''; // Default to empty string if not found
  }); 
  const [quizSubmitted, setQuizSubmitted] = useState(() => {
    // Initialize from local storage
    const submitted = localStorage.getItem('quizSubmitted');
    return submitted ? JSON.parse(submitted) : false; // Default to false if not found
  }); // State to track if the quiz has been submitted
  const [countdown, setCountdown] = useState(0); // State for countdown timer
  const [showCountdown, setShowCountdown] = useState(false); // State to control countdown visibility
  const [currentRound, setCurrentRound] = useState(() => {
    // Initialize from local storage
    const savedRound = localStorage.getItem('currentRound');
    return savedRound ? Number(savedRound) : 1; // Default to 1 if not found
  }); 
  const [roundTimer, setRoundTimer] = useState(() => {
    // Initialize from local storage
    const savedTimer = localStorage.getItem('roundTimer');
    return savedTimer ? Number(savedTimer) : 1200; // Default to 20 minutes for Round 1
  });

  useEffect(() => {
    const fetchSaltedPassword = async () => {
      setLoading(true);
      setProgress(0);
      try {
        const { data } = await api.getSaltedPassword();
        setSaltedPassword(data.saltedPassword);
        const decryptedPassword = decodePassword(data.saltedPassword);
        setHints(generateHints(decryptedPassword));
      } catch (error) {
        console.error('Error fetching salted password:', error);
      } finally {
        const totalDuration = 1800; // Total duration for loading in milliseconds
        const intervalTime = 5; // Update interval in milliseconds
        const totalSteps = totalDuration / intervalTime; // Total steps for the animation
        const increment = 100 / totalSteps; // Increment for each step

        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              setLoading(false); // Set loading to false when complete
              return 100;
            }
            return prev + increment; // Increase progress smoothly
          });
        }, intervalTime); // Adjust interval time as needed
      }
    };

    fetchSaltedPassword();
  }, []);

  useEffect(() => {
    // Timer logic
    const timerInterval = setInterval(() => {
      setRoundTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          if (currentRound === 1) {
            setShowTimeOverMessage(true); // Show time over message for Round 1
          } else {
            setShowSuccessMessage(true); // Show success message for Round 2
          }
          return 0; // Reset round timer
        }
        return prev - 1; // Decrement round timer
      });
    }, 1000); // Update every second

    // Save the current round and timer to localStorage
    localStorage.setItem('currentRound', currentRound);
    localStorage.setItem('roundTimer', roundTimer);

    return () => clearInterval(timerInterval); // Cleanup interval on unmount
  }, [currentRound, roundTimer]);

  useEffect(() => {
    // Set the timer duration based on the current round
    if (currentRound === 1) {
      setRoundTimer((prev) => prev <= 0 ? 1200 : prev); // 20 minutes in seconds
    } else if (currentRound === 2) {
      setRoundTimer((prev) => prev <= 0 ? 1813 : prev); // 30 minutes in seconds
    }
  }, [currentRound]);

  const generateHints = (decryptedPassword) => {
    const hints = [];
    
    // Generate hints based on the decrypted password
    if (decryptedPassword.length >= 2) {
      hints.push(`Hint: The first two characters of the decoded password are "${decryptedPassword.slice(0, 2)}".`);
    }
    if (decryptedPassword.length >= 4) {
      hints.push(`Hint: The first four characters of the decoded password are "${decryptedPassword.slice(0, 4)}".`);
    }
    if (decryptedPassword.length >= 6) {
      hints.push(`Hint: The first six characters of the decoded password are "${decryptedPassword.slice(0, 6)}".`);
    }

    return hints;
  };

  const handleSuccess = (email) => {
    setUserEmail(email); // Store the user's email
    localStorage.setItem('userEmail', email); // Save email to local storage
    setShowSuccessMessage(true); // Show the success message
    setCountdown(13); // Set countdown to 10 seconds
    setShowCountdown(true); // Show countdown
    setCurrentRound(2); // Update the round to 2
    setRoundTimer(1813); // Set the round timer to 30 minutes (1800 seconds)

    // Start countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setShowCountdown(false); // Hide countdown
          return 0; // Reset countdown
        }
        return prev - 1; // Decrement countdown
      });
    }, 1000); // Update every second

    // Hide the success message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false); // Hide success message
    }, 3000); // Adjust time as needed (3000 ms = 3 seconds)
  };

  const handleHintClick = () => {
    if (hintCount < 3) {
      setHintCount(hintCount + 1);
      setHintMessage(hints[hintCount]); // Display the hint corresponding to the hint count
    } else {
      setHintMessage('You have used all your hints.'); // Message when all hints are used
    }
    setShowHintCard(true); // Show the hint card
    setHintCardClass('show'); // Add animation class for showing the card
  };

  const closeHintCard = () => {
    setShowHintCard(false); // Close the hint card
    setHintMessage(''); // Clear hint message
    setHintCardClass(''); // Reset animation class
  };

  // Render the appropriate component based on the current round
  const renderComponent = () => {
    if (currentRound === 1) {
      return <PasswordCard saltedPassword={saltedPassword} onSuccess={handleSuccess} />;
    } else if (currentRound === 2) {
      if (quizSubmitted) {
        return <SuccessMessage />; // Render SuccessMessage if the quiz is submitted
      } else {
        return <Quiz userEmail={userEmail} roundTimer={roundTimer} onQuizSubmit={() => {
          setQuizSubmitted(true);
          localStorage.setItem('quizSubmitted', true); // Save submission status in local storage
        }} />;
      }
    }
    return null; // Fallback
  };

  // Effect to handle the state after refresh
  useEffect(() => {
    const submitted = localStorage.getItem('quizSubmitted');
    if (submitted) {
      setQuizSubmitted(true); // Set quizSubmitted to true if it was submitted
      setShowSuccessMessage(true); // Show success message if already submitted
    }
  }, []);

  return (
    <div className="home-page">
      <header className="header">
        <h1 className="page-title">Tech Shuttle 🚀 Event</h1>
      </header>
      <div className="round-card">
        <h2>Round {currentRound}</h2> {/* Display the current round */}
      </div>
      <div className="timer1">
        <h2>Time Remaining: {Math.floor(roundTimer / 60)}:{(roundTimer % 60).toString().padStart(2, '0')}</h2> {/* Display the round timer */}
      </div>
      <div className="hint-container">
        {!quizSubmitted  && ( // Hide the hint button if the quiz is submitted or the password is cracked
          <button 
            className={`hint-button ${hintCount >= 3 ? 'disabled' : ''}`} 
            onClick={handleHintClick} 
          >
            💡
          </button>
        )}
        {showHintCard && (
          <div className={`hint-card ${hintCardClass}`}>
            <button className="close-button" onClick={closeHintCard}>✖️</button>
            <h3>Hints</h3>
            <p>{hintMessage}</p>
            <p>Remaining hints: {3 - hintCount}</p>
          </div>
        )}
      </div>
      {loading ? (
        <div className="loading-container">
          <div className="loading-bar" style={{ width: `${progress}%` }}></div>
        </div>
      ) : showTimeOverMessage ? ( // Show time over message for Round 1
        <TimeOverMessage />
      ) : showSuccessMessage ? ( // Show success message for Round 2
        <SuccessMessage />
      ) : showCountdown ? ( // Show countdown timer
        <div className="countdown-overlay">
          <div className="countdown-message">
            <h2>Round 2 will start in {countdown} seconds!</h2>
          </div>
        </div>
      ) : (
        renderComponent() // Render the appropriate component based on the current round
      )}
    </div>
  );
};

export default HomePage;
