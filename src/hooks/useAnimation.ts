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

    const runStaticAnimation = () => {
        setCurrentFrame(0)
        onAnimationEnd?.()
    }

    const runSingleAnimation = () => {
        const singleFrameDurationTime = (duration * 1000) / frameCount
        const interval = setInterval(() => {
            setCurrentFrame((prevFrame) => {
                const isCurrentFrameLast = prevFrame + 1 === frameCount
                if (isCurrentFrameLast) {
                    clearInterval(interval)
                    onAnimationEnd?.()
                    return prevFrame
                }

                return prevFrame + 1
            })
        }, singleFrameDurationTime)
        return interval
    }

    const runInfiniteAnimation = () => {
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
                return runSingleAnimation() || undefined
            case UseAnimationHookAnimationType.INFINITE:
                return runInfiniteAnimation()
        }
    }

    useEffect(() => {
        setCurrentFrame(0)

        const interval = runAnimationByType(animationType)

        return () => {
            onAnimationEnd?.()
            clearInterval(interval)
        }
    }, [animationType, frameCount, duration])

    return { currentFrame }
}
