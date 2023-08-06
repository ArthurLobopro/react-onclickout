import { PropsWithChildren, memo, useCallback, useEffect, useMemo, useRef } from "react"

interface ClickOutWrapperProps extends PropsWithChildren {
    onClickOut: () => void
    wrapperProps?: Omit<React.ComponentProps<'div'>, "ref" | "children">
}

type Event = (TouchEvent | MouseEvent) & {
    __clickedElements?: HTMLElement[]
}

export const ClickOutWrapper = memo(
    function ClickOutWrapper(props: ClickOutWrapperProps) {
        const wrapperRef = useRef<HTMLDivElement>(null)

        const functions = useMemo(() => {
            let elTouchIsClick = true
            let documentTouchIsClick = true
            const el = wrapperRef.current as HTMLDivElement

            const documentTouchMoved = () => { documentTouchIsClick = false }

            const documentTouchStarted = () => {
                el?.removeEventListener('click', elementClicked)
                document.removeEventListener('click', documentClicked)
            }

            const documentTouchEnded = function (e: Event) {
                if (documentTouchIsClick) {
                    documentClicked(e)
                }

                documentTouchIsClick = true
            }

            const documentClicked = function (e: Event) {
                if (!(e.__clickedElements || []).includes(el)) {
                    return
                }

                console.log('clicked out')
                props.onClickOut()
            }

            const elementTouchMoved = function (e: Event) {
                elTouchIsClick = false
            }

            const elementTouchEnded = function (e: Event) {
                if (elTouchIsClick) {
                    elementClicked(e)
                }

                elTouchIsClick = true
            }

            const elementClicked = function (e: Event) {
                e.__clickedElements = e.__clickedElements || []
                e.__clickedElements.push(el)
            }

            return {
                documentTouchMoved,
                documentTouchStarted,
                documentTouchEnded,
                documentClicked,
                elementTouchMoved,
                elementTouchEnded,
                elementClicked
            }
        }, [wrapperRef.current])

        const toggleListeners = useCallback((add = true) => {
            const el = wrapperRef.current as HTMLDivElement

            const method = add ? 'addEventListener' : 'removeEventListener'

            el?.[method]('touchmove', functions.elementTouchMoved as any)
            el?.[method]('touchend', functions.elementTouchEnded as any)
            el?.[method]('click', functions.elementClicked as any)

            document[method]('touchmove', functions.documentTouchMoved as any)
            document[method]('touchstart', functions.documentTouchStarted as any)
            document[method]('touchend', functions.documentTouchEnded as any)
            document[method]('click', functions.documentClicked as any)

        }, [wrapperRef.current])

        useEffect(() => {
            setTimeout(toggleListeners, 10)

            return () => {
                toggleListeners(false)
            }
        }, [wrapperRef.current])


        return (
            <div {...props.wrapperProps} ref={wrapperRef} children={props.children} />
        )
    }
)