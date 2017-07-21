
module Flows.Commons where

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


resourceDetailFlow state = do
	state <- ui $ ResourceDetailScreen {resourceDetails : state}
	case state of
		DummyResourceDetailAction -> pure $ "handled"
		_ -> pure $ "default"

startCourseDetailFlow cDetail= do
  event <- ui $ CourseEnrolledScreen {courseDetails:cDetail}
  case event of
    DummyCourseEnrolledAction -> pure $ "handled"
    ShowModuleScreen {moduleName:mName,moduleDetails:mDetails}-> startModuleDetailsFlow mName mDetails cDetail
    _ -> pure $ "default"

startModuleDetailsFlow mName mDetails parentCourse= do
  event <- ui $ ModuleDetailScreen {moduleName:mName,moduleDetails:mDetails}
  case event of
    DummyModuleDetailsAction -> pure $ "handled"
    ShowSubModuleScreen {moduleName:mName,moduleDetails:mDetails}-> resourceSubModuleDetailsFlow mName mDetails parentCourse
    BackToParent -> startCourseDetailFlow parentCourse
    _ -> pure $ "default"

resourceSubModuleDetailsFlow mName mDetails parentCourse= do
  event <- ui $ AlternateModuleDetailScreen {moduleName:mName,moduleDetails:mDetails}
  case event of
    DummyAlternateModuleDetailAction -> pure $ "handled"
    ShowModuleAgainScreen {moduleName:mName,moduleDetails:mDetails}-> startModuleDetailsFlow mName mDetails parentCourse
    BackToHome -> startCourseDetailFlow parentCourse
    _ -> pure $ "default"
