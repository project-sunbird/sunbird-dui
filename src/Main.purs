module Main where

import Prelude (bind, ($), (<>), pure, discard)
import Control.Monad.Except.Trans (runExceptT)
import Utils
import Flows.CourseActivity (courseActivityFlow)
import Flows.ClassRoomActivityFlow (classRoomActivityFlow)
import Flows.CommunityActivityFlow (communityActivityFlow)
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
  event <- showUI "HOME" {screen: "HOME"}
  case event.action of
    _ -> do
      liftEff $ log $ "Action yet to be implemented " <> event.action    

cFlow = do
  state <- getCallbackFromScreen "HOME" {screen: "HOME"}
  liftEff $ log $ "vFLow EVENT " 
  case state.action of
    "showMainFlow" -> do
      liftEff $ log "showMainFlow"
      home 
    "showHome" -> do
      liftEff $ log "showHomeFlow"
      classRoomActivityFlow state
    "startCourseFlow" -> do
      response <- getDummyData
      state <- updateState {response: response} state
      liftEff $ log "startCourseFlow"
      courseActivityFlow state
    "startClassRoomFlow" -> do
      liftEff $ log "startClassRoomFlow"
      classRoomActivityFlow state
    "showCommunity" -> do
      liftEff $ log "communityActivityFlow"
      communityActivityFlow state
    "showHome" -> do
      liftEff $ log "showProfileFlow"
      classRoomActivityFlow state
    _ -> do
      liftEff $ log $ "Action yet to be implemented " <> state.action      

main = launchAff $ do
  runExceptT init

changeFlow = launchAff $ do
  runExceptT cFlow
  
