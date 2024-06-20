function getNextSecondThursday() {
    let d = new Date(),
        y = d.getFullYear(),
        m = d.getMonth() + 1
    let secondThursday = new Date(
        y,
        m,
        1 + ((11 - new Date(y, m, 1).getDay()) % 7) + 7
    )
    return secondThursday.toLocaleDateString()
}

const NextSecondThursday = () => {
    return <>{getNextSecondThursday()}</>
}

export default NextSecondThursday
