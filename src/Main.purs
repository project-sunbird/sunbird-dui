module Main where

import Prelude (bind, ($), (<>))
import Control.Monad.Except.Trans (runExceptT)
import Utils (showUI)
import Flows.CourseActivity (showCourseInfoFlow)
import Flows.ClassRoomActivityFlow (showClassroomContetFlow)
import Control.Monad.Aff (launchAff)
import Control.Monad.Eff.Console
import Control.Monad.Eff.Class(liftEff)

--init :: forall a b. ExceptT Error (Aff a) (State b)
init = do
  event <- showUI "INIT_UI" {screen: "INIT"}
  case event.action of
    "showCourseInfo" -> do
      liftEff $ log "showCourseInfoFlow"
      showCourseInfoFlow
    "showClassroomContet" -> do
      liftEff $ log "showClassroomContet"
      showClassroomContetFlow
    _ -> do
      liftEff $ log $ "Action yet to be implemented " <> event.action

main = launchAff $ do
  runExceptT init
