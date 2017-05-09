module Main where

import Prelude
import Network.HTTP.Affjax
import Control.Monad.Except.Trans
import Partial.Unsafe
import Utils
import Flows.CourseActivity
import Control.Monad.Aff (Aff)
import Control.Monad.Aff (launchAff)
import Control.Monad.Aff.Console (log, logShow)
import Control.Monad.Eff.Exception (Error, message)
import Data.Either (Either(..))
    

init :: forall a b. ExceptT Error (Aff a) (State b)
init = unsafePartial $ do
  state <- showUI "INIT_UI" {screen: "INIT"}
  case state.event of
    "showCourseInfo" -> showCourseInfoFlow state
    _ -> runExceptT init


main = launchAff $ do
  runExceptT init
