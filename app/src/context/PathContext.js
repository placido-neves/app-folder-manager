import React, { createContext, useState } from "react";

export const PathContext = createContext()

export default function Path({ children }) {
    const [pathCopy, setPath] = useState('')
    const [moveORCopy,setMoveORCopy] = useState('')
    return (
        <PathContext.Provider value={{ pathCopy, setPath,moveORCopy,setMoveORCopy }}>
            {children}
        </PathContext.Provider>
    )
}