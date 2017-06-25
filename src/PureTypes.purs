module PureTypes where

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
import Data.Foreign.Generic (encodeJSON)
import Control.Monad.Eff.Exception (EXCEPTION)
import Prelude


data HomeScreen = HomeScreen 
data HomeScreenAction = ShowHome {name::String} | StartCourseFlow | StartResourceFlow | StartCommunityFlow | StartProfileFlow

data InitScreen = InitScreen 
data InitScreenAction = ShowInit  | StartInit

data ResourceScreen = ResourceScreen 
data ResourceScreenAction = DummyResourceAction


instance homeScreen :: UIScreen HomeScreen HomeScreenAction where
  generateMockEvents _ = [ShowHome {name:"Kiran"} ,StartCourseFlow]
  ui x = genericUI x (generateMockEvents x :: Array HomeScreenAction)

derive instance genericHomeScreenAction  :: Generic HomeScreenAction _
instance decodeHomeScreenAction :: Decode HomeScreenAction where decode = defaultDecode
instance encodeHomeScreenAction :: Encode HomeScreenAction where encode = defaultEncode

instance initScreen :: UIScreen InitScreen InitScreenAction where
  generateMockEvents _ = [ShowInit ,StartInit]
  ui x = genericUI x (generateMockEvents x :: Array InitScreenAction)

derive instance genericInitScreenAction  :: Generic InitScreenAction _
instance decodeInitScreenAction :: Decode InitScreenAction where decode = defaultDecode
instance encodeInitScreenAction :: Encode InitScreenAction where encode = defaultEncode

instance resourceScreen :: UIScreen ResourceScreen ResourceScreenAction where
  generateMockEvents _ = [DummyResourceAction]
  ui x = genericUI x (generateMockEvents x :: Array ResourceScreenAction)

derive instance genericResourceScreenAction  :: Generic ResourceScreenAction _
instance decodeResourceScreenAction :: Decode ResourceScreenAction where decode = defaultDecode
instance encodeResourceScreenAction :: Encode ResourceScreenAction where encode = defaultEncode