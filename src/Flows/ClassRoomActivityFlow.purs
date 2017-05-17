module Flows.ClassRoomActivityFlow where


import Prelude (bind, ($), (<>))
import Utils (showUI, getCallbackFromScreen)
import Control.Monad.Eff.Console
import Control.Monad.Eff.Class(liftEff)


--showCourseInfoFlow :: forall a b c. (State a) -> ExceptT Error (Aff b) (State c) 
--a b. a -> b -> a
classRoomActivityFlow = do
  liftEff $ log "IN CLASSROOM FLOW"
  event <- getCallbackFromScreen "HOME" {screen:"HOME"}
  case event.action of
    "showClassroomContet" -> do
      liftEff $ log "showClassroomContet"
      showClassroomContetFlow 
    
    _ -> classRoomActivityFlow 



showClassroomContetFlow = do
  event <- showUI "CLASSROOM_CONTENT_SCREEN" {screen:"CLASSROOM_CONTENT_SCREEN"}
  case event.action of
    
    _ -> showClassroomContetFlow 

