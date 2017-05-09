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


-- showCourseInfo state = do
--   state <- showUI "COURSE_INFO_SCREEN" state
--   state <- updateState {otpStatus: "TESTING"} state
--   sendUpdatedState state


