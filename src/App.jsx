import './App.css'
import { useState } from 'react'
import he from 'he'
import { CircleLoader } from 'react-spinners'
import Question from './components/Question'
import lemon from './assets/lemon.svg'
import blueLemon from './assets/blue-lemon.svg'

function App() {
  //states
  const [questions, setQuestions] = useState([])
  const [quizzEnded, setQuizzEnded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  //derived
  const questionViews = questions.map((q, index) => (
    <Question 
      question={q} 
      saveAnswer={saveAnswer} 
      questionIndex={index} 
      key={`${q.question.slice(0, 20)}-${index}`} 
      quizzEnded={quizzEnded}
    />
  ))
  const correctAnswerCount = questions.filter((q) => (
    q.selectedAnswerIndex === q.correctAnswerIndex
  )).length

  //constants
  const QUESTIONS_SIZE = 5
  const OPTIONS_SIZE = 4
  const QUESTION_IS_NOT_ANSWERED = -1

  function saveAnswer(questionIndex, givenAnswerIndex) {
    setQuestions(prevQuestions => {
      return prevQuestions.map((ques, index) => {
        return index === questionIndex ? {...ques, selectedAnswerIndex: givenAnswerIndex} : ques
      })
    })
  }

  async function startQuiz() {
    setIsLoading(true)

    try {
      const response = await fetch("https://opentdb.com/api.php?amount=5&category=11&difficulty=easy&type=multiple")
      const data = await response.json()

      if(data.response_code === 0) {
          const convertedData = convertData(data)
          const decodedData = htmlEntityDecode(convertedData)
          setQuestions(decodedData)
      } 
    } catch (error) {
      console.error("Error fetching quiz data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  function convertData(jsonData) {
    return jsonData.results.map(result => {
      const randomIndex = Math.floor(Math.random() * OPTIONS_SIZE);
      return {
        question: result.question,
        answers: [...result.incorrect_answers.slice(0, randomIndex), result.correct_answer, ...result.incorrect_answers.slice(randomIndex)],
        correctAnswerIndex: randomIndex,
        selectedAnswerIndex: QUESTION_IS_NOT_ANSWERED
      }
    })
  }

  function htmlEntityDecode(convertedData) {
    return convertedData.map(data => {
      return {...data, question: he.decode(data.question), answers: data.answers.map(a => (he.decode(a)))}
    })
  }

  function checkAnswers() {
    if(questions.every(q => (q.selectedAnswerIndex !== QUESTION_IS_NOT_ANSWERED))) {
      setQuizzEnded(true)
    } else {
      alert("Please answer all questions before checking the answers.")
    }
  }

  function playAgain() {
    setQuestions(prevQuestions => 
      prevQuestions.map(q => ({...q, selectedAnswerIndex: QUESTION_IS_NOT_ANSWERED}))
    )
    startQuiz()
    setQuizzEnded(false)
  }

  return (
    <main>
      <section>
          <img src={lemon} id="lemon-svg"/>
          <img src={blueLemon} id="blue-lemon-svg"/>
      </section>
      {
        isLoading && 
        <div className='loading-overlay'>
          <CircleLoader 
            color="#4D5B9E"
            loading={isLoading}
            size={150}
            aria-label="Loading Spinner"        
          />
        </div>  
      } 

      {
        questionViews.length === 0 ? 
          (<section className='home-page'>
            <h1>Quizzical</h1>
            <p>Test your knowledge</p>
            <button onClick={startQuiz}>Start quiz</button>
          </section>)
          : (
            <div className='quizz-area'>
              <section className="questions-area">
                {questionViews}
              </section>
              
              {
                !quizzEnded ? 
                  (<button className="check-answers-button" onClick={checkAnswers}>Check answers</button>) :
                (<section className="quizz-result-area">
                    <span>{`You scored ${correctAnswerCount}/${QUESTIONS_SIZE} correct answers`}</span>
                    <button onClick={playAgain}>Play again</button>
                </section>)
              }
            </div>
          )
      }
    </main>
  )
}

export default App
