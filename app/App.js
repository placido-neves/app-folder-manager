import React from 'react';
import { NavigationContainer } from "@react-navigation/native"
import Path from './src/context/PathContext'
import Name from './src/context/NameContext'

//import UserContexProvider from "./src/contexts/useContexts"
import Stack from './src/stack'

export default function App() {
  return (
    <NavigationContainer>
      <Path>
        <Name>
          <Stack />
        </Name>
      </Path>
    </NavigationContainer>
  );
}