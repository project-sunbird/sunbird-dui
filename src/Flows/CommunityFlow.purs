

module Flows.CommunityFlow where

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
import Types.UITypes
import Types.APITypes
import UI



startCommunityFlow state = do
  state <- ui $ HomeScreen
  case state of
    StartCommunityInfoFlow {community:communityName}-> do
      _ <- startCommunityInfoFlow communityName
      pure $ "action handled"
    StartCommunityViewAllFlow -> startCommunityViewAllFlow state
    _ -> pure $ "aborted"


startCommunityInfoFlow state = do
  state <- ui $ CommunityInfoScreen {name : state}
  case state of
  	ExAction -> pure $ "handled"
  	_ -> pure $ "handled"

startCommunityViewAllFlow state = do
  state <- ui $ CommunityViewAllScreen
  case state of
  	DummyCommunityViewAllAction -> pure $ "handled"
  	_ -> pure $ "handled"






