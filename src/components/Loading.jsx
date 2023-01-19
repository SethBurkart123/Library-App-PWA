import Rive from "@rive-app/react-canvas"
import { memo } from "react"
import Layout from "./layout"

export const Loading = memo(() => {
  return(
    <Layout>
      <div className="w-full h-full">
        <Rive className='top-1/2 left-1/2 absolute w-full h-full -translate-x-1/2 -translate-y-1/2' src="/animations/book-loader.riv" />
        <p className="text-primary-800 w-full -mt-16 text-center align-top select-none">Thanks <a href="https://rive.app/@dimaf26516/">dimaf26516</a> for the loading animation!</p>
      </div>
    </Layout>
  )
})