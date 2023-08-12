import { useCallback, useEffect } from "react"

interface useClickOutProps {
    onClickOut: () => void
    elementRef: React.MutableRefObject<HTMLElement | null>
}

type Event = (TouchEvent | MouseEvent) & {
    __wrapperIsClicked?: boolean
}

export function useClickOut({ onClickOut, elementRef: wrapperRef }: useClickOutProps) {
    const wrapperClick = useCallback((ev: Event) => {
        ev.__wrapperIsClicked = true
    }, [])

    const documentClick = useCallback((ev: Event) => {
        if (!ev.__wrapperIsClicked) {
            onClickOut()
        }
    }, [onClickOut])

    useEffect(() => {
        const wrapper = wrapperRef.current
        setTimeout(() => {
            if (wrapper) {
                wrapper.addEventListener('click', wrapperClick)
                document.addEventListener('click', documentClick)
            }
        }, 10)
        return () => {
            if (wrapper) {
                wrapper.removeEventListener('click', wrapperClick)
                document.removeEventListener('click', documentClick)
            }
        }
    }, [wrapperRef.current, wrapperClick, documentClick])
}