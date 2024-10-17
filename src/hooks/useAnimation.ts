import { useEffect, useState } from 'react'

export const useAnimation = ({ shouldAnimate = true, frameCount, duration }) => {
    const [currentFrame, setCurrentFrame] = useState(0)

    useEffect(() => {
        if (!shouldAnimate) {
            setCurrentFrame(0)
            return
        }

        const interval = setInterval(() => {
            setCurrentFrame((prevFrame) => (prevFrame + 1) % frameCount)
        }, (duration * 1000) / frameCount)

        return () => clearInterval(interval)
    }, [shouldAnimate, frameCount, duration])

    return { currentFrame }
}
