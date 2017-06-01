module Flows.CourseActivity where

import Prelude (bind, ($), (<>), discard)
import Utils
import Control.Monad.Eff.Console
import Control.Monad.Eff.Class(liftEff)


courseActivityFlow state = do
  reqTokens <- getReqTokens
  response <- getCourses reqTokens
  newState <- updateState {response: response} state
  state <- sendUpdatedState newState
  state <- getCallbackFromScreen "HOME" state
  case state.action of
    "showCourseInfo" -> do
      liftEff $ log "showCourseInfo"
      showCourseInfoFlow state
    "showExplore" -> do
      liftEff $ log "showCourseInfo"
      showExploreFlow state
    _ -> courseActivityFlow state

showExploreFlow state = do
  state <- showUI "EXPLORE_SCREEN" state
  case state.action of
    "goBack" -> do
      liftEff $ log "showCourseActivityFlow"
      courseActivityFlow state
    _ ->showExploreFlow state

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
