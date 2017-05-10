module Flows.ClassRoomActivityFlow where


import Prelude (bind, ($), (<>))
import Utils (showUI)
import Control.Monad.Eff.Console
import Control.Monad.Eff.Class(liftEff)


--showCourseInfoFlow :: forall a b c. (State a) -> ExceptT Error (Aff b) (State c)
showClassroomContetFlow = do
  event <- showUI "CLASSROOM_CONTENT_SCREEN" {screen:"CLASSROOM_CONTENT_SCREEN"}
  case event.action of
    "goBack" -> showHomeFlow
    _ -> showClassroomContetFlow

showHomeFlow = do
  event <- showUI "HOME" {screen :"HOME"}
  case event.action of
    "showClassroomContet" -> do
      liftEff $ log "showClassroomContet"
      showClassroomContetFlow
    _ -> do
      liftEff $ log $ "Action yet to be implemented " <> event.action
