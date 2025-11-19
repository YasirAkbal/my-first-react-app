import { clsx } from 'clsx'

export default function Question({ question, quizzEnded, questionIndex, saveAnswer }) {
    const answersView = question.answers.map((answer, index) => (
        <button 
            disabled={quizzEnded}
            key={`${answer.slice(0, 10)}-${index}`}
            onClick={() => saveAnswer(questionIndex, index)}
            className={clsx("option", {
                    clicked: !quizzEnded && question.selectedAnswerIndex === index,
                    wrong: quizzEnded && index === question.selectedAnswerIndex && question.selectedAnswerIndex !== question.correctAnswerIndex,
                    correct: quizzEnded && index === question.correctAnswerIndex
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