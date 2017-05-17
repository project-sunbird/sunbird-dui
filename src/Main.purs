module Main where

import Prelude (bind, ($), (<>))
import Control.Monad.Except.Trans (runExceptT)
import Utils (showUI)
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
  event <- showUI "HOME" {screen: "HOME"}
  case event.action of
    "showHome" -> do
      liftEff $ log "showHomeFlow"
      classRoomActivityFlow home
    "startCourseFlow" -> do
      liftEff $ log "startCourseFlow"
      courseActivityFlow home
    "startClassRoomFlow" -> do
      liftEff $ log "startClassRoomFlow"
      classRoomActivityFlow home
    "showForum" -> do
      liftEff $ log "showForumFlow"
      classRoomActivityFlow home
    "showHome" -> do
      liftEff $ log "showProfileFlow"
      classRoomActivityFlow home
    _ -> do
      liftEff $ log $ "Action yet to be implemented " <> event.action      

main = launchAff $ do
  runExceptT init
