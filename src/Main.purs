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




-- firstScreenFlow :: Aff(ui::UI,console::CONSOLE) String
-- firstScreenFlow = do
--   action <- ui $ HomeScreen
--   case action of
--     ShowHome  -> pure $ "home"
--     _ -> pure $ "aborted"


-- resourceScreenFlow :: Aff(ui::UI,console::CONSOLE) String
-- resourceScreenFlow = do    
--     pure $ "aborted"
  



  -- _ <- liftEff' $ log (encodeJSON (ShowHome))

  -- _ <- ((ui $ InitScreen) :: Aff _ InitScreenAction)


-- genericShowUI :: forall a b e. Encode b => Decode b => a -> Array b -> Aff (ui::UI | e) b
-- genericShowUI a b = do
--   res <- makeAff (\err sc -> sc (encodeJSON (ShowHome)))
--   isValidAction res









-- cFlow :: Aff(ui::UI,console::CONSOLE) String
-- cFlow = do
--    pure $ "hello"
--   action <- ui $ HomeScreen
--   case action of
--     ShowHome -> do
--       liftEff $ log $ "Action handled Show HomeScreen"
--       pure $ "action handled"
--     StartCourseFlow -> pure $ "StartCourseFlow" 
--     StartClassRoomFlow -> pure $ "StartClassRoomFlow" 
--     ShowForum -> pure $ "ShowForum" 
--     _ -> pure $ "aborted"



-- cFlow = do
--   state <- getCallbackFromScreen "HOME" {screen: "HOME"}
--   liftEff $ log $ "vFLow EVENT " 
--   case state.action of
--     "showHome" -> do
--       liftEff $ log $ "Action yet to be implemented " <> state.action 
--       classRoomActivityFlow state
--     "startCourseFlow" -> do
--       response <- getDummyData
--       state <- updateState {response: response} state
--       liftEff $ log "startCourseFlow"
--       courseActivityFlow state
--     "startClassRoomFlow" -> do
--       liftEff $ log "startClassRoomFlow its in cflow"
--       classRoomActivityFlow state
--     "showCommunity" -> do
--       liftEff $ log "communityActivityFlow"
--       communityActivityFlow state
--     "showHome" -> do
--       liftEff $ log "showProfileFlow"
--       classRoomActivityFlow state
--     _ -> do
--       liftEff $ log $ "Action yet to be implemented " <> state.action  


-- changeFlow = launchAff $ do
--   runExceptT cFlow