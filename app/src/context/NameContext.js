import React, { createContext, useState } from "react";

export const NameContext = createContext()

export default function Name({ children }) {
    const [name, setName] = useState('')
    const [isModalVisible, setModalVisible] = useState(false)

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    return (
        < NameContext.Provider value={{ name, isModalVisible, setName, toggleModal,setModalVisible }}>
            {children}
        </ NameContext.Provider>
    )
}