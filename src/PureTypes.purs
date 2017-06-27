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

data UserScreen = UserScreen 
data UserScreenAction = LoginAction {userId::String} | LoginApiAction {userName::String, userPass::String}  


data HomeScreen = HomeScreen
data HomeScreenAction = ShowHome {name::String} | StartCourseFlow | StartResourceFlow | StartCommunityFlow | StartProfileFlow | StartCommunityInfoFlow {community::String} | StartCommunityViewAllFlow | StartCourseInfoFlow {course::String}

data InitScreen = InitScreen 
data InitScreenAction = ShowInit  | StartInit

data ResourceScreen = ResourceScreen 
data ResourceScreenAction = DummyResourceAction

data CommunityInfoScreen = CommunityInfoScreen {name::String}
data CommunityInfoScreenAction = DummyInfoAction | ExAction

data CourseInfoScreen = CourseInfoScreen
data CourseInfoScreenAction = DummyCourseInfoAction

data CommunityViewAllScreen = CommunityViewAllScreen
data CommunityViewAllAction = DummyCommunityViewAllAction


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

instance userScreen :: UIScreen UserScreen UserScreenAction where
  generateMockEvents _ = [LoginAction {userId:"String"}, LoginApiAction {userName:"String",userPass:"String"} 
]
  ui x = genericUI x (generateMockEvents x :: Array UserScreenAction)

derive instance genericUnitScreenAction  :: Generic UserScreenAction _
instance decodeUserScreenAction :: Decode UserScreenAction where decode = defaultDecode
instance encodeUserScreenAction :: Encode UserScreenAction where encode = defaultEncode

instance communityInfoScreen :: UIScreen CommunityInfoScreen CommunityInfoScreenAction where
  generateMockEvents _ = [DummyInfoAction]
  ui x = genericUI x (generateMockEvents x :: Array CommunityInfoScreenAction)

derive instance genericCommunityInfoScreenAction  :: Generic CommunityInfoScreenAction _
instance decodeCommunityInfoScreenAction :: Decode CommunityInfoScreenAction where decode = defaultDecode
instance encodeCommunityInfoScreenAction :: Encode CommunityInfoScreenAction where encode = defaultEncode


instance courseInfoScreen :: UIScreen CourseInfoScreen CourseInfoScreenAction where
  generateMockEvents _ = [DummyCourseInfoAction]
  ui x = genericUI x (generateMockEvents x :: Array CourseInfoScreenAction)

derive instance genericCourseInfoScreenAction  :: Generic CourseInfoScreenAction _
instance decodeCourseInfoScreenAction :: Decode CourseInfoScreenAction where decode = defaultDecode
instance encodeCourseInfoScreenAction :: Encode CourseInfoScreenAction where encode = defaultEncode

instance communityViewAllScreen :: UIScreen CommunityViewAllScreen CommunityViewAllAction where
  generateMockEvents _ = [DummyCommunityViewAllAction]
  ui x = genericUI x (generateMockEvents x :: Array CommunityViewAllAction)

derive instance genericCommunityViewAllAction  :: Generic CommunityViewAllAction _
instance decodeCommunityViewAllAction :: Decode CommunityViewAllAction where decode = defaultDecode
instance encodeCommunityViewAllAction :: Encode CommunityViewAllAction where encode = defaultEncode


instance resourceScreen :: UIScreen ResourceScreen ResourceScreenAction where
  generateMockEvents _ = [DummyResourceAction]
  ui x = genericUI x (generateMockEvents x :: Array ResourceScreenAction)

derive instance genericResourceScreenAction  :: Generic ResourceScreenAction _
instance decodeResourceScreenAction :: Decode ResourceScreenAction where decode = defaultDecode
instance encodeResourceScreenAction :: Encode ResourceScreenAction where encode = defaultEncode

