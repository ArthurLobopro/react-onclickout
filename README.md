# React Clickout

A simple component that can detect when the user clicks outside!

## Usage

```jsx
import { ClickOutWrapper } from "@arthur-lobo/react-onclickout"

function MyComponent() {
    return (
        <ClickOutWrapper onClickOut={() => alert("Goodbye World!")}>
            <div>Hello World!</div>
        </ClickOutWrapper>
    )
}
```

## Credits

Based on [react-onclickout](https://github.com/boblauer/react-onclickout) logic