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
import Types.UITypes
import UI

startFilterFlow state = do
  liftEff $ log $ "Search FLow started"
  event <- ui $ FilterScreen {filterDetails : state}
  case event of
    SearchScreenFromFilter {filterData: details} -> startFilterSearchFlow details	
    _ -> pure $ "aborted"



startFilterSearchFlow state = do
  liftEff $ log $ "Search FLow<><><><><>< started"
  state <- ui $ SearchScreen {filterDetails : state}
  case state of
    ResourceDetailFlow {resourceDetails : details} -> resourceDetailFlow details
    StartFilterFlow{filterDetails : details} -> startFilterFlow details 
    _ -> pure $ "aborted"


resourceDetailFlow state = do
	state <- ui $ ResourceDetailScreen {resourceDetails : state}
	case state of
		DummyResourceDetailAction -> pure $ "handled"
		_ -> pure $ "default"



