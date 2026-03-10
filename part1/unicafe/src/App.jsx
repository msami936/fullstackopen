import { useState } from "react"

// functional component which takes `text` and `handleClick` as props
const Button = ({ text, handleClick }) => {
    return <button onClick={handleClick}>{text}</button>
}

// functional component which takes `good`, `neutral`, and `bad` as props
const Statistics = ({ good, neutral, bad }) => {
    // Check if all feedback values are zero
    if (good === 0 && neutral === 0 && bad === 0) {
        return <h3>No feedback given</h3>
    }

    // html table
    return (
        <table>
            <tbody>
                <StatisticLine text="good" value={good} />
                <StatisticLine text="neutral" value={neutral} />
                <StatisticLine text="bad" value={bad} />

                <StatisticLine text="all" value={good + neutral + bad} />
                <StatisticLine
                    text="average"
                    value={(good * 1 + bad * -1) / (good + neutral + bad)}
                />
                <StatisticLine
                    text="positive"
                    value={(good / (good + neutral + bad)) * 100 + "%"}
                />
            </tbody>
        </table>
    )
}

// functional component which takes `text` and `value` as props
const StatisticLine = ({ text, value }) => {
    return (
        <tr>
            <td>{text}</td>
            <td>{value}</td>
        </tr>
    )
}

const App = () => {
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    // handler functions for updating feedback counts
    const handleGood = () => {
        setGood(good + 1)
    }

    const handleNeutral = () => {
        setNeutral(neutral + 1)
    }

    const handleBad = () => {
        setBad(bad + 1)
    }

    // Rendering main content of the app
    return (
        <div>
            <h1>give feedback</h1>
            <Button text="good" handleClick={handleGood} />
            <Button text="neutral" handleClick={handleNeutral} />
            <Button text="bad" handleClick={handleBad} />

            <h1>statistics</h1>
            <Statistics good={good} neutral={neutral} bad={bad} />
        </div>
    )
}

export default App