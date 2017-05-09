module Flows.CourseActivity where

import Prelude
import Data.Either (either)
import Control.Monad.Aff.Console (log, logShow)
import Control.Monad.Aff (Aff)
import Network.HTTP.Affjax
import Control.Monad.Eff.Class (liftEff)
import Control.Monad.Eff.Exception (Error)
import Data.Argonaut.Core as A
import Control.Monad.Except.Trans
import Partial.Unsafe
import Data.Maybe
import Utils
import Data.Foreign


showCourseInfoFlow :: forall a b c. (State a) -> ExceptT Error (Aff b) (State c)
showCourseInfoFlow state = do
  state <- showUI "COURSE_INFO_SCREEN" state
  case state.event of
    "showCourseActivity" -> showCourseActivityFlow state
    _ ->showCourseInfoFlow state


showCourseActivityFlow :: forall a b c. (State a) -> ExceptT Error (Aff b) (State c)
showCourseActivityFlow state = do
  state <- showUI "COURSE_ACTIVITY_SCREEN" state
  case state.event of
    "home" -> showCourseInfoFlow state
    _      -> showCourseActivityFlow state
