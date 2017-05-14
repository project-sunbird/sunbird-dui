module Flows.ClassRoomActivityFlow where


import Prelude (bind, ($), (<>))
import Utils (showUI)
import Control.Monad.Eff.Console
import Control.Monad.Eff.Class(liftEff)


--showCourseInfoFlow :: forall a b c. (State a) -> ExceptT Error (Aff b) (State c) 
--a b. a -> b -> a
showClassroomContetFlow flow= do
  event <- showUI "CLASSROOM_CONTENT_SCREEN" {screen:"CLASSROOM_CONTENT_SCREEN"}
  case event.action of
    "goBack" -> flow
    _ -> showClassroomContetFlow flow

