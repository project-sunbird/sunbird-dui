module Flows.FilterFlow where

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
import Data.Generic.Rep (class Generic)
import Data.Foreign.Generic (encodeJSON)
import Control.Monad.Eff.Exception (EXCEPTION)
import Prelude
import PureTypes

startFilterFlow state = do
  liftEff $ log $ "Search FLow started"
  state <- ui $ FilterScreen
  case state of
    SearchScreenFromFilter -> startFilterSearchFlow state
       	
    _ -> pure $ "aborted"



startFilterSearchFlow state = do
  liftEff $ log $ "Search FLow started"
  state <- ui $ SearchScreen
  case state of
    ResourceDetailFlow {resourceDetails : details} -> resourceDetailFlow details
    StartFilterFlow -> startFilterFlow state
    _ -> pure $ "aborted"


resourceDetailFlow state = do
	state <- ui $ ResourceDetailScreen {resourceDetails : state}
	case state of
		DummyResourceDetailAction -> pure $ "handled"
		_ -> pure $ "default"



