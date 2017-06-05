module Utils where

import Prelude
import Data.String
import Data.List (List(..), fromFoldable)
import Data.List.Types
import Data.Identity
import Data.Foreign.Index
import Data.NonEmpty (NonEmpty(..), singleton, head, tail, (:|))
import Data.Foldable
import Data.Array
import Control.Monad.Eff
import Control.Monad.Eff.Console
import Control.Monad.Aff (launchAff, Aff, makeAff, attempt)
import Control.Monad.Eff.Exception (Error, error, try)
import Control.Monad.Eff.Class (liftEff)
import Network.HTTP.StatusCode
import Network.HTTP.RequestHeader
import Data.HTTP.Method (Method(..))
import Data.Either
import Data.Maybe
import Data.Foreign
import Data.Foreign.Class
import Data.Foreign.Generic
import Data.Foreign.Index
import Data.Argonaut.Core as A
import Data.StrMap as StrMap
import Data.Tuple
import Control.Monad.Except.Trans
import Partial.Unsafe
import Data.Bifoldable
import Control.Monad.Eff.Class(liftEff)


-- getEulerLocation = "https://qa.ekstep.in"
getEulerLocation = "http://13.71.127.158:9000"
getApiKey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkMWE2OTgxOWQ0OTc0YzhiYjRlOTQ4YjMxMjBkYjg0NyJ9.AFu4mPKLuYhclntDjbri_L5FN-rQWXk9dVXhlYO2YcA"

    
type State a = {screen :: String |a}

type AffError e = (Error -> Eff e Unit)
type AffSuccess s e = (s -> Eff e Unit)
type ApiResponse = {status :: String, statusCode :: Int, response :: A.Json}
type ExceptionableAff e a = ExceptT Error (Aff e) a
type ExceptionableEff e a = ExceptT Error (Eff e) a

foreign import showUI' :: forall e a b. (AffSuccess (State a) e) -> (AffError e) -> (State b) -> Boolean -> Eff e Unit
foreign import callbackListner' :: forall e a b. (AffSuccess ({|a}) e) -> (AffError e) -> ({|b}) -> Boolean -> Eff e Unit
foreign import sendUpdatedState' :: forall e s1 s2. (AffSuccess (State s1) e) -> (AffError e) -> (State s2) -> Boolean -> Eff e Unit
foreign import updateState' :: forall a b s1 s2 e. (AffSuccess (State s2) e) -> (AffError e) -> a -> (State s1) -> Eff e Unit
foreign import callAPI' :: forall e. (AffSuccess ApiResponse e) -> (AffError e) -> Method -> String -> A.Json -> Array RequestHeader -> Eff e Unit
foreign import getConsumerId' :: forall e a s. (AffSuccess String e) -> (AffError e) -> Eff e Unit                          
foreign import getDeviceId' :: forall e a s. (AffSuccess String e) -> (AffError e) -> Eff e Unit                          
foreign import getUserId' :: forall e a s. (AffSuccess String e) -> (AffError e) -> Eff e Unit                          

getConsumerId = ExceptT (pure <$> makeAff(\error success -> getConsumerId' success error))
getDeviceId = ExceptT (pure <$> makeAff(\error success -> getDeviceId' success error))
getUserId = ExceptT (pure <$> makeAff(\error success -> getUserId' success error))


sendUpdatedState state = ExceptT (pure <$> makeAff(\error success -> sendUpdatedState' success error state false))
sendUpdatedStateSync state = ExceptT (pure <$> makeAff(\error success -> sendUpdatedState' success error state true))



generateReqTokenHeaders :: {consumerId :: String, deviceId :: String, userId :: String} -> Array (RequestHeader)
generateReqTokenHeaders tokens =
  let filtered = filter (\x -> not $ snd(x) == "__failed") [(Tuple "X-Consumer-Id" tokens.consumerId),
                                                            (Tuple "X-Device-Id" tokens.deviceId),
                                                            (Tuple "X-Authenticated-UserId" tokens.userId)] in
  map (\x -> (RequestHeader (fst x) (snd x))) filtered

getReqTokens :: forall e. ExceptT Error (Aff e) {consumerId :: String, deviceId :: String, userId :: String}
getReqTokens = do
  consumerId <- getConsumerId
  deviceId <- getDeviceId
  userId <- getUserId
  pure $ {consumerId, deviceId, userId}



get path headers =
  makeAff(\error success -> callAPI' success error GET ((getEulerLocation) <> path) (A.jsonEmptyObject) headers')
  where headers' = cons (RequestHeader "Content-Type" "application/json") headers

post path headers body =
  makeAff(\error success -> callAPI' success error POST ((getEulerLocation) <> path) body headers')
  where headers' = cons (RequestHeader "Content-Type" "application/json") headers


showUI screen state = ExceptT $ pure <$>
  let updatedState = state {screen = screen} in
  makeAff (\error success -> showUI' success error updatedState false)

showUISync screen state = ExceptT $ pure <$>
  let updatedState = state {screen = screen} in
  makeAff (\error success -> showUI' success error updatedState true)

getCallbackFromScreen screen state = ExceptT $ pure <$>
  let updatedState = state {screen = screen} in
  makeAff (\error success -> callbackListner' success error updatedState false)

updateState changes state = ExceptT $ pure <$> makeAff(\error success -> updateState' success error changes state)


--API CALLS
generateRequestHeaders =
  let filtered = filter (\x -> not $ snd(x) == "__failed") [(Tuple "Authorization" ("Bearer "<>getApiKey))] in
  map (\x -> (RequestHeader (fst x) (snd x))) filtered


getDummyData =
  let requestUrl = "/v1/user/courses/user1"
      headers = (generateRequestHeaders) in
  ExceptT $ attempt $ (get requestUrl headers)

enrollCourse req=
  let requestUrl = "/v1/user/courses/enroll"
      headers = (generateRequestHeaders) in
  ExceptT $ attempt $ (post requestUrl headers req)


getCourses regTokens =
  let requestUrl = "/v1/user/courses/1234"
      headers = (generateReqTokenHeaders regTokens) in
  ExceptT $ attempt $ (get requestUrl headers)

getUserCourses userId =
  let requestUrl = "/v1/user/courses/" <> userId
      headers = (generateRequestHeaders) in
  ExceptT $ attempt $ (get requestUrl headers)  

getExceptT value = ExceptT $ pure $ Right value
