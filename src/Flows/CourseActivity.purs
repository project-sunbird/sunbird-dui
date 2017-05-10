module Flows.CourseActivity where

import Prelude (bind)
import Utils (showUI)
import Flows.CourseActivity (showCourseInfoFlow)


--showCourseInfoFlow :: forall a b c. (State a) -> ExceptT Error (Aff b) (State c)
showCourseInfoFlow = do
  event <- showUI "COURSE_INFO_SCREEN" {screen:"COURSE_INFO_SCREEN"}
  case event.action of
    "goBack" -> showHomeFlow
    "showCourseActivity" -> showCourseActivityFlow
    _ ->showCourseInfoFlow


showCourseActivityFlow  = do
  event <- showUI "COURSE_ACTIVITY_SCREEN" {screen:"COURSE_ACTIVITY_SCREEN"}
  case event.action of
    "goBack" -> showCourseInfoFlow
    _      -> showCourseActivityFlow

showHomeFlow = do
  event <- showUI "HOME" {screen :"HOME"}
  case event.action of
    "showCourseInfo" -> do
      showCourseInfoFlow
    _ -> do
      showHomeFlow
