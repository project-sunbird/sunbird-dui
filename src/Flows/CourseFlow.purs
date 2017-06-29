module Flows.CourseFlow where

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
import Flows.NotificationFlow
import Data.Generic.Rep (class Generic)
import Data.Foreign.Generic (encodeJSON)
import Control.Monad.Eff.Exception (EXCEPTION)
import Prelude
import PureTypes

startCourseFlow state = do
	state <- ui $ HomeScreen
	case state of
		StartCourseInfoFlow {course:courseName} -> startCourseInfoFlow courseName
		GetCoursePage -> do
			responseData <- getCoursesPageApi
			_ <- sendUpdatedState {response : responseData, responseFor : "GetCoursePage", screen:"dummy"} 
			pure $ "Done Api"
		StartNotificationFlow -> startNotificationFlow state
		_ -> pure $ "default"

    
startCourseInfoFlow state = do
	state <- ui $ CourseInfoScreen
	case state of
		DummyCourseInfoAction -> pure $ "handled"
  		_ -> pure $ "default"





