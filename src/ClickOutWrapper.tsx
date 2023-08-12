import { PropsWithChildren, memo, useRef } from "react"
import { useClickOut } from "./useClickOut"

interface ClickOutWrapperProps extends PropsWithChildren {
    onClickOut: () => void
    wrapperProps?: Omit<React.ComponentProps<'div'>, "ref" | "children">
}

export const ClickOutWrapper = memo(
    function ClickOutWrapper(props: ClickOutWrapperProps) {
        const wrapperRef = useRef<HTMLDivElement>(null)

        useClickOut({
            onClickOut: props.onClickOut,
            elementRef: wrapperRef
        })

        return (
            <div {...props.wrapperProps} ref={wrapperRef} children={props.children} />
        )
    }
)