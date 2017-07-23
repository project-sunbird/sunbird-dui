
module Main where

import Control.Monad.Aff

import Utils

import Fragments.CommunityFragment
import Fragments.CourseFragment
import Fragments.ProfileFragment
import Fragments.ResourceFragment
import Fragments.HomeFragment

import Control.Monad.Eff (Eff)
import Control.Monad.Aff (launchAff)
import Control.Monad.Eff.Console
import Control.Monad.Eff.Class(liftEff)
import Data.Foreign.Generic (encodeJSON)
import Control.Monad.Eff.Exception (EXCEPTION)
import Prelude
import Types.UITypes
import Types.APITypes
import UI


main :: Eff (exception::EXCEPTION, ui::UI, console::CONSOLE) Unit
main = void $ launchAff $ splashScreenActivity "{}" "Main" "{}"

splashScreenActivity input whereFrom whatToSendBack= do
    event <- ui $ SplashScreenActivity
    case event of
        OPEN_UserScreenActivity -> userScreenActivity "{}" "SplashScreen" input
        _ -> pure $ "SplashScreenActivity"


userScreenActivity input whereFrom whatToSendBack = do
    event <- ui UserActivity
    case event of
        API_SignUp{userName:x1,email:x2,firstName:x3,password:x4,mobileNumber:x5,language:x6,api_token:x7} -> do
            responseData <- userSignup x1 x2 x3 x4 x5 x6 x7
            _ <- sendUpdatedState {response : responseData, responseFor : "SignUpApiAction", screen:"asas"} 
            pure $ "Aborted 3"
        OPEN_MainActivity -> mainActivity "{}" "UserActivity" input 
        _ -> pure $ "UserActivity"

mainActivity input whereFrom whatToSendBack = do
    event <- ui $ MainActivity
    case event of
        OPEN_HomeFragment -> homeFragment input "MainActivity" input
        OPEN_CourseFragment -> courseFragment input "MainActivity" input
        OPEN_ResourceFragment -> resourceFragment input "MainActivity" input
        OPEN_CommunityFragment -> communityFragment input "MainActivity" input
        OPEN_ProfileFragment -> profileFragment input "MainActivity" input
        
        API_CourseFragment {user_token:x,api_token:y}-> do
            responseData <- getCoursesPageApi x y
            _ <- sendUpdatedState {response : responseData, responseFor : "API_CourseFragment", screen:"asas"} 
            pure $ "handled"
        API_ResourceFragment {user_token:x,api_token:y}-> do
            responseData <- getResourcePageApi x y
            _ <- sendUpdatedState {response : responseData, responseFor : "API_ResourceFragment", screen:"asas"}
            pure $ "handled"
        API_ProfileFragment {user_token:x,api_token:y}-> do
            responseData <- getProfileDetail x y
            _ <- sendUpdatedState {response : responseData, responseFor : "API_ProfileFragment", screen:"asas"}
            pure $ "handled"        
        _ -> pure $ "MainActivity"


changeFlow = void $ launchAff $ mainActivity "{}" "LogInScreen" "Nothing"
