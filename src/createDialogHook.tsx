import React, { useCallback, useMemo, useState } from "react"
import ReactDOM from "react-dom"
import { Transition } from 'react-transition-group'

type OnClose<T> = (result: T) => void
type Close<T> = (result: T) => void
export type Render<T> = (close:Close<T>) => React.ReactNode
export type RenderFrame<T> = (close:Close<T>, node: React.ReactNode) => React.ReactNode
type CreateOptions<T> = {
  render: Render<T>
  duration?: number,
  renderFrame: RenderFrame<T>,
  portalDistId?: string,
  bgOpacity?: number
}

const transitionStyles = {
  entering: { opacity: 1 },
  entered:  { opacity: 1 },
  exiting:  { opacity: 0 },
  exited:  { opacity: 0 }
}

const createDialogHook = function<T>({
  render,
  duration = 300,
  portalDistId = "modals",
  renderFrame,
  bgOpacity = 0.1
}: CreateOptions<T>) {

  const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0
  }

  const useDialog = function():[React.ReactNode, () => Promise<T>] {

    const [isOpen, setIsOpen] = useState(false)
    const [callback, setCallback] = useState<OnClose<T>>(() => () => {})

    const close = (result: T) => {
      setIsOpen(false)
      callback(result)
    }

    const openDialog = () => {
      setIsOpen(true)
      return new Promise<T>(resolve => {
        setCallback(() => {
          return resolve
        })
      })
    }

    return [
      ReactDOM.createPortal(
        <Transition in={isOpen} timeout={duration}>
          {state => {
            if (state === "unmounted") return null
            const isInvisible = state === "exited"
            const content = render(close)
            const Frame = renderFrame(close, content)
            return (
              <div style={{
                position: "fixed",
                inset: "0px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                visibility: isInvisible ? "hidden": "visible",
                ...defaultStyle,
                ...transitionStyles[state]
              }}>
                <div style={{
                  position: "absolute",
                  inset: "0px",
                  backgroundColor: "black",
                  opacity: bgOpacity
                }}></div>
                <div style={{
                  zIndex: 1
                }}>
                  {Frame}
                </div>
              </div>
            )
          }}
        </Transition>,
        getOrCreateElementById(portalDistId)
      ),
      openDialog
    ]
  }

  return useDialog
}

const getOrCreateElementById = (id: string) => {
  let el = document.getElementById(id)
  if (el) return el
  el = document.createElement("div")
  el.id = id
  document.body.appendChild(el)
  return el
}

export default createDialogHook