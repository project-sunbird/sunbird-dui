module Main where

import Control.Monad.Aff
import Prelude (bind, ($), (<>), pure, discard)
import Control.Monad.Except.Trans (runExceptT)
import Utils
import Control.Monad.Eff (Eff)
import Control.Monad.Aff (launchAff)
import Control.Monad.Eff.Console
import Control.Monad.Eff.Class(liftEff)
import Data.Foreign.Class (class Decode, class Encode, encode)
import Data.Maybe
import Flows.CommunityFlow
import Flows.CourseFlow
import Flows.ProfileFlow
import Flows.ResourceFlow
import Flows.FilterFlow
import Flows.NotificationFlow
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
    StartInit -> cFlow
    _ -> pure $ "aborted"


userScreenFlow = do
  action <- ui UserScreen
  case action of
    LoginApiAction{userName:x,userPass:y} -> do
      --liftEff $ log "FOR UN :" <> x <> " PASS :" <> y
      responseData <- userLogin x y
      --userScreenFlow {state:"tab3"}
      _ <- sendUpdatedState {response : responseData, responseFor : "LoginApiAction", screen:"asas"} 
      pure $ "Aborted 3"
    LoginAction -> do
      liftEff $ log $ "LoginAction"
      cFlow
    _ -> pure $ "Aborted"

cFlow = do
  liftEff $ log $ "Its in cFlow"
  action <- ui $ HomeScreen
  case action of
    ShowHome {name:x} -> do
      liftEff $ log $ "Action handled Show HomeScreen"
      pure $ "action handled"
    StartCourseFlow -> startCourseFlow action
    StartResourceFlow -> startResourceFlow action
    StartCommunityFlow -> startCommunityFlow action
    StartProfileFlow -> startProfileFlow action
    StartNotificationFlow -> startNotificationFlow action
    StartResourceDetailFlow {resourceDetails : details} -> startResourceDetailFlow details
    StartCourseInfoFlow {course:x} -> startCourseInfoFlow action
    StartSearchFlow -> startHomeSearchFlow action

    _ -> pure $ "aborted"

startHomeSearchFlow state = do
  liftEff $ log $ "Search FLow started"
  state <- ui $ SearchScreen
  case state of
    ResourceDetailFlow {resourceDetails : details} -> startResourceDetailFlow details
    StartFilterFlow -> startFilterFlow state
    _ -> pure $ "aborted"


changeFlow = void $ launchAff $ cFlow

