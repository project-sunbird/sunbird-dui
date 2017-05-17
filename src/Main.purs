module Main where

import Prelude (bind, ($), (<>))
import Control.Monad.Except.Trans (runExceptT)
import Utils (showUI, getCallbackFromScreen)
import Flows.CourseActivity (courseActivityFlow)
import Flows.ClassRoomActivityFlow (classRoomActivityFlow)
import Control.Monad.Aff (launchAff)
import Control.Monad.Eff.Console
import Control.Monad.Eff.Class(liftEff)

--init :: forall a b. ExceptT Error (Aff a) (State b)
init = do
  event <- showUI "INIT_UI" {screen: "INIT"}
  case event.action of
    "showMainFlow" -> do
      liftEff $ log "showMainFlow"
      home
    _ -> do
      liftEff $ log $ "Action yet to be implemented " <> event.action


home = do
  liftEff $ log "IN home FLOW"
  event <- showUI "HOME" {screen: "HOME"}
  case event.action of
    _ -> do
      liftEff $ log $ "Action yet to be implemented " <> event.action    

cFlow = do
  event <- getCallbackFromScreen "HOME" {screen: "HOME"}
  liftEff $ log $ "vFLow EVENT " <> event.action
  case event.action of
    "showMainFlow" -> do
      liftEff $ log "showMainFlow"
      home 
    "showHome" -> do
      liftEff $ log "showHomeFlow"
      classRoomActivityFlow 
    "startCourseFlow" -> do
      liftEff $ log "startCourseFlow"
      courseActivityFlow 
    "startClassRoomFlow" -> do
      liftEff $ log "startClassRoomFlow"
      classRoomActivityFlow 
    "showForum" -> do
      liftEff $ log "showForumFlow"
      classRoomActivityFlow 
    "showHome" -> do
      liftEff $ log "showProfileFlow"
      classRoomActivityFlow 
    _ -> do
      liftEff $ log $ "Action yet to be implemented " <> event.action      

main = launchAff $ do
  runExceptT init

changeFlow = launchAff $ do
  runExceptT cFlow
  
