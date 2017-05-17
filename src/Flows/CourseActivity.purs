module Flows.CourseActivity where

import Prelude (bind, ($), (<>))
import Utils (showUI, getCallbackFromScreen)
import Control.Monad.Eff.Console
import Control.Monad.Eff.Class(liftEff)


courseActivityFlow = do
  event <- getCallbackFromScreen "HOME" {screen:"HOME"}
  case event.action of
    "showCourseInfo" -> do
      liftEff $ log "showCourseInfo"
      showCourseInfoFlow 
    _ -> courseActivityFlow 


showCourseInfoFlow = do
  event <- showUI "COURSE_INFO_SCREEN" {screen:"COURSE_INFO_SCREEN"}
  case event.action of
    "showCourseActivity" -> do
      liftEff $ log "showCourseActivity"
      showCourseAssignmentFlow 
    "showQuizActivity" -> do
      liftEff $ log "showQuizActivity"
      showQuizFlow
    _ ->showCourseInfoFlow 


showCourseAssignmentFlow = do
  event <- showUI "COURSE_ACTIVITY_SCREEN" {screen:"COURSE_ACTIVITY_SCREEN"}
  case event.action of
    "goBack" -> do
      liftEff $ log "goBack"
      showCourseInfoFlow
    _  -> showCourseAssignmentFlow 

showQuizFlow = do
  event <- showUI "COURSE_QUIZ_ACTIVITY_SCREEN" {screen:"COURSE_QUIZ_ACTIVITY_SCREEN"}
  case event.action of
    "goBack" -> do
      liftEff $ log "goBack"
      showCourseInfoFlow
    _      -> showQuizFlow 
