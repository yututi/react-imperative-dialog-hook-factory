import React, { useState } from "react"
import ReactDOM from "react-dom"
import {
  createDialogHook,
  Render
} from "./index"
import "./sample.css"


// Define useDialog hook factory
export type DefaultResult = {
  ok: boolean
}
export const createDefaultDialogHook = function(render: Render<DefaultResult>) {
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

// Create hook
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

// Use hook
const App = () => {

  const [text, setText] = useState("")

  const [dialog, open] = useOkOrCancelDialog()

  const openDialogAndDispResult = () => {
    open().then(result => {
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


ReactDOM.render(
  <App/>,
  document.getElementById('root')
);
