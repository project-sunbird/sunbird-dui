module Flows.CourseActivity where

import Prelude (bind, ($), (<>), discard)
import Utils
import Control.Monad.Eff.Console
import Control.Monad.Eff.Class(liftEff)
import Control.Monad.Eff.Console
import Control.Monad.Eff.Class(liftEff)


courseActivityFlow state = do
  -- reqTokens <- getReqTokens
  responseData <- getUserCourses "user1"
  -- response <- getCourses reqTokens
  state <- updateState {response: responseData} state
  _ <- sendUpdatedState state
  state <- getCallbackFromScreen "HOME" state
  case state.action of
    "showCourseInfo" -> do
      liftEff $ log "showCourseInfo"
      showCourseInfoFlow state
    "showExplore" -> do
      liftEff $ log "showExploreFlow"
      showExploreFlow state
    _ -> courseActivityFlow state

showExploreFlow state = do
  reqTokens <- getReqTokens
  responseData <- postExploreData state.req reqTokens
  state <- updateState {response: responseData} state
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
    "enrollCourse" -> do
      liftEff $ log "Enroll Course"
      response <- enrollCourse state.reqparams
      state <- updateState {response: response} state
      courseActivityFlow state
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
