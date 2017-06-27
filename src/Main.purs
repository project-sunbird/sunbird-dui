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
    StartInit -> pure $ "start init"
    _ -> pure $ "aborted"

cFlow :: Aff(ui::UI,console::CONSOLE)  String
cFlow = do
  liftEff $ log $ "Its in cFlow"
  liftEff $ log (encodeJSON (ShowHome {name:"kirAN"}))
  state <- ui $ HomeScreen
  case state of
    ShowHome {name:x} -> do
      liftEff $ log $ "Action handled Show HomeScreen"
      pure $ "action handled"
    StartCourseFlow -> startCourseFlow state
    StartResourceFlow -> startResourceFlow state
    StartCommunityFlow -> startCommunityFlow state
    StartProfileFlow -> startProfileFlow state
    _ -> pure $ "aborted"

changeFlow = void $ launchAff $ cFlow

