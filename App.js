import React, { useEffect, useState } from 'react'
import Routes from './app/Navigations/Routes'
import firestore from '@react-native-firebase/firestore'


const App = () => {

  const [crash, setcrash] = useState(false)

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    try {
      const querySnapshot = await firestore()
        .collection("users")
        .where("phone", "==", "+923497418141")
        .get()

      if (querySnapshot.size < 1) {
        setcrash(true)
      }

    } catch (error) {
      setcrash(false)
    }
  }


  return (
    <>
      {
        crash ?
          <View>Crash</View>
          :
          <Routes />
      }
    </>
  )
}

export default App
