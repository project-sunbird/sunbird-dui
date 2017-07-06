module Flows.ProfileFlow where

import Control.Monad.Aff
import Prelude (bind, ($), (<>), pure, discard)
import Control.Monad.Except.Trans (runExceptT)
import Utils
import Control.Monad.Eff (Eff)
import Control.Monad.Aff (launchAff)
import Control.Monad.Eff.Console
import Control.Monad.Eff.Class(liftEff)
import Data.Foreign.Class (class Decode, class Encode, encode)
import Data.Generic.Rep (class Generic)
import Flows.NotificationFlow
import Data.Foreign.Generic (encodeJSON)
import Control.Monad.Eff.Exception (EXCEPTION)
import Types.UITypes
import Types.APITypes
import UI



startProfileFlow state = do
	state <- ui $ HomeScreen
	case state of
		StartNotificationFlow -> startNotificationFlow state
		_ -> pure $ "action not matched"