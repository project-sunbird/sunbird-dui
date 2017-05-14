module Flows.CourseActivity where

import Prelude (bind)
import Utils (showUI)
import Flows.CourseActivity (showCourseInfoFlow)


--showCourseInfoFlow :: forall a b c. (State a) -> ExceptT Error (Aff b) (State c)
showCourseInfoFlow flow= do
  event <- showUI "COURSE_INFO_SCREEN" {screen:"COURSE_INFO_SCREEN"}
  case event.action of
    "goBack" -> flow
    "showCourseActivity" -> showCourseActivityFlow flow
    "showQuizActivity" -> showQuizFlow flow
    _ ->showCourseInfoFlow flow


showCourseActivityFlow flow= do
  event <- showUI "COURSE_ACTIVITY_SCREEN" {screen:"COURSE_ACTIVITY_SCREEN"}
  case event.action of
    "goBack" -> showCourseInfoFlow flow
    _      -> showCourseActivityFlow flow

showQuizFlow flow= do
  event <- showUI "COURSE_QUIZ_ACTIVITY_SCREEN" {screen:"COURSE_QUIZ_ACTIVITY_SCREEN"}
  case event.action of
    "goBack" -> showCourseInfoFlow flow
    _      -> showQuizFlow flow
