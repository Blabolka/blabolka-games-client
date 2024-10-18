import { useEffect, useState } from 'react'

export enum UseAnimationHookAnimationType {
    STATIC = 'static',
    SINGLE = 'single',
    INFINITE = 'infinite',
}

export type UseAnimationHookAnimationProps = {
    duration: number
    frameCount: number
    animationType: UseAnimationHookAnimationType
    onAnimationEnd?: () => void
}

export const useAnimation = ({
    duration,
    frameCount,
    animationType,
    onAnimationEnd,
}: UseAnimationHookAnimationProps) => {
    const [currentFrame, setCurrentFrame] = useState(0)

    const resetAnimation = () => {
        setCurrentFrame(0)
    }

    const runStaticAnimation = () => {
        resetAnimation()
        onAnimationEnd?.()
    }

    const runSingleAnimation = () => {
        resetAnimation()
        const singleFrameDurationTime = (duration * 1000) / frameCount

        let lastFrame = 0
        const interval = setInterval(() => {
            const isCurrentFrameLast = lastFrame + 1 === frameCount
            if (isCurrentFrameLast) {
                clearInterval(interval)
                onAnimationEnd?.()
                return
            }

            setCurrentFrame((prevFrame) => {
                lastFrame = prevFrame + 1
                return prevFrame + 1
            })
        }, singleFrameDurationTime)
        return interval
    }

    const runInfiniteAnimation = () => {
        resetAnimation()

        const singleFrameDurationTime = (duration * 1000) / frameCount
        return setInterval(() => {
            setCurrentFrame((prevFrame) => (prevFrame + 1) % frameCount)
        }, singleFrameDurationTime)
    }

    const runAnimationByType = (type: UseAnimationHookAnimationType) => {
        switch (type) {
            case UseAnimationHookAnimationType.STATIC:
                runStaticAnimation()
                return undefined
            case UseAnimationHookAnimationType.SINGLE:
                return runSingleAnimation()
            case UseAnimationHookAnimationType.INFINITE:
                return runInfiniteAnimation()
        }
    }

    useEffect(() => {
        const interval = runAnimationByType(animationType)

        return () => {
            clearInterval(interval)
        }
    }, [animationType, frameCount, duration])

    return { currentFrame }
}
