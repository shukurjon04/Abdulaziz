import { useState } from 'react'
import './screens.css'

export default function TicketQuizScreen({ ticket, setScreen, T }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showExplanation, setShowExplanation] = useState(false)

  if (!ticket) {
    return <div className="screen">Bilet tanlanmagan</div>
  }

  const mockQuestions = Array.from({ length: ticket.questionCount }, (_, i) => ({
    id: i + 1,
    text: `Savol ${i + 1}: Bu test savoli bo'lib, ko'p variantli javoblar mavjud.`,
    options: ['A) Javob 1', 'B) Javob 2', 'C) Javob 3', 'D) Javob 4'],
    correct: Math.floor(Math.random() * 4),
    explanation: 'Bu javob to\'g\'ri chunki...',
  }))

  const question = mockQuestions[currentQuestion]
  const selectedAnswer = answers[currentQuestion]

  const handleAnswer = (optionIndex) => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: optionIndex }))
    setShowExplanation(true)
  }

  const handleNext = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowExplanation(false)
    } else {
      setScreen('ticket-result')
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setShowExplanation(false)
    }
  }

  const progress = ((currentQuestion + 1) / mockQuestions.length) * 100

  return (
    <div className="screen">
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
          <span>Bilet #{ticket.number}</span>
          <span>{currentQuestion + 1} / {mockQuestions.length}</span>
        </div>
        <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'var(--primary)', transition: 'width 0.3s' }}></div>
        </div>
      </div>

      <div className="quiz-container">
        <div className="question-header">
          <div className="question-counter">Savol {currentQuestion + 1}</div>
          <div className="question-text">{question.text}</div>
        </div>

        <div className="options-list">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              className={`option-button ${selectedAnswer === idx ? 'selected' : ''} ${
                showExplanation && (
                  idx === question.correct
                    ? 'correct'
                    : selectedAnswer === idx
                    ? 'wrong'
                    : ''
                )
              }`}
              onClick={() => !showExplanation && handleAnswer(idx)}
              disabled={showExplanation}
            >
              {option}
            </button>
          ))}
        </div>

        {showExplanation && (
          <div style={{ marginTop: '20px', padding: '16px', backgroundColor: 'var(--gray-100)', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
            <h4 style={{ marginBottom: '8px' }}>📖 Izoh</h4>
            <p>{question.explanation}</p>
          </div>
        )}

        <div className="quiz-actions">
          <button className="btn btn-outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
            ← Oldingi
          </button>
          <div className="quiz-nav"></div>
          <button className="btn btn-primary" onClick={handleNext}>
            {currentQuestion === mockQuestions.length - 1 ? 'Yakunlash' : 'Keyingi'} →
          </button>
        </div>
      </div>
    </div>
  )
}
