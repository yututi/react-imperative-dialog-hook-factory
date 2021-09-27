# React imperative dialog hook

A sample implementaion of dialog component using react hook that can use imperative.

## Installation
```
npm i @yututi/react-imperative-dialog-hook-factory
```

## Usage

This library does not provide hook.  
You can implement hooks via `createDialogHook`.  
A sample implementation is below. (Runnning [here](https://yututi.github.io/react-imperative-dialog-hook-factory/))

1. Define frame part of dialog.

    ```jsx
    import { createDialogHook } from "@yututi/react-imperative-dialog-hook-factory"

    export const createDefaultDialogHook = function(render) {
      return createDialogHook({
        render,
        renderFrame: (close, node) => (
          <div className="dialog">
            <div className="dialog__header">
              <span className="close" onClick={() => {close({ok:false})}}>[x]</span>
            </div>
            <div className="dialog__body">
              {node}
            </div>
          </div>
        )
      })
    }
    ```

1. Create useDialog hook.

    ```jsx
    const useOkOrCancelDialog = createDefaultDialogHook(close => {

      const onOk = () => {
        close({ok: true})
      }

      const onCancel = () => {
        close({ok: false})
      }

      return (
        <div>
          This is sample dialog.
          <div className="actions">
            <button onClick={onCancel}>Cancel</button>
            <button onClick={onOk}>OK</button>
          </div>
        </div>
      )
    })
    ```

1. Use hook in your component.

    ```jsx
    const App = () => {

      const [text, setText] = useState("")

      const [dialog, openDialog] = useOkOrCancelDialog()

      const openDialogAndDispResult = () => {
        openDialog().then(result => {
          setText(result.ok ? "OK!" : "Cancel...")
        })
      }

      return (
        <div>
          <button onClick={openDialogAndDispResult}>open dialog</button>
          <div>{text}</div>
          {dialog}
        </div>
      )
    }
    ```
