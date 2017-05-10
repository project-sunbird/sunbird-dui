module Flows.ClassRoomActivityFlow where

import Prelude (bind)
import Utils (showUI)


--showCourseInfoFlow :: forall a b c. (State a) -> ExceptT Error (Aff b) (State c)
showClassroomContetFlow = do
  event <- showUI "CLASSROOM_CONTENT_SCREEN" {screen:"CLASSROOM_CONTENT_SCREEN"}
  case event.action of
    _ -> showClassroomContetFlow
