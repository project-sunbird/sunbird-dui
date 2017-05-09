module Main where

import Prelude
import Control.Monad.Except.Trans (ExceptT, runExceptT)
import Partial.Unsafe (unsafePartial)
import Utils (State, showUI)
import Flows.CourseActivity
import Control.Monad.Aff (Aff , launchAff)
import Control.Monad.Eff.Exception (Error)
import Control.Monad    
import Control.Monad.Eff.Console
import Control.Monad.Eff.Class(liftEff)

--init :: forall a b. ExceptT Error (Aff a) (State b)
init = do
  event <- showUI "INIT_UI" {screen: "INIT"}
  case event.action of
    "showCourseInfo" -> do
      liftEff $ log "showCourseInfoFlow"
      showCourseInfoFlow {}
    _ -> do
      liftEff $ log $ "Action yet to be implemented " <> event.action
  --pure $ "Complete"
  -- case state.event of
  --   "showCourseInfo" -> showCourseInfoFlow state
  --   _ -> runExceptT init


main = launchAff $ do
  runExceptT init
