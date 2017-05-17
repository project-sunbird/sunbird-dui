module Flows.CourseActivity where

import Prelude (bind, ($), (<>))
import Utils (showUI, getCallbackFromScreen, updateState)
import Control.Monad.Eff.Console
import Control.Monad.Eff.Class(liftEff)


courseActivityFlow state = do
  state <- getCallbackFromScreen "HOME" state
  state <- updateState {employee: "lol"} state
  case state.action of
    "showCourseInfo" -> do
      liftEff $ log "showCourseInfo"
      showCourseInfoFlow state
    _ -> courseActivityFlow state


showCourseInfoFlow state = do
  state <- showUI "COURSE_INFO_SCREEN" state
  case state.action of
    "showCourseActivity" -> do
      liftEff $ log "showCourseActivity"
      showCourseAssignmentFlow state
    "showQuizActivity" -> do
      liftEff $ log "showQuizActivity"
      showQuizFlow state
    _ ->showCourseInfoFlow state


showCourseAssignmentFlow state = do
  state <- showUI "COURSE_ACTIVITY_SCREEN" state
  case state.action of
    "goBack" -> do
      liftEff $ log "goBack"
      showCourseInfoFlow state
    _  -> showCourseAssignmentFlow state

showQuizFlow state = do
  state <- showUI "COURSE_QUIZ_ACTIVITY_SCREEN" state
  case state.action of
    "goBack" -> do
      liftEff $ log "goBack"
      showCourseInfoFlow state
    _      -> showQuizFlow state
