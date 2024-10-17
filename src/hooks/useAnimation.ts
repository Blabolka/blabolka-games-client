import { useEffect, useState } from 'react'

export const useAnimation = ({ frameCount, duration }) => {
    const [currentFrame, setCurrentFrame] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFrame((prevFrame) => (prevFrame + 1) % frameCount)
        }, (duration * 1000) / frameCount)

        return () => clearInterval(interval)
    }, [frameCount, duration])

    return { currentFrame }
}
