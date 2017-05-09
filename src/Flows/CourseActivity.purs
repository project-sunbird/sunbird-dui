module Flows.CourseActivity where

import Prelude
import Control.Monad.Except.Trans (ExceptT, runExceptT)
import Partial.Unsafe (unsafePartial)
import Utils (State, showUI)
import Flows.CourseActivity
import Control.Monad.Aff (Aff , launchAff)
import Control.Monad.Eff.Exception (Error)
import Control.Monad    
import Control.Monad.Eff.Console
import Control.Monad.Eff.Class(liftEff)


--showCourseInfoFlow :: forall a b c. (State a) -> ExceptT Error (Aff b) (State c)
showCourseInfoFlow state = do
  event <- showUI "COURSE_INFO_SCREEN" {screen:"COURSE_INFO_SCREEN"}
  case event.action of
    "showCourseActivity" -> showCourseActivityFlow state
    _ ->showCourseInfoFlow state


 showCourseActivityFlow state = do
   state <- showUI "COURSE_ACTIVITY_SCREEN" {screen:"COURSE_ACTIVITY_SCREEN"}
   case event.action of
     "goBack" -> showCourseInfoFlow state
     _      -> showCourseActivityFlow state
