module Flows.ClassRoomActivityFlow where


import Prelude (bind, ($), (<>), discard)
import Utils 
import Control.Monad.Eff.Console
import Control.Monad.Eff.Class(liftEff)


classRoomActivityFlow state = do
  responseData <- getResourcePage "user1"
  newState <- updateState {response: responseData} state
  _ <- sendUpdatedState newState 
  state <- getCallbackFromScreen "HOME" state
  liftEff $ log $ "classRoomActivityFlow EVENT " <> state.data2
  case state.action of
    "showClassroomContet" -> do
      liftEff $ log "showClassroomContet"
      showClassroomContetFlow state
    _ -> classRoomActivityFlow state



showClassroomContetFlow state= do
  state <- showUI "CLASSROOM_CONTENT_SCREEN" state
  case state.action of
    
    _ -> showClassroomContetFlow state

