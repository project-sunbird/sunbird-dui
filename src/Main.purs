module Main where

import Control.Monad.Aff
import Prelude (bind, ($), (<>), pure, discard)
import Control.Monad.Except.Trans (runExceptT)
import Utils
import Control.Monad.Eff (Eff)
import Flows.CourseActivity (courseActivityFlow)
import Flows.ClassRoomActivityFlow (classRoomActivityFlow)
import Flows.CommunityActivityFlow (communityActivityFlow)
import Control.Monad.Aff (launchAff)
import Control.Monad.Eff.Console
import Control.Monad.Eff.Class(liftEff)
import Data.Foreign.Class (class Decode, class Encode, encode)
import Data.Generic.Rep (class Generic)
import Data.Foreign.Generic (encodeJSON)
import Control.Monad.Eff.Exception (EXCEPTION)
import Prelude
import PureTypes


main :: Eff (exception::EXCEPTION, ui::UI, console::CONSOLE) Unit
main = void $ launchAff $ begin


begin :: Aff(ui::UI,console::CONSOLE) String
begin = do
  action <- ui $ InitScreen
  case action of
    StartInit -> firstScreenFlow
    _ -> pure $ "aborted"


firstScreenFlow :: Aff(ui::UI,console::CONSOLE) String
firstScreenFlow = do
  action <- ui $ HomeScreen
  case action of
    ShowHome -> resourceScreenFlow
    StartCourseFlow -> pure $ "StartCourseFlow" 
    StartClassRoomFlow -> pure $ "StartClassRoomFlow" 
    ShowForum -> pure $ "ShowForum" 
    _ -> pure $ "aborted"


resourceScreenFlow :: Aff(ui::UI,console::CONSOLE) String
resourceScreenFlow = do    
    pure $ "aborted"
  



  -- _ <- liftEff' $ log (encodeJSON (ShowHome))

  -- _ <- ((ui $ InitScreen) :: Aff _ InitScreenAction)


genericShowUI :: forall a b e. Encode b => Decode b => a -> Array b -> Aff (ui::UI | e) b
genericShowUI a b = do
  res <- makeAff (\err sc -> sc (encodeJSON (ShowHome)))
  isValidAction res



init = do
  event <- showUI "INIT_UI" {screen: "INIT"}
  case event.action of
    "showMainFlow" -> do
      liftEff $ log "showMainFlow"
      init
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
    "showHome" -> do
      liftEff $ log $ "Action yet to be implemented " <> state.action 
      classRoomActivityFlow state
    "startCourseFlow" -> do
      response <- getDummyData
      state <- updateState {response: response} state
      liftEff $ log "startCourseFlow"
      courseActivityFlow state
    "startClassRoomFlow" -> do
      liftEff $ log "startClassRoomFlow its in cflow"
      classRoomActivityFlow state
    "showCommunity" -> do
      liftEff $ log "communityActivityFlow"
      communityActivityFlow state
    "showHome" -> do
      liftEff $ log "showProfileFlow"
      classRoomActivityFlow state
    _ -> do
      liftEff $ log $ "Action yet to be implemented " <> state.action  


changeFlow = launchAff $ do
  runExceptT cFlow