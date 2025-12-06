import { clsx } from 'clsx'

export default function Question({ question, quizEnded, questionIndex, saveAnswer }) {
    const answersView = question.answers.map((answer, index) => (
        <button 
            disabled={quizEnded}
            key={`${answer.slice(0, 10)}-${index}`}
            onClick={() => saveAnswer(questionIndex, index)}
            className={clsx("option", {
                    clicked: !quizEnded && question.selectedAnswerIndex === index,
                    wrong: quizEnded && index === question.selectedAnswerIndex && question.selectedAnswerIndex !== question.correctAnswerIndex,
                    correct: quizEnded && index === question.correctAnswerIndex
                }
            )}
        >
            {answer}
        </button> 
    ))

    return (
        <article className="question-card">
            <h2>{question.question}</h2>
            <div className="options-area">
                {answersView}
            </div>
        </article>
    )
}