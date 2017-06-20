module Main where

import Control.Monad.Aff
import Prelude (bind, ($), (<>), pure, discard)
import Control.Monad.Except.Trans (runExceptT)
import Utils
import Control.Monad.Eff (Eff)
import Flows.CourseActivity (courseActivityFlow)
import Flows.ClassRoomActivityFlow (classRoomActivityFlow)
import Control.Monad.Aff (launchAff)
import Control.Monad.Eff.Console
import Control.Monad.Eff.Class(liftEff)
import Data.Foreign.Class (class Decode, class Encode, encode)
import Data.Generic.Rep (class Generic)
import Data.Foreign.Generic (encodeJSON)
import Control.Monad.Eff.Exception (EXCEPTION)
import Prelude

--init :: forall a b. ExceptT Error (Aff a) (State b)

data HomeScreen = HomeScreen 
data HomeScreenAction = ShowHome | StartCourseFlow | StartClassRoomFlow | ShowForum

data InitScreen = InitScreen 
data InitScreenAction = ShowInit | StartInit

instance homeScreen :: UIScreen HomeScreen HomeScreenAction where
  generateMockEvents _ = [ShowHome ,StartCourseFlow]
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


main :: Eff (exception::EXCEPTION, ui::UI, console::CONSOLE) Unit
main = void $ launchAff $ begin

firstScreenFlow :: Aff(ui::UI,console::CONSOLE) String
firstScreenFlow = do
  action <- ui $ HomeScreen
  case action of
    ShowHome -> pure $ "ShowHome"
    StartCourseFlow -> pure $ "StartCourseFlow" 
    StartClassRoomFlow -> pure $ "StartClassRoomFlow" 
    ShowForum -> pure $ "ShowForum" 
    _ -> pure $ "aborted"


begin :: Aff(ui::UI,console::CONSOLE) String
begin = do
  action <- ui $ InitScreen
  case action of
    StartInit -> firstScreenFlow
    _ -> pure $ "aborted"



  -- _ <- liftEff' $ log (encodeJSON (ShowHome))

  -- _ <- ((ui $ InitScreen) :: Aff _ InitScreenAction)



genericShowUI :: forall a b e. Encode b => Decode b => a -> Array b -> Aff (ui::UI | e) b
genericShowUI a b = do
  res <- makeAff (\err sc -> sc (encodeJSON (ShowHome)))
  isValidAction res


tFlow = do
  state <- getCallbackFromScreen "HOME" {screen: "HOME"}
  case state.action of
    "showMainFlow" -> do
      liftEff $ log "showMainFlow"
    _ -> do
      liftEff $ log $ "Action yet to be implemented " <> state.action    


init = do
  event <- showUI "INIT_UI" {screen: "INIT"}
  case event.action of
    "showMainFlow" -> do
      liftEff $ log "showMainFlow"
      init
    _ -> do
      liftEff $ log $ "Action yet to be implemented " <> event.action


home = do
  event <- showUI "HOME" {screen: "HOME"}
  case event.action of
    _ -> do
      liftEff $ log $ "Action yet to be implemented " <> event.action     


cFlow = do
  state <- getCallbackFromScreen "HOME" {screen: "HOME"}
  liftEff $ log $ "vFLow EVENT " 
  case state.action of
    "showHome" -> do
      liftEff $ log "showHomeFlow"
      classRoomActivityFlow state
    "startCourseFlow" -> do
      response <- getDummyData
      state <- updateState {response: response} state
      liftEff $ log "startCourseFlow"
      courseActivityFlow state
    "startClassRoomFlow" -> do
      liftEff $ log "startClassRoomFlow"
      classRoomActivityFlow state
    "showForum" -> do
      liftEff $ log "showForumFlow"
      classRoomActivityFlow state
    "showHome" -> do
      liftEff $ log "showProfileFlow"
      classRoomActivityFlow state
    _ -> do
      liftEff $ log $ "Action yet to be implemented " <> state.action  

typeFlow = launchAff $ do
  runExceptT tFlow    



-- main = launchAff $ do
--   runExceptT init



changeFlow = launchAff $ do
  runExceptT cFlow